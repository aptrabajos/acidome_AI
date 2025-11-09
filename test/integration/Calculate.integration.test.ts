/**
 * Integration tests for the complete calculation workflow
 * Tests the full pipeline from figure creation to budget export
 */

import { describe, it, expect } from 'vitest'
import { createFigure } from '@/core/Figure'
import { Product } from '@/core/Product'
import type { FigureParams } from '@/types/figure'
import type { ProductParams } from '@/types/product'

describe('Integration: Complete Calculation Workflow', () => {
  describe('Standard Icosahedron Dome', () => {
    it('should calculate standard dome configuration', () => {
      const figureParams: FigureParams = {
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
      }

      const productParams: ProductParams = {
        radius: 2.2,
        beamsWidth: 120,
        beamsThickness: 40,
        connectorType: 'GoodKarma',
        clockwise: true
      }

      // Create figure
      const figure = createFigure(figureParams)

      // Verify figure
      expect(figure.getVertexCount()).toBeGreaterThan(0)
      expect(figure.getFaceCount()).toBeGreaterThan(0)
      expect(figure.getEdgeCount()).toBeGreaterThan(0)

      // Create product
      const product = new Product(figure, productParams)

      // Verify product
      expect(product.getPanelCount()).toBe(figure.getFaceCount())
      expect(product.getBeamCount()).toBe(figure.getEdgeCount())
      expect(product.getConnectorCount()).toBe(figure.getVertexCount())

      // Verify budget
      const budgets = product.exportBudget()
      expect(budgets.length).toBeGreaterThan(0)

      const lineBudget = budgets.find(b => b.type === 'line')
      expect(lineBudget).toBeDefined()
      expect(lineBudget!.totalQuantity).toBe(product.getBeamCount())
      expect(lineBudget!.totalLength).toBeGreaterThan(0)
    })
  })

  describe('Different Configurations', () => {
    it('should handle different detail levels', () => {
      const configurations = [1, 2, 3, 4].map(detail => ({
        base: 'Icosahedron' as const,
        detail,
        subdivClass: 'I' as const,
        subdivMethod: 'Kruschke' as const,
        symmetry: 'Pentad' as const,
        fullerenType: 'none' as const,
        radius: 2,
        partialMode: 'faces' as const,
        partial: '1/1' as const,
        partialHeight: 0.777,
        alignTheBase: false,
        M: 0,
        N: 0
      }))

      let prevVertexCount = 0

      for (const config of configurations) {
        const figure = createFigure(config)
        expect(figure.getVertexCount()).toBeGreaterThanOrEqual(prevVertexCount)
        prevVertexCount = figure.getVertexCount()
      }
    })

    it('should calculate partial spheres', () => {
      const fullParams: FigureParams = {
        base: 'Icosahedron',
        detail: 2,
        subdivClass: 'I',
        subdivMethod: 'Kruschke',
        symmetry: 'Pentad',
        fullerenType: 'none',
        radius: 2,
        partialMode: 'faces',
        partial: '1/1',
        partialHeight: 0.777,
        alignTheBase: false,
        M: 0,
        N: 0
      }

      const partialParams: FigureParams = {
        ...fullParams,
        partial: '1/2'
      }

      const full = createFigure(fullParams)
      const partial = createFigure(partialParams)

      expect(partial.getVertexCount()).toBeLessThan(full.getVertexCount())
      expect(partial.getFaceCount()).toBeLessThan(full.getFaceCount())
    })

    it('should align base when requested', () => {
      const noAlignParams: FigureParams = {
        base: 'Icosahedron',
        detail: 2,
        subdivClass: 'I',
        subdivMethod: 'Kruschke',
        symmetry: 'Pentad',
        fullerenType: 'none',
        radius: 2,
        partialMode: 'faces',
        partial: '1/1',
        partialHeight: 0.777,
        alignTheBase: false,
        M: 0,
        N: 0
      }

      const alignParams: FigureParams = {
        ...noAlignParams,
        alignTheBase: true
      }

      const noAlign = createFigure(noAlignParams)
      const aligned = createFigure(alignParams)

      // Find minimum Y in both
      let minYNoAlign = Infinity
      for (const v of noAlign.vertices) {
        minYNoAlign = Math.min(minYNoAlign, v.position.y)
      }

      let minYAligned = Infinity
      for (const v of aligned.vertices) {
        minYAligned = Math.min(minYAligned, v.position.y)
      }

      // Aligned should have minimum Y at 0
      expect(minYAligned).toBeCloseTo(0, 5)
    })
  })

  describe('Budget Calculations', () => {
    it('should generate accurate budget from geometry', () => {
      const figureParams: FigureParams = {
        base: 'Octohedron',
        detail: 2,
        subdivClass: 'I',
        subdivMethod: 'Kruschke',
        symmetry: 'Pentad',
        fullerenType: 'none',
        radius: 3,
        partialMode: 'faces',
        partial: '1/1',
        partialHeight: 0.777,
        alignTheBase: false,
        M: 0,
        N: 0
      }

      const productParams: ProductParams = {
        radius: 3,
        beamsWidth: 100,
        beamsThickness: 50,
        connectorType: 'Piped',
        pipeD: 108,
        clockwise: true
      }

      const figure = createFigure(figureParams)
      const product = new Product(figure, productParams)

      const budgets = product.exportBudget()

      // Verify all budget types exist
      expect(budgets.some(b => b.type === 'line')).toBe(true)
      expect(budgets.some(b => b.type === 'panel')).toBe(true)
      expect(budgets.some(b => b.type === 'connector')).toBe(true)

      // Verify quantities
      const lineBudget = budgets.find(b => b.type === 'line')!
      expect(lineBudget.totalQuantity).toBe(figure.getEdgeCount())

      const panelBudget = budgets.find(b => b.type === 'panel')!
      expect(panelBudget.totalQuantity).toBe(figure.getFaceCount())

      const connBudget = budgets.find(b => b.type === 'connector')!
      expect(connBudget.totalQuantity).toBe(figure.getVertexCount())
    })
  })

  describe('Export Functionality', () => {
    it('should export valid OBJ file', () => {
      const figureParams: FigureParams = {
        base: 'Icosahedron',
        detail: 2,
        subdivClass: 'I',
        subdivMethod: 'Kruschke',
        symmetry: 'Pentad',
        fullerenType: 'none',
        radius: 1,
        partialMode: 'faces',
        partial: '1/1',
        partialHeight: 0.777,
        alignTheBase: false,
        M: 0,
        N: 0
      }

      const productParams: ProductParams = {
        radius: 1,
        beamsWidth: 100,
        beamsThickness: 40,
        connectorType: 'GoodKarma',
        clockwise: true
      }

      const figure = createFigure(figureParams)
      const product = new Product(figure, productParams)

      const obj = product.exportOBJ()

      // Verify OBJ format
      expect(obj).toContain('# Acidome')
      expect(obj).toContain('v ') // Vertices
      expect(obj).toContain('f ') // Faces

      // Count vertices and faces in OBJ
      const vLines = obj.split('\n').filter(l => l.startsWith('v '))
      const fLines = obj.split('\n').filter(l => l.startsWith('f '))

      expect(vLines.length).toBe(figure.getVertexCount())
      expect(fLines.length).toBe(figure.getFaceCount())
    })
  })

  describe('Multiple Polyhedron Types', () => {
    it('should work with both Icosahedron and Octohedron', () => {
      const types = ['Icosahedron', 'Octohedron'] as const

      for (const baseType of types) {
        const figureParams: FigureParams = {
          base: baseType,
          detail: 2,
          subdivClass: 'I',
          subdivMethod: 'Kruschke',
          symmetry: 'Pentad',
          fullerenType: 'none',
          radius: 2,
          partialMode: 'faces',
          partial: '1/1',
          partialHeight: 0.777,
          alignTheBase: false,
          M: 0,
          N: 0
        }

        const productParams: ProductParams = {
          radius: 2,
          beamsWidth: 120,
          beamsThickness: 40,
          connectorType: 'GoodKarma',
          clockwise: true
        }

        const figure = createFigure(figureParams)
        const product = new Product(figure, productParams)

        expect(figure.getVertexCount()).toBeGreaterThan(0)
        expect(product.getPanelCount()).toBeGreaterThan(0)
        expect(product.getBudgetCount?.()).not.toThrow?.()
      }
    })
  })

  describe('Geometry Consistency', () => {
    it('should maintain geometric consistency through calculation', () => {
      const figureParams: FigureParams = {
        base: 'Icosahedron',
        detail: 3,
        subdivClass: 'I',
        subdivMethod: 'Kruschke',
        symmetry: 'Pentad',
        fullerenType: 'none',
        radius: 2.5,
        partialMode: 'faces',
        partial: '7/12',
        partialHeight: 0.777,
        alignTheBase: true,
        M: 0,
        N: 0
      }

      const figure = createFigure(figureParams)
      const stats = figure.getStats()

      // Verify Euler characteristic
      const euler = stats.vertexCount - stats.edgeCount + stats.faceCount
      expect(euler).toBeGreaterThan(0)

      // Verify all vertices are on or near the sphere surface
      for (const vertex of figure.vertices) {
        const dist = Math.sqrt(
          vertex.position.x ** 2 +
          vertex.position.y ** 2 +
          vertex.position.z ** 2
        )
        expect(dist).toBeCloseTo(figureParams.radius, 4)
      }

      // Verify base is aligned
      let minY = Infinity
      for (const vertex of figure.vertices) {
        minY = Math.min(minY, vertex.position.y)
      }
      expect(minY).toBeCloseTo(0, 5)
    })
  })

  describe('Performance', () => {
    it('should calculate complex dome quickly', () => {
      const figureParams: FigureParams = {
        base: 'Icosahedron',
        detail: 4, // Complex level
        subdivClass: 'I',
        subdivMethod: 'Kruschke',
        symmetry: 'Pentad',
        fullerenType: 'none',
        radius: 2,
        partialMode: 'faces',
        partial: '1/1',
        partialHeight: 0.777,
        alignTheBase: false,
        M: 0,
        N: 0
      }

      const productParams: ProductParams = {
        radius: 2,
        beamsWidth: 120,
        beamsThickness: 40,
        connectorType: 'GoodKarma',
        clockwise: true
      }

      const startTime = performance.now()

      const figure = createFigure(figureParams)
      const product = new Product(figure, productParams)

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete in reasonable time (less than 500ms)
      expect(duration).toBeLessThan(500)

      // Verify result is valid
      expect(product.getPanelCount()).toBeGreaterThan(0)
    })
  })
})
