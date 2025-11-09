/**
 * ACIDOME API Client
 *
 * Provides functions to consume the ACIDOME REST API
 * Base URL: http://localhost:3000/api
 */

import type { DomeParams, DomeResults } from './calculator'
import type { PlotData } from './plots'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Response wrapper for all API calls
 */
interface ApiResponse<T> {
  success: boolean
  data: T
  plots?: Record<string, PlotData>
  error?: string
  messages?: string[]
}

/**
 * Calculate complete dome specifications
 */
export async function calculateDome(params: DomeParams): Promise<ApiResponse<DomeResults>> {
  try {
    const response = await fetch(`${API_BASE_URL}/dome/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Calculation failed')
    }

    return await response.json()
  } catch (error) {
    throw new Error(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get server health status
 */
export async function getHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    if (!response.ok) throw new Error('Health check failed')
    return await response.json()
  } catch (error) {
    throw new Error(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get API documentation
 */
export async function getApiDocs() {
  try {
    const response = await fetch(`${API_BASE_URL}/docs`)
    if (!response.ok) throw new Error('Failed to fetch documentation')
    return await response.json()
  } catch (error) {
    throw new Error(`Failed to fetch docs: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get beam technical drawing
 */
export async function getBeamPlot(
  length: number = 1717,
  width: number = 160,
  thickness: number = 40,
  scale: number = 0.5
): Promise<ApiResponse<PlotData>> {
  try {
    const params = new URLSearchParams({
      length: String(length),
      width: String(width),
      thickness: String(thickness),
      scale: String(scale),
    })

    const response = await fetch(`${API_BASE_URL}/plots/beam?${params}`)
    if (!response.ok) throw new Error('Failed to fetch beam plot')
    return await response.json()
  } catch (error) {
    throw new Error(`Beam plot error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get panel technical drawing
 */
export async function getPanelPlot(
  sideLength: number = 1717,
  scale: number = 0.5
): Promise<ApiResponse<PlotData>> {
  try {
    const params = new URLSearchParams({
      sideLength: String(sideLength),
      scale: String(scale),
    })

    const response = await fetch(`${API_BASE_URL}/plots/panel?${params}`)
    if (!response.ok) throw new Error('Failed to fetch panel plot')
    return await response.json()
  } catch (error) {
    throw new Error(`Panel plot error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get connector technical drawing
 */
export async function getConnectorPlot(
  type: string = 'GoodKarma',
  convergences: number = 6,
  scale: number = 1
): Promise<ApiResponse<PlotData>> {
  try {
    const params = new URLSearchParams({
      type,
      convergences: String(convergences),
      scale: String(scale),
    })

    const response = await fetch(`${API_BASE_URL}/plots/connector?${params}`)
    if (!response.ok) throw new Error('Failed to fetch connector plot')
    return await response.json()
  } catch (error) {
    throw new Error(`Connector plot error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get assembly overview drawing
 */
export async function getAssemblyPlot(
  beams: number = 129,
  panels: number = 75,
  connectors: number = 60,
  scale: number = 0.5
): Promise<ApiResponse<PlotData>> {
  try {
    const params = new URLSearchParams({
      beams: String(beams),
      panels: String(panels),
      connectors: String(connectors),
      scale: String(scale),
    })

    const response = await fetch(`${API_BASE_URL}/plots/assembly?${params}`)
    if (!response.ok) throw new Error('Failed to fetch assembly plot')
    return await response.json()
  } catch (error) {
    throw new Error(`Assembly plot error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
