/**
 * Application configuration and constants
 */

import { AppConfig, EnvironmentFlags } from '../types/config'
import { FigureParams } from '../types/figure'

/**
 * Environment flags
 */
export const ENV: EnvironmentFlags = {
  IS_OFFLINE: document.location.protocol === 'file:',
  IS_IFRAME: window.top !== window.self,
  IS_DEVELOPMENT: import.meta.env.DEV
}

/**
 * Default configuration
 */
export const CONFIG: AppConfig = {
  defaultFigure: {
    base: 'Icosahedron',
    detail: 3,
    subdivClass: 'I',
    subdivMethod: 'Kruschke',
    symmetry: 'Pentad',
    fullerenType: 'none',
    radius: 2.2,
    partialMode: 'faces',
    partial: '7/12',
    partialHeight: 0.777,
    alignTheBase: false,
    M: 0,
    N: 0
  } as FigureParams,

  view: {
    modeCover: {
      opacity: (over: boolean, removed: boolean) => {
        return removed ? 0.03 : over ? 0.95 : 0.9
      }
    },
    modeTent: {
      present: !!ENV.IS_OFFLINE && !!(ENV as any).tentParam
    },
    drawings: {
      face: {
        cols: 2
      }
    },
    wysiwyg: {
      ethalon: false
    }
  },

  ui: {
    showHeader: true,
    showForm: true,
    showBudget: true,
    showPreview: true,
    theme: 'light',
    language: 'en'
  },

  performance: {
    enableOptimizations: true,
    maxVertices: 50000,
    maxFaces: 100000,
    cacheGeometry: true,
    autoOrientCamera: true
  }
}

/**
 * Fulleren type options
 */
export const FULLEREN_TYPE_LIST = [
  { id: 'none', name: 'None' },
  { id: 'inscribed', name: 'Inscribed' },
  { id: 'circumscribed', name: 'Circumscribed' }
]

/**
 * Connection type options
 */
export const CONN_TYPE_LIST = [
  { id: 'Piped', name: 'Piped' },
  { id: 'GoodKarma', name: 'GoodKarma' },
  { id: 'Semicone', name: 'Semicone' },
  { id: 'Cone', name: 'Cone' },
  { id: 'Joint', name: 'Joint' }
]

/**
 * Detail level options
 */
export const DETAIL_LIST = [1, 2, 3, 4, 5]

/**
 * Partial sphere options
 */
export const PARTIAL_LIST = [
  '1/1',
  '7/8',
  '3/4',
  '5/8',
  '7/12',
  '1/2',
  '5/12',
  '1/3'
]

/**
 * Subdivision class options (for detail >= 2)
 */
export const SUBDIV_CLASS_LIST = [
  { id: 'I', name: 'Class I' },
  { id: 'II', name: 'Class II' },
  { id: 'III', name: 'Class III' }
]

/**
 * Subdivision method options (for detail >= 3)
 */
export const SUBDIV_METHOD_LIST = [
  { id: 'Chords', name: 'Equal Chords' },
  { id: 'Arcs', name: 'Equal Arcs' },
  { id: 'Kruschke', name: 'Kruschke (NEW)' },
  { id: 'Mexican', name: 'Mexican' }
]

/**
 * Symmetry options
 */
export const SYMMETRY_LIST = ['Pentad', 'Cross', 'Triad']

/**
 * Language options
 */
export const LANGUAGE_OPTIONS = [
  { id: 'en', name: 'English', code: 'en' },
  { id: 'es', name: 'Español', code: 'es' },
  { id: 'ru', name: 'Русский', code: 'ru' },
  { id: 'fr', name: 'Français', code: 'fr' },
  { id: 'de', name: 'Deutsch', code: 'de' }
]
