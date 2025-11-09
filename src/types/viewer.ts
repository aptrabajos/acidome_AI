/**
 * Type definitions for 3D visualization using Three.js
 */

import { Scene, Camera, Renderer } from 'three'
import { Vector3 } from './geometry'

/**
 * Rendering mode
 */
export type ViewerMode = 'base' | 'carcass' | 'schema' | 'cover' | 'tent'

/**
 * Camera view preset
 */
export interface CameraPreset {
  name: string
  position: Vector3
  target: Vector3
  fov?: number
}

/**
 * Material appearance settings
 */
export interface MaterialSettings {
  color: string
  specular?: string
  shininess?: number
  wireframe?: boolean
  transparent?: boolean
  opacity?: number
}

/**
 * Lighting configuration
 */
export interface LightingConfig {
  ambientIntensity: number
  directionalIntensity: number
  directionalPosition: Vector3
}

/**
 * Viewer options/configuration
 */
export interface ViewerOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
  fov?: number
  near?: number
  far?: number
  backgroundColor?: number
  lighting?: LightingConfig
}

/**
 * Render driver for each mode
 */
export interface RenderDriver {
  mode: ViewerMode
  enabled: boolean
  mesh?: any // Three.js Mesh or Group
  material?: any // Three.js Material
  visible: boolean
  update?(deltaTime: number): void
  dispose?(): void
}

/**
 * Pattern/tent data for tent mode
 */
export interface PatternData {
  ready: boolean
  progress: number
  image?: HTMLImageElement
  lines?: Vector3[][]
}

/**
 * Viewer class - 3D visualization and rendering
 */
export class Viewer {
  scene: Scene
  camera: Camera
  renderer: Renderer
  mode: ViewerMode
  drivers: Map<ViewerMode, RenderDriver>
  pattern: PatternData

  constructor(options: ViewerOptions)

  // Rendering methods
  initialize(): void
  render(deltaTime?: number): void
  flash(fast?: boolean): void
  dispose(): void

  // Mode switching
  setMode(mode: ViewerMode): void
  updateRenderDriver(mode: ViewerMode): void

  // Camera control
  setCamera(preset: CameraPreset): void
  resetCamera(): void
  zoomFit(): void

  // Material/appearance
  setMaterial(mode: ViewerMode, settings: MaterialSettings): void
  setLighting(config: LightingConfig): void

  // Interaction
  onWindowResize(width: number, height: number): void
  raycast(x: number, y: number): any // Intersection

  // Export
  captureScreenshot(): string // Base64 PNG
  exportScene(): string // JSON
}
