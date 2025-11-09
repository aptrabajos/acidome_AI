/**
 * Pinia store for application state management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FigureParams } from '../../types/figure'
import { ProductParams } from '../../types/product'
import { CONFIG, DETAIL_LIST } from '../../utils/config'
import { createFigure } from '../../core/Figure'
import { Product } from '../../core/Product'

export const useAppStore = defineStore('app', () => {
  // State
  const figureParams = ref<FigureParams>({ ...CONFIG.defaultFigure })
  const productParams = ref<ProductParams>({
    radius: figureParams.value.radius,
    beamsWidth: 120,
    beamsThickness: 40,
    connectorType: 'GoodKarma',
    clockwise: true
  })

  const viewerMode = ref<string>('carcass')
  const language = ref<string>('en')
  const isCalculating = ref(false)
  const error = ref<string | null>(null)

  // Current geometry data
  const currentFigure = ref<any>(null)
  const currentProduct = ref<any>(null)

  // Computed properties
  const detailList = computed(() => DETAIL_LIST)

  const subdivClassList = computed(() => {
    return figureParams.value.detail >= 2
      ? [
          { id: 'I', name: 'Class I' },
          { id: 'II', name: 'Class II' },
          { id: 'III', name: 'Class III' }
        ]
      : []
  })

  const subdivMethodList = computed(() => {
    return figureParams.value.detail >= 3 && figureParams.value.subdivClass === 'I'
      ? [
          { id: 'Chords', name: 'Equal Chords' },
          { id: 'Arcs', name: 'Equal Arcs' },
          { id: 'Kruschke', name: 'Kruschke' },
          { id: 'Mexican', name: 'Mexican' }
        ]
      : []
  })

  const partialList = computed(() => [
    { value: '1/1', name: '1/1 (Full)' },
    { value: '7/8', name: '7/8' },
    { value: '3/4', name: '3/4' },
    { value: '5/8', name: '5/8' },
    { value: '7/12', name: '7/12' },
    { value: '1/2', name: '1/2' },
    { value: '5/12', name: '5/12' },
    { value: '1/3', name: '1/3' }
  ])

  const geometryStats = computed(() => {
    if (!currentFigure.value) {
      return { vertexCount: 0, faceCount: 0, edgeCount: 0, surfaceArea: 0 }
    }
    return currentFigure.value.getStats()
  })

  const reportText = computed(() => {
    if (!currentFigure.value || !currentProduct.value) return 'Click calculate...'

    const stats = geometryStats.value
    const budgets = currentProduct.value.exportBudget()

    let report = `Vertices: ${stats.vertexCount}\n`
    report += `Faces: ${stats.faceCount}\n`
    report += `Edges: ${stats.edgeCount}\n`
    report += `Surface Area: ${stats.surfaceArea.toFixed(2)} m²\n\n`

    for (const budget of budgets) {
      report += `${budget.type.toUpperCase()}\n`
      report += `Total: ${budget.totalQuantity}\n`
      if (budget.totalLength) {
        report += `Total Length: ${budget.totalLength.toFixed(2)} m\n`
      }
      report += '\n'
    }

    return report
  })

  // Actions
  const updateFigureParam = (key: keyof FigureParams, value: any) => {
    figureParams.value[key] = value
    productParams.value.radius = figureParams.value.radius
  }

  const updateProductParam = (key: keyof ProductParams, value: any) => {
    productParams.value[key] = value
  }

  const calculate = async () => {
    isCalculating.value = true
    error.value = null

    try {
      // Create figure
      currentFigure.value = createFigure(figureParams.value)

      // Create product
      currentProduct.value = new Product(currentFigure.value, productParams.value)
    } catch (err: any) {
      error.value = err.message || 'Calculation failed'
      console.error('Calculation error:', err)
    } finally {
      isCalculating.value = false
    }
  }

  const setViewerMode = (mode: string) => {
    viewerMode.value = mode
  }

  const setLanguage = (lang: string) => {
    language.value = lang
  }

  return {
    // State
    figureParams,
    productParams,
    viewerMode,
    language,
    isCalculating,
    error,
    currentFigure,
    currentProduct,

    // Computed
    detailList,
    subdivClassList,
    subdivMethodList,
    partialList,
    geometryStats,
    reportText,

    // Actions
    updateFigureParam,
    updateProductParam,
    calculate,
    setViewerMode,
    setLanguage
  }
})
