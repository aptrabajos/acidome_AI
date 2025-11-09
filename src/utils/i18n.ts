/**
 * Internationalization utility
 * Manages multilingual text resources
 */

import { LanguageOption } from '../types/config'
import { LANGUAGE_OPTIONS } from './config'

/**
 * Translation database
 */
const translations: Record<string, Record<string, string>> = {
  'title:Geodesic dome constructor': {
    en: 'Geodesic dome constructor',
    es: 'Constructor de cúpula geodésica',
    ru: 'Конструктор геодезического купола',
    fr: 'Constructeur de dôme géodésique',
    de: 'Geodätischer Kuppelkonstruktor'
  },
  'Polyhedron': {
    en: 'Polyhedron',
    es: 'Poliedro',
    ru: 'Полиэдр',
    fr: 'Polyèdre',
    de: 'Polyeder'
  },
  'Icosahedron': {
    en: 'Icosahedron',
    es: 'Icosaedro',
    ru: 'Икосаэдр',
    fr: 'Icosaèdre',
    de: 'Ikosaeder'
  },
  'Octohedron': {
    en: 'Octohedron',
    es: 'Octaedro',
    ru: 'Октаэдр',
    fr: 'Octaèdre',
    de: 'Oktaeder'
  },
  'Level of detail, V': {
    en: 'Level of detail, V',
    es: 'Nivel de detalle, V',
    ru: 'Уровень детализации, V',
    fr: 'Niveau de détail, V',
    de: 'Detaillevel, V'
  },
  'Subdivision class': {
    en: 'Subdivision class',
    es: 'Clase de subdivisión',
    ru: 'Класс подразделения',
    fr: 'Classe de subdivision',
    de: 'Unterteilungsklasse'
  },
  'Subdivision method': {
    en: 'Subdivision method',
    es: 'Método de subdivisión',
    ru: 'Метод подразделения',
    fr: 'Méthode de subdivision',
    de: 'Unterteilungsmethode'
  },
  'Rotational symmetry': {
    en: 'Rotational symmetry',
    es: 'Simetría rotacional',
    ru: 'Вращательная симметрия',
    fr: 'Symétrie rotationnelle',
    de: 'Rotationssymmetrie'
  },
  'Sphere radius, m': {
    en: 'Sphere radius, m',
    es: 'Radio de la esfera, m',
    ru: 'Радиус сферы, м',
    fr: 'Rayon de la sphère, m',
    de: 'Kugelradius, m'
  },
  'Connection type': {
    en: 'Connection type',
    es: 'Tipo de conexión',
    ru: 'Тип соединения',
    fr: 'Type de connexion',
    de: 'Verbindungstyp'
  },
  'Pipe diameter, mm': {
    en: 'Pipe diameter, mm',
    es: 'Diámetro de la tubería, mm',
    ru: 'Диаметр трубы, мм',
    fr: 'Diamètre du tuyau, mm',
    de: 'Rohrdurchmesser, mm'
  },
  'Width, mm': {
    en: 'Width, mm',
    es: 'Ancho, mm',
    ru: 'Ширина, мм',
    fr: 'Largeur, mm',
    de: 'Breite, mm'
  },
  'Thickness, mm': {
    en: 'Thickness, mm',
    es: 'Espesor, mm',
    ru: 'Толщина, мм',
    fr: 'Épaisseur, mm',
    de: 'Dicke, mm'
  },
  'pcs': {
    en: 'pcs',
    es: 'pzas',
    ru: 'шт',
    fr: 'pcs',
    de: 'Stk'
  }
}

let currentLanguage: string = 'en'

/**
 * Set current language
 */
export function setLanguage(lang: string): void {
  if (LANGUAGE_OPTIONS.some(l => l.id === lang)) {
    currentLanguage = lang
  }
}

/**
 * Get current language
 */
export function getLanguage(): string {
  return currentLanguage
}

/**
 * Translate text
 */
export function i18n(text: string, lang?: string): string {
  const language = lang || currentLanguage
  const key = text.includes(':') ? text : `${text}`

  return translations[key]?.[language] || translations[key]?.en || text
}

/**
 * Get all language options
 */
export function getLanguageOptions(): LanguageOption[] {
  return LANGUAGE_OPTIONS
}

/**
 * Translate with fallback
 */
export function __(text: string): string {
  return i18n(text)
}
