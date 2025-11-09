/**
 * AcidomeCalculator - Orchestrates geodesic dome calculations
 *
 * This class is the main entry point for calculating dome specifications.
 * It coordinates:
 * - Geometric figure creation (Icosahedron)
 * - Subdivision by frequency
 * - Partial dome slicing
 * - Product creation (beams, connectors, panels)
 * - Metrics calculation (areas, volumes, lengths, angles)
 */

import { Vector3Class } from '../core/Metrics'
import { Figure } from '../core/Figure'
import { Product } from '../core/Product'

/**
 * Input parameters for dome calculation
 */
export interface DomeParams {
  // Geometric parameters
  detail: number                    // Frequency: 1-18 (V1, V2, V3, V4, etc.)
  partial: string                   // Dome portion: '5/12', '7/12', '1/2', etc.
  radius: number                    // Sphere radius in meters

  // Connector type: 'Piped', 'GoodKarma', 'Semicone', 'Cone', 'Joint'
  connType: string

  // Beam dimensions
  beamsWidth: number                // Width in mm
  beamsThickness: number            // Thickness in mm

  // Advanced parameters (optional)
  base?: string                     // 'Icosahedron' | 'Octohedron'
  subdivClass?: string              // 'I', 'II', 'III_*,*'
  subdivMethod?: string             // 'Chords', 'Arcs', 'Mexican', 'Kruschke'
  symmetry?: string                 // 'Pentad', 'Cross', 'Triad'
  fullerenType?: string             // 'none', 'inscribed', 'described'
  partialMode?: string              // 'faces', 'height'
}

/**
 * Calculated results
 */
export interface DomeResults {
  input: DomeParams

  geometry: {
    vertices: number
    faces: number
    edges: number
  }

  dimensions: {
    heightFromBase: number          // meters
    baseRadius: number              // meters
    baseArea: number                // m²
    coverageArea: number            // m²
  }

  beams: {
    length: number                  // mm
    totalLength: number             // meters
    totalVolume: number             // m³
    angleBeweenFaces: number        // degrees
    count: number
  }

  panels: {
    count: number
    sideLength: number              // mm
    height: number                  // mm (for triangular panels)
    areaPerPanel: number            // m²
    totalArea: number               // m²
  }

  connectors: {
    count: number
    type: string
    convergences: number
  }

  metadata: {
    calculatedAt: string
    version: string
  }
}

/**
 * Main calculator class
 */
export class AcidomeCalculator {
  private params: DomeParams
  private figure: Figure | null = null

  constructor(params: DomeParams) {
    this.params = this.normalizeParams(params)
  }

  /**
   * Normalize and validate parameters
   */
  private normalizeParams(params: DomeParams): DomeParams {
    return {
      detail: Math.max(1, Math.min(18, params.detail)),
      partial: params.partial || '7/12',
      radius: Math.max(0.1, params.radius),
      connType: params.connType || 'GoodKarma',
      beamsWidth: Math.max(10, params.beamsWidth),
      beamsThickness: Math.max(5, params.beamsThickness),
      base: params.base || 'Icosahedron',
      subdivClass: params.subdivClass || 'I',
      subdivMethod: params.subdivMethod || 'Kruschke',
      symmetry: params.symmetry || 'Pentad',
      fullerenType: params.fullerenType || 'none',
      partialMode: params.partialMode || 'faces',
    }
  }

  /**
   * Main calculation method
   */
  calculate(): DomeResults {
    // Step 1: Create base figure (Icosahedron)
    this.figure = this.createBaseFigure()

    // Step 2: Subdivide by frequency
    this.subdivideFigure()

    // Step 3: Calculate geometry metrics
    const geometry = this.calculateGeometry()

    // Step 4: Calculate dimensions
    const dimensions = this.calculateDimensions()

    // Step 5: Calculate beam metrics
    const beams = this.calculateBeams()

    // Step 6: Calculate panel metrics
    const panels = this.calculatePanels()

    // Step 7: Calculate connector metrics
    const connectors = this.calculateConnectors()

    return {
      input: this.params,
      geometry,
      dimensions,
      beams,
      panels,
      connectors,
      metadata: {
        calculatedAt: new Date().toISOString(),
        version: '1.0.0',
      },
    }
  }

