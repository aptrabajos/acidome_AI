/**
 * Figure - Geodesic dome geometry classes
 * Handles Icosahedron and Octohedron base polyhedra with subdivision
 */

import { Vector3Class, Metrics } from './Metrics'
import { FigureParams, Face, Edge, Vertex, PolyhedronType, GeometryStats } from '../types/figure'

/**
 * Base Figure class for geodesic domes
 */
export abstract class Figure {
  params: FigureParams
  vertices: Vertex[] = []
  faces: Face[] = []
  edges: Edge[] = []
  private vertexMap: Map<string, number> = new Map() // For deduplication

  constructor(params: FigureParams) {
    this.params = params
    this.initialize()
  }

  /**
   * Initialize the figure
   */
  protected initialize(): void {
    this.vertices = []
    this.faces = []
    this.edges = []
    this.vertexMap.clear()

    this.createBaseVertices()
    this.createBaseFaces()
    this.subdivide()
    this.scaleToRadius(this.params.radius)
    this.createEdges()

    if (this.params.partial !== '1/1') {
      this.cutPartial()
    }

    if (this.params.alignTheBase) {
      this.alignBase()
    }
  }

  /**
   * Create base vertices (implemented by subclasses)
   */
  abstract createBaseVertices(): void

  /**
   * Create base faces (implemented by subclasses)
   */
  abstract createBaseFaces(): void

  /**
   * Add vertex with deduplication
   */
  protected addVertex(position: Vector3Class, index?: number): number {
    const key = this.vectorToKey(position)

    if (this.vertexMap.has(key)) {
      return this.vertexMap.get(key)!
    }

    const vertexIndex = this.vertices.length
    this.vertices.push({
      position: position.clone(),
      index: vertexIndex,
      connections: []
    })

    this.vertexMap.set(key, vertexIndex)
    return vertexIndex
  }

  /**
   * Get vertex index (with deduplication)
   */
  protected getVertexIndex(position: Vector3Class): number {
    const key = this.vectorToKey(position)
    if (this.vertexMap.has(key)) {
      return this.vertexMap.get(key)!
    }
    return this.addVertex(position)
  }

  /**
   * Convert vector to map key for deduplication
   */
  private vectorToKey(v: Vector3Class, precision: number = 10): string {
    const p = Math.pow(10, precision)
    return `${Math.round(v.x * p)},${Math.round(v.y * p)},${Math.round(v.z * p)}`
  }

  /**
   * Subdivide the base geometry
   */
  private subdivide(): void {
    const detail = this.params.detail

    for (let level = 1; level < detail; level++) {
      this.subdivideOnce()
    }
  }

  /**
   * Single subdivision iteration
   */
  private subdivideOnce(): void {
    const newFaces: Face[] = []
    const newVertexMap = new Map<string, Vector3Class>()

    for (const face of this.faces) {
      const faceVertices = face.vertices.map(v => new Vector3Class().copy(v))

      // Find or create midpoint vertices
      const midpoints: Vector3Class[] = []
      for (let i = 0; i < faceVertices.length; i++) {
        const v1 = faceVertices[i]
        const v2 = faceVertices[(i + 1) % faceVertices.length]
        const mid = Metrics.lerp(v1, v2, 0.5)
        mid.normalize() // Project to unit sphere
        midpoints.push(mid)
      }

      // Create 4 new triangular faces from each original triangle
      for (let i = 0; i < faceVertices.length; i++) {
        const v0 = faceVertices[i]
        const m0 = midpoints[i]
        const m1 = midpoints[(i - 1 + faceVertices.length) % faceVertices.length]

        // Corner triangle
        newFaces.push({
          vertices: [v0, m0, m1],
          color: face.color
        })
      }

      // Center triangle (for triangular faces)
      if (faceVertices.length === 3) {
        newFaces.push({
          vertices: [midpoints[0], midpoints[1], midpoints[2]],
          color: face.color
        })
      }
    }

    this.faces = newFaces
  }

  /**
   * Scale all vertices to given radius
   */
  private scaleToRadius(radius: number): void {
    for (const vertex of this.vertices) {
      const length = vertex.position.length()
      vertex.position.scale(radius / length)
    }
  }

  /**
   * Create edges from faces
   */
  private createEdges(): void {
    const edgeSet = new Set<string>()

    for (const face of this.faces) {
      const vertices = face.vertices
      for (let i = 0; i < vertices.length; i++) {
        const v1 = vertices[i]
        const v2 = vertices[(i + 1) % vertices.length]

        const key = this.createEdgeKey(v1, v2)
        if (!edgeSet.has(key)) {
          edgeSet.add(key)
          this.edges.push({
            vertexA: v1,
            vertexB: v2,
            color: '#999'
          })
        }
      }
    }
  }

