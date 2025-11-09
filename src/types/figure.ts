/**
 * Type definitions for geodesic figure (dome) geometry
 */

import { Vector3 } from './geometry'

/**
 * Base polyhedron type
 */
export type PolyhedronType = 'Icosahedron' | 'Octohedron'

/**
 * Subdivision class (for detail levels >= 2)
 */
export type SubdivisionClass = 'I' | 'II' | 'III'

/**
 * Subdivision method (for detail levels >= 3)
 */
export type SubdivisionMethod = 'Chords' | 'Arcs' | 'Kruschke' | 'Mexican'

/**
 * Rotational symmetry
 */
export type RotationalSymmetry = 'Pentad' | 'Cross' | 'Triad'

/**
 * Fullerene type (special geometric structure)
 */
export type FullereneType = 'none' | 'inscribed' | 'circumscribed'

/**
 * Cutting mode for partial spheres
 */
export type CuttingMode = 'faces' | 'height'

/**
 * Face (polygon) in the geodesic structure
 */
export interface Face {
  vertices: Vector3[]
  color?: string
  index?: number
}

/**
 * Edge in the geodesic structure
 */
export interface Edge {
  vertexA: Vector3
  vertexB: Vector3
  color?: string
}

/**
 * Vertex point in the geodesic structure
 */
export interface Vertex {
  position: Vector3
  index?: number
  connections?: number[] // indices of connected vertices
}

/**
 * Parameters for figure creation
 */
export interface FigureParams {
  base: PolyhedronType
  detail: number // Level of detail (1-5)
  subdivClass: SubdivisionClass
  subdivMethod: SubdivisionMethod
  symmetry: RotationalSymmetry
  fullerenType: FullereneType
  radius: number // Sphere radius in meters
  partialMode: CuttingMode
  partial: string // e.g. '7/12' or '0.777'
  partialHeight?: number
  alignTheBase: boolean
}

/**
 * Figure class - geometric calculations for geodesic domes
 */
export abstract class Figure {
  params: FigureParams
  vertices: Vertex[]
  faces: Face[]
  edges: Edge[]

  constructor(params: FigureParams)

  // Core methods
  abstract initialize(): void
  abstract subdivide(): void
  abstract cutPartial(): void
  abstract createVertices(): void
  abstract createFaces(): void
  abstract createEdges(): void

  // Utility methods
  abstract getVertexCount(): number
  abstract getFaceCount(): number
  abstract getEdgeCount(): number
  abstract calculateSurfaceArea(): number
  abstract getStats(): GeometryStats
}

/**
 * Icosahedron - base polyhedron with 20 faces
 */
export class Icosahedron extends Figure {
  constructor(params: FigureParams)
}

/**
 * Octohedron - base polyhedron with 8 faces
 */
export class Octohedron extends Figure {
  constructor(params: FigureParams)
}

/**
 * Statistics about the geometry
 */
export interface GeometryStats {
  vertexCount: number
  faceCount: number
  edgeCount: number
  surfaceArea: number
  volume?: number
}