  /**
   * Create base figure (Icosahedron or Octohedron)
   */
  private createBaseFigure(): Figure {
    if (this.params.base === 'Octohedron') {
      return new Figure('Octohedron', {
        symmetry: this.params.symmetry,
      })
    }

    // Default: Icosahedron
    return new Figure('Icosahedron', {
      symmetry: this.params.symmetry,
    })
  }

  /**
   * Subdivide figure by frequency
   */
  private subdivideFigure(): void {
    if (!this.figure) return

    const V = this.params.detail

    switch (this.params.subdivMethod) {
      case 'Chords':
        this.figure.splitFaces(V)
        break

      case 'Arcs':
        this.figure.splitFaces_EA(V)
        break

      case 'Mexican':
        this.figure.splitFaces_EA(V)
        this.figure.splitFaces_EA_updateToMexican(V)
        break

      case 'Kruschke':
        this.figure.splitFaces(V)
        this.applyKruschkeMagic(V)
        break

      default:
        this.figure.splitFaces(V)
    }

    // Apply partial dome slicing
    if (this.params.partialMode === 'faces') {
      this.figure.sliceByFraction(this.params.partial)
    }
  }

  /**
   * Apply Kruschke magic factor correction
   */
  private applyKruschkeMagic(V: number): void {
    let magicRatio: number

    if (V === 3) {
      magicRatio = 0.9442890204731844
    } else if (V === 4) {
      magicRatio = (0.22219 / 0.253185) * 0.9983958444733023
    } else {
      return // No magic for other frequencies
    }

    if (this.figure) {
      // Apply the magic ratio to edge points
      // This adjusts the vertex positions on edges
      this.figure.applyEdgeCorrection(magicRatio)
    }
  }

  /**
   * Calculate geometry (vertex, face, edge counts)
   */
  private calculateGeometry() {
    if (!this.figure) {
      return { vertices: 0, faces: 0, edges: 0 }
    }

    const V = this.params.detail
    const fraction = this.parseFraction(this.params.partial)

    // Formulas from geodesic dome mathematics
    const totalVertices = 10 * V * V + 2
    const totalFaces = 20 * V * V
    const totalEdges = 30 * V * V

    // Apply partial dome fraction
    const vertices = Math.round(totalVertices * fraction)
    const faces = Math.round(totalFaces * fraction)
    const edges = Math.round(totalEdges * fraction)

    return { vertices, faces, edges }
  }

  /**
   * Calculate dome dimensions (height, radius, areas)
   */
  private calculateDimensions() {
    const R = this.params.radius // radius in meters
    const fraction = this.parseFraction(this.params.partial)

    // For Pentad symmetry Icosahedron with 5/12 partial
    // These are approximate values based on geometric analysis
    const yMaxVertex = this.getMaxYVertex()
    const radiusMaxProjection = this.getMaxRadialProjection()

    const heightFromBase = yMaxVertex * R
    const baseRadius = radiusMaxProjection * R
    const baseArea = Math.PI * baseRadius * baseRadius

    // Sphere surface area: 4πR²
    // Partial dome area: fraction * sphere area
    const fullSphereArea = 4 * Math.PI * R * R
    const coverageArea = fullSphereArea * fraction

    return {
      heightFromBase: Number(heightFromBase.toFixed(2)),
      baseRadius: Number(baseRadius.toFixed(2)),
      baseArea: Number(baseArea.toFixed(2)),
      coverageArea: Number(coverageArea.toFixed(2)),
    }
  }

