/**
 * Product - Physical components and budget calculation for geodesic domes
 */

import { Vector3Class, Metrics } from './Metrics'
import { Figure } from './Figure'
import {
  ProductParams,
  Panel,
  Beam,
  Connector,
  Budget,
  BudgetItem
} from '../types/product'

/**
 * Product class - manages physical components and budget
 */
export class Product {
  params: ProductParams
  figure: Figure
  panels: Panel[] = []
  beams: Beam[] = []
  connectors: Connector[] = []
  budgets: Budget[] = []

  constructor(figure: Figure, params: ProductParams) {
    this.figure = figure
    this.params = params

    this.generateFromFigure()
    this.calculateBudget()
  }

  /**
   * Generate physical components from figure geometry
   */
  private generateFromFigure(): void {
    this.panels = []
    this.beams = []
    this.connectors = []

    // Create panels from faces
    for (const face of this.figure.faces) {
      const panel: Panel = {
        vertices: face.vertices,
        area: this.calculatePolygonArea(face.vertices),
        perimeter: this.calculatePolygonPerimeter(face.vertices),
        color: face.color || '#cccccc'
      }
      this.panels.push(panel)
    }

    // Create beams from edges
    for (const edge of this.figure.edges) {
      const length = Metrics.distance(edge.vertexA, edge.vertexB)
      const beam: Beam = {
        start: edge.vertexA as Vector3Class,
        end: edge.vertexB as Vector3Class,
        length,
        width: this.params.beamsWidth,
        thickness: this.params.beamsThickness,
        color: edge.color || '#999999'
      }
      this.beams.push(beam)
    }

    // Create connectors from vertices
    for (let i = 0; i < this.figure.vertices.length; i++) {
      const vertex = this.figure.vertices[i]
      const degree = this.figure.edges.filter(
        e =>
          Metrics.distance(e.vertexA, vertex.position) < 0.01 ||
          Metrics.distance(e.vertexB, vertex.position) < 0.01
      ).length

      const connector: Connector = {
        position: vertex.position,
        type: this.params.connectorType,
        degree,
        color: '#ff6600'
      }
      this.connectors.push(connector)
    }
  }

  /**
   * Calculate polygon area using Heron's formula
   */
  private calculatePolygonArea(vertices: any[]): number {
    if (vertices.length < 3) return 0

    let area = 0
    for (let i = 0; i < vertices.length; i++) {
      const v0 = vertices[i]
      const v1 = vertices[(i + 1) % vertices.length]
      const v2 = vertices[(i + 2) % vertices.length]

      if (vertices.length === 3) {
        const a = Metrics.distance(v0, v1)
        const b = Metrics.distance(v1, v2)
        const c = Metrics.distance(v2, v0)
        area = Metrics.triangleHeronArea(a, b, c)
        break
      }
    }

    return area
  }

  /**
   * Calculate polygon perimeter
   */
  private calculatePolygonPerimeter(vertices: any[]): number {
    let perimeter = 0
    for (let i = 0; i < vertices.length; i++) {
      const v1 = vertices[i]
      const v2 = vertices[(i + 1) % vertices.length]
      perimeter += Metrics.distance(v1, v2)
    }
    return perimeter
  }

  /**
   * Calculate budget (materials needed)
   */
  private calculateBudget(): void {
    this.budgets = []

    // Beams/Lines budget
    const lineBudget: Budget = {
      type: 'line',
      items: [],
      totalQuantity: 0,
      totalLength: 0
    }

    // Group beams by length (with rounding)
    const beamLengths: Map<string, Beam[]> = new Map()
    for (const beam of this.beams) {
      const roundedLength = (Math.round(beam.length * 100) / 100).toFixed(2)
      const key = `${roundedLength}m`

      if (!beamLengths.has(key)) {
        beamLengths.set(key, [])
      }
      beamLengths.get(key)!.push(beam)
    }

    // Create budget items for beams
    for (const [size, beams] of beamLengths.entries()) {
      const beamLength = parseFloat(size) // in meters
      const item: BudgetItem = {
        size,
        quantity: beams.length,
        unitLength: beamLength,
        totalLength: beamLength * beams.length
      }
      lineBudget.items.push(item)
      lineBudget.totalQuantity += beams.length
      lineBudget.totalLength! += item.totalLength!
    }

    this.budgets.push(lineBudget)

    // Panels budget
    const panelBudget: Budget = {
      type: 'panel',
      items: [
        {
          size: 'panels',
          quantity: this.panels.length,
          unitLength: 0
        }
      ],
      totalQuantity: this.panels.length
    }
    this.budgets.push(panelBudget)

    // Connectors budget
    const connectorBudget: Budget = {
      type: 'connector',
      items: [
        {
          size: 'connectors',
          quantity: this.connectors.length,
          unitLength: 0
        }
      ],
      totalQuantity: this.connectors.length
    }
    this.budgets.push(connectorBudget)
  }

  /**
   * Get panel count
   */
  getPanelCount(): number {
    return this.panels.length
  }

  /**
   * Get beam count
   */
  getBeamCount(): number {
    return this.beams.length
  }

  /**
   * Get connector count
   */
  getConnectorCount(): number {
    return this.connectors.length
  }

  /**
   * Get total beam length
   */
  getTotalBeamLength(): number {
    return this.beams.reduce((sum, beam) => sum + beam.length, 0)
  }

  /**
   * Export budget
   */
  exportBudget(): Budget[] {
    return this.budgets
  }

  /**
   * Export as OBJ format
   */
  exportOBJ(): string {
    let obj = '# Acidome - Geodesic Dome\n'
    obj += `# Vertices: ${this.figure.vertices.length}\n`
    obj += `# Faces: ${this.figure.faces.length}\n\n`

    // Vertices
    for (const vertex of this.figure.vertices) {
      obj += `v ${vertex.position.x} ${vertex.position.y} ${vertex.position.z}\n`
    }

    // Faces
    for (const face of this.figure.faces) {
      const indices = face.vertices
        .map((v, i) => {
          const vertex = this.figure.vertices.find(
            vv => Metrics.distance(vv.position, v) < 0.0001
          )
          return (vertex!.index! + 1).toString()
        })
        .join(' ')
      obj += `f ${indices}\n`
    }

    return obj
  }
}
