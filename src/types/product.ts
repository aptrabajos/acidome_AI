/**
 * Type definitions for product components (physical parts of the dome)
 */

import { Vector3 } from './geometry'

/**
 * Connection type between beams
 */
export type ConnectionType = 'Piped' | 'GoodKarma' | 'Semicone' | 'Cone' | 'Joint'

/**
 * Size specification for timber/beam
 */
export interface TimberSize {
  width: number // mm
  thickness: number // mm
}

/**
 * Connector component specifications
 */
export interface ConnectorSpec {
  type: ConnectionType
  pipeD?: number // Pipe diameter in mm (for Piped)
  clockwise: boolean
}

/**
 * Panel/Polygon component of the dome
 */
export interface Panel {
  vertices: Vector3[]
  area: number
  perimeter: number
  color?: string
  index?: number
}

/**
 * Beam/Strut connecting vertices
 */
export interface Beam {
  start: Vector3
  end: Vector3
  length: number
  width: number
  thickness: number
  color?: string
}

/**
 * Connector node connecting beams
 */
export interface Connector {
  position: Vector3
  type: ConnectionType
  degree: number // number of beams connected
  color?: string
}

/**
 * Budget item (quantity of a specific size)
 */
export interface BudgetItem {
  size: string // e.g. "1200x50x50"
  quantity: number
  unitLength?: number
  totalLength?: number
  weight?: number
  cost?: number
}

/**
 * Budget category
 */
export interface Budget {
  type: 'line' | 'panel' | 'connector' | 'fasteners'
  items: BudgetItem[]
  totalQuantity: number
  totalLength?: number
  totalWeight?: number
  totalCost?: number
}

/**
 * Product parameters
 */
export interface ProductParams {
  radius: number // Sphere radius
  beamsWidth: number // mm
  beamsThickness: number // mm
  connectorType: ConnectionType
  pipeD?: number // for Piped connections
  clockwise: boolean
}

/**
 * Product class - physical components and budget calculation
 */
export class Product {
  params: ProductParams
  panels: Panel[]
  beams: Beam[]
  connectors: Connector[]
  budgets: Budget[]

  constructor(params: ProductParams)

  // Core methods
  initialize(): void
  createPanels(): void
  createBeams(): void
  createConnectors(): void
  calculateBudget(): void

  // Utility methods
  getPanelCount(): number
  getBeamCount(): number
  getConnectorCount(): number
  getTotalBeamLength(): number
  getTotalWeight(): number
  getTotalCost(): number
  exportBudget(): Budget[]
  exportOBJ(): string
  exportCSV(): string
}