  /**
   * Calculate beam metrics
   */
  private calculateBeams() {
    const V = this.params.detail
    const R = this.params.radius
    const fraction = this.parseFraction(this.params.partial)

    // Base icosahedron edge = 2*R*sin(π/5)
    const sin36 = Math.sin(Math.PI / 5)
    const baseEdgeLength = 2 * R * sin36

    // After subdivision by frequency V
    const subdivisionEdgeLength = baseEdgeLength / V

    // Apply Kruschke correction if applicable
    let beamLength = subdivisionEdgeLength
    if (this.params.subdivMethod === 'Kruschke') {
      const factor = V === 3
        ? 0.9442890204731844
        : V === 4
        ? (0.22219 / 0.253185) * 0.9983958444733023
        : 1.0
      beamLength *= factor
    }

    const beamCount = Math.round(30 * V * V * fraction)
    const totalLength = beamCount * beamLength
    const volumeMm3 = beamCount *
      (this.params.beamsWidth / 1000) *
      (this.params.beamsThickness / 1000) *
      beamLength

    // Angle between faces (dihedral angle of icosahedron)
    const dihedralAngle = 138.19

    return {
      length: Math.round(beamLength * 1000), // convert to mm
      totalLength: Number(totalLength.toFixed(2)),
      totalVolume: Number(volumeMm3.toFixed(3)),
      angleBeweenFaces: Number(dihedralAngle.toFixed(2)),
      count: beamCount,
    }
  }

  /**
   * Calculate panel (triangle) metrics
   */
  private calculatePanels() {
    const V = this.params.detail
    const fraction = this.parseFraction(this.params.partial)
    const panelCount = Math.round(20 * V * V * fraction)

    // Panel side length equals beam length
    const beamLength = this.calculateBeams().length // in mm

    // For equilateral triangle
    // Area = (√3/4) * side²
    // Height = (√3/2) * side
    const panelAreaMm2 = (Math.sqrt(3) / 4) * beamLength * beamLength
    const panelAreaM2 = panelAreaMm2 / 1e6
    const panelHeight = (Math.sqrt(3) / 2) * beamLength

    return {
      count: panelCount,
      sideLength: beamLength,
      height: Math.round(panelHeight),
      areaPerPanel: Number(panelAreaM2.toFixed(4)),
      totalArea: Number((panelAreaM2 * panelCount).toFixed(2)),
    }
  }

  /**
   * Calculate connector metrics
   */
  private calculateConnectors() {
    const V = this.params.detail
    const fraction = this.parseFraction(this.params.partial)
    const connectorCount = Math.round((10 * V * V + 2) * fraction)

    return {
      count: connectorCount,
      type: this.params.connType,
      convergences: 6, // typical for geodesic domes
    }
  }

  /**
   * Get maximum Y coordinate of vertex (normalized to unit sphere)
   */
  private getMaxYVertex(): number {
    // For Pentad symmetry Icosahedron
    // The maximum Y value depends on the partial fraction
    const fraction = this.parseFraction(this.params.partial)

    // Approximate mapping for common fractions
    if (Math.abs(fraction - 5/12) < 0.01) return 0.7654
    if (Math.abs(fraction - 7/12) < 0.01) return 0.8944
    if (Math.abs(fraction - 1/2) < 0.01) return 0.8090

    // Linear interpolation for other fractions
    return 0.5 + fraction * 0.5
  }

  /**
   * Get maximum radial projection (x,z plane)
   */
  private getMaxRadialProjection(): number {
    const fraction = this.parseFraction(this.params.partial)

    // Approximate mapping
    if (Math.abs(fraction - 5/12) < 0.01) return 0.8944
    if (Math.abs(fraction - 7/12) < 0.01) return 0.9511
    if (Math.abs(fraction - 1/2) < 0.01) return 0.9045

    return 0.6 + fraction * 0.4
  }

  /**
   * Parse fraction string (e.g., "5/12" -> 0.4167)
   */
  private parseFraction(partial: string): number {
    const parts = partial.split('/')
    if (parts.length === 2) {
      return Number(parts[0]) / Number(parts[1])
    }
    return Number(partial)
  }
}

/**
 * Convenience function for quick calculations
 */
export function calculateDome(params: DomeParams): DomeResults {
  const calculator = new AcidomeCalculator(params)
  return calculator.calculate()
}
