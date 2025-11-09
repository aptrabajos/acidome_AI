/**
 * Application configuration and constants
 */

import { FigureParams } from './figure'

/**
 * Application environment flags
 */
export interface EnvironmentFlags {
  IS_OFFLINE: boolean
  IS_IFRAME: boolean
  IS_DEVELOPMENT: boolean
}

/**
 * Default configuration
 */
export interface AppConfig {
  defaultFigure: FigureParams
  view: ViewConfig
  ui: UIConfig
  performance: PerformanceConfig
}

/**
 * View/rendering configuration
 */
export interface ViewConfig {
  modeCover: {
    opacity: (over: boolean, removed: boolean) => number
  }
  modeTent: {
    present: boolean
  }
  drawings: {
    face: {
      cols: number
    }
  }
  wysiwyg: {
    ethalon: boolean
  }
}

/**
 * UI configuration
 */
export interface UIConfig {
  showHeader: boolean
  showForm: boolean
  showBudget: boolean
  showPreview: boolean
  theme: 'light' | 'dark'
  language: string
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  enableOptimizations: boolean
  maxVertices: number
  maxFaces: number
  cacheGeometry: boolean
  autoOrientCamera: boolean
}

/**
 * Internationalization type
 */
export interface I18nText {
  [key: string]: {
    [language: string]: string
  }
}

/**
 * Language option
 */
export interface LanguageOption {
  id: string
  name: string
  code: string
}