  /**
   * Create a consistent edge key
   */
  private createEdgeKey(v1: Vector3Class, v2: Vector3Class): string {
    const k1 = this.vectorToKey(v1 as Vector3Class)
    const k2 = this.vectorToKey(v2 as Vector3Class)
    return k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`
  }

  /**
   * Cut partial sphere
   */
  private cutPartial(): void {
    // Parse partial parameter
    let cutHeight: number

    if (this.params.partialMode === 'faces') {
      // Parse 'X/Y' format
      const match = this.params.partial.match(/(\d+)\/(\d+)/)
      if (match) {
        const numerator = parseInt(match[1])
        const denominator = parseInt(match[2])
        cutHeight = -1 + (2 * numerator) / denominator
      } else {
        cutHeight = 0
      }
    } else {
      cutHeight = this.params.partialHeight || 0.777
    }

    // Remove vertices and faces above/below the cutting plane
    this.faces = this.faces.filter(face => {
      return face.vertices.every(v => v.y >= cutHeight * this.params.radius)
    })

    this.vertices = this.vertices.filter(v => {
      return v.position.y >= cutHeight * this.params.radius
    })
  }

  /**
   * Align base to be horizontal (at Y=0)
   */
  private alignBase(): void {
    // Find lowest Y coordinate
    let minY = Infinity
    for (const vertex of this.vertices) {
      minY = Math.min(minY, vertex.position.y)
    }

    // Translate all vertices so minimum Y is at 0
    for (const vertex of this.vertices) {
      vertex.position.y -= minY
    }
  }

  /**
   * Get vertex count
   */
  getVertexCount(): number {
    return this.vertices.length
  }

  /**
   * Get face count
   */
  getFaceCount(): number {
    return this.faces.length
  }

  /**
   * Get edge count
   */
  getEdgeCount(): number {
    return this.edges.length
  }

  /**
   * Calculate total surface area
   */
  calculateSurfaceArea(): number {
    let area = 0
    for (const face of this.faces) {
      if (face.vertices.length === 3) {
        const [v0, v1, v2] = face.vertices as [Vector3Class, Vector3Class, Vector3Class]
        const a = Metrics.distance(v0, v1)
        const b = Metrics.distance(v1, v2)
        const c = Metrics.distance(v2, v0)
        area += Metrics.triangleHeronArea(a, b, c)
      }
    }
    return area
  }

  /**
   * Get geometry statistics
   */
  getStats(): GeometryStats {
    return {
      vertexCount: this.getVertexCount(),
      faceCount: this.getFaceCount(),
      edgeCount: this.getEdgeCount(),
      surfaceArea: this.calculateSurfaceArea()
    }
  }
}

/**
 * Icosahedron - 20 triangular faces
 * Perfect symmetry and subdivision properties
 */
export class Icosahedron extends Figure {
  protected createBaseVertices(): void {
    const phi = (1 + Math.sqrt(5)) / 2 // Golden ratio

    const vertices = [
      // Top and bottom
      [-1, phi, 0],
      [1, phi, 0],
      [-1, -phi, 0],
      [1, -phi, 0],
      // Vertical pairs
      [0, -1, phi],
      [0, 1, phi],
      [0, -1, -phi],
      [0, 1, -phi],
      // Horizontal pairs
      [phi, 0, -1],
      [phi, 0, 1],
      [-phi, 0, -1],
      [-phi, 0, 1]
    ]

    for (const [x, y, z] of vertices) {
      const v = new Vector3Class(x, y, z)
      v.normalize()
      this.addVertex(v)
    }
  }

  protected createBaseFaces(): void {
    // Icosahedron faces
    const faceIndices = [
      // 5 faces around point 0
      [0, 11, 5],
      [0, 5, 1],
      [0, 1, 7],
      [0, 7, 10],
      [0, 10, 11],
      // 5 adjacent faces
      [1, 5, 9],
      [5, 11, 4],
      [11, 10, 2],
      [10, 7, 6],
      [7, 1, 8],
      // 5 faces around point 3
      [3, 9, 4],
      [3, 4, 2],
      [3, 2, 6],
      [3, 6, 8],
      [3, 8, 9],
      // 5 adjacent faces
      [4, 9, 5],
      [2, 4, 11],
      [6, 2, 10],
      [8, 6, 7],
      [9, 8, 1]
    ]

    for (const indices of faceIndices) {
      this.faces.push({
        vertices: indices.map(i => this.vertices[i].position)
      })
    }
  }
}

/**
 * Octohedron - 8 triangular faces
 * Higher symmetry, useful for certain applications
 */
export class Octohedron extends Figure {
  protected createBaseVertices(): void {
    const vertices = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1]
    ]

    for (const [x, y, z] of vertices) {
      const v = new Vector3Class(x, y, z)
      v.normalize()
      this.addVertex(v)
    }
  }

  protected createBaseFaces(): void {
    // Octohedron faces
    const faceIndices = [
      [0, 2, 4],
      [0, 4, 3],
      [0, 3, 5],
      [0, 5, 2],
      [1, 4, 2],
      [1, 3, 4],
      [1, 5, 3],
      [1, 2, 5]
    ]

    for (const indices of faceIndices) {
      this.faces.push({
        vertices: indices.map(i => this.vertices[i].position)
      })
    }
  }
}

/**
 * Factory function to create appropriate Figure based on parameters
 */
export function createFigure(params: FigureParams): Figure {
  switch (params.base) {
    case 'Icosahedron':
      return new Icosahedron(params)
    case 'Octohedron':
      return new Octohedron(params)
    default:
      throw new Error(`Unknown base polyhedron: ${params.base}`)
  }
}
