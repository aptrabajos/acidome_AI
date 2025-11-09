/**
 * Unit tests for Product module
 * Tests physical components and budget calculations
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Icosahedron } from '@/core/Figure'
import { Product } from '@/core/Product'
import type { FigureParams } from '@/types/figure'
import type { ProductParams } from '@/types/product'

describe('Product', () => {
  let figureParams: FigureParams
  let productParams: ProductParams
  let figure: Icosahedron
  let product: Product

  beforeEach(() => {
    figureParams = {
      base: 'Icosahedron',
      detail: 2,
      subdivClass: 'I',
      subdivMethod: 'Kruschke',
      symmetry: 'Pentad',
      fullerenType: 'none',
      radius: 2.0,
      partialMode: 'faces',
      partial: '7/12',
      partialHeight: 0.777,
      alignTheBase: false,
      M: 0,
      N: 0
    }

    productParams = {
      radius: 2.0,
      beamsWidth: 120,
      beamsThickness: 40,
      connectorType: 'GoodKarma',
      clockwise: true
    }

    figure = new Icosahedron(figureParams)
    product = new Product(figure, productParams)
  })

  describe('Component Generation', () => {
    it('should create panels from figure faces', () => {
      expect(product.getPanelCount()).toBeGreaterThan(0)
      expect(product.getPanelCount()).toBe(figure.getFaceCount())
    })

    it('should create beams from figure edges', () => {
      expect(product.getBeamCount()).toBeGreaterThan(0)
      expect(product.getBeamCount()).toBe(figure.getEdgeCount())
    })

    it('should create connectors from figure vertices', () => {
      expect(product.getConnectorCount()).toBeGreaterThan(0)
      expect(product.getConnectorCount()).toBe(figure.getVertexCount())
    })

    it('should apply beam dimensions correctly', () => {
      for (const beam of product.beams) {
        expect(beam.width).toBe(productParams.beamsWidth)
        expect(beam.thickness).toBe(productParams.beamsThickness)
        expect(beam.length).toBeGreaterThan(0)
      }
    })

    it('should assign correct connector type', () => {
      for (const connector of product.connectors) {
        expect(connector.type).toBe(productParams.connectorType)
        expect(connector.degree).toBeGreaterThan(0)
      }
    })
  })

  describe('Panel Calculations', () => {
    it('should calculate panel area', () => {
      for (const panel of product.panels) {
        expect(panel.area).toBeGreaterThan(0)
        expect(panel.perimeter).toBeGreaterThan(0)
      }
    })

    it('should have non-overlapping panels', () => {
      const totalArea = product.panels.reduce((sum, p) => sum + p.area, 0)
      const surfaceArea = figure.calculateSurfaceArea()
      // Total panel area should be close to surface area
      expect(totalArea).toBeCloseTo(surfaceArea, 0)
    })
  })

  describe('Beam Calculations', () => {
    it('should calculate total beam length', () => {
      const totalLength = product.getTotalBeamLength()
      expect(totalLength).toBeGreaterThan(0)

      const calculated = product.beams.reduce((sum, b) => sum + b.length, 0)
      expect(totalLength).toBeCloseTo(calculated, 5)
    })

    it('should validate beam length is positive', () => {
      for (const beam of product.beams) {
        expect(beam.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Budget Calculation', () => {
    it('should generate budgets', () => {
      const budgets = product.exportBudget()
      expect(budgets.length).toBeGreaterThan(0)
    })

    it('should include line (beam) budget', () => {
      const budgets = product.exportBudget()
      const lineBudget = budgets.find(b => b.type === 'line')
      expect(lineBudget).toBeDefined()
      expect(lineBudget!.totalQuantity).toBe(product.getBeamCount())
    })

    it('should include panel budget', () => {
      const budgets = product.exportBudget()
      const panelBudget = budgets.find(b => b.type === 'panel')
      expect(panelBudget).toBeDefined()
      expect(panelBudget!.totalQuantity).toBe(product.getPanelCount())
    })

    it('should include connector budget', () => {
      const budgets = product.exportBudget()
      const connBudget = budgets.find(b => b.type === 'connector')
      expect(connBudget).toBeDefined()
      expect(connBudget!.totalQuantity).toBe(product.getConnectorCount())
    })

    it('should sum budget correctly', () => {
      const budgets = product.exportBudget()
      const lineBudget = budgets.find(b => b.type === 'line')!

      const summedLength = lineBudget.items.reduce(
        (sum, item) => sum + (item.totalLength || 0),
        0
      )
      expect(summedLength).toBeCloseTo(product.getTotalBeamLength(), 5)
    })
  })

  describe('Export Formats', () => {
    it('should export as OBJ format', () => {
      const obj = product.exportOBJ()
      expect(typeof obj).toBe('string')
      expect(obj).toContain('v ') // Vertices
      expect(obj).toContain('f ') // Faces
      expect(obj).toContain('Acidome')
    })

    it('OBJ export should contain correct vertex count', () => {
      const obj = product.exportOBJ()
      const vertexLines = obj.split('\n').filter(line => line.startsWith('v '))
      expect(vertexLines.length).toBe(figure.getVertexCount())
    })

    it('OBJ export should contain correct face count', () => {
      const obj = product.exportOBJ()
      const faceLines = obj.split('\n').filter(line => line.startsWith('f '))
      expect(faceLines.length).toBe(figure.getFaceCount())
    })
  })

  describe('Different Connector Types', () => {
    it('should work with different connector types', () => {
      const types = ['Piped', 'GoodKarma', 'Semicone', 'Cone', 'Joint']

      for (const type of types) {
        const params: ProductParams = {
          ...productParams,
          connectorType: type as any
        }
        const prod = new Product(figure, params)
        expect(prod.getConnectorCount()).toBe(figure.getVertexCount())
      }
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero-radius figure', () => {
      const zeroParams = { ...figureParams, radius: 0 }
      // Note: This might not be a valid use case, but we test graceful handling
      expect(() => {
        new Icosahedron(zeroParams)
      }).not.toThrow()
    })

    it('should handle very small radius', () => {
      const smallParams = { ...figureParams, radius: 0.001 }
      const fig = new Icosahedron(smallParams)
      const prod = new Product(fig, productParams)
      expect(prod.getBeamCount()).toBeGreaterThan(0)
    })

    it('should handle very large radius', () => {
      const largeParams = { ...figureParams, radius: 1000 }
      const fig = new Icosahedron(largeParams)
      const prod = new Product(fig, productParams)
      expect(prod.getBeamCount()).toBeGreaterThan(0)
      expect(prod.getTotalBeamLength()).toBeGreaterThan(0)
    })

    it('should handle large beam dimensions', () => {
      const largeBeamParams: ProductParams = {
        ...productParams,
        beamsWidth: 500,
        beamsThickness: 300
      }
      const prod = new Product(figure, largeBeamParams)
      expect(prod.getBeamCount()).toBeGreaterThan(0)
    })
  })

  describe('Data Consistency', () => {
    it('should have consistent panel count', () => {
      expect(product.panels.length).toBe(product.getPanelCount())
    })

    it('should have consistent beam count', () => {
      expect(product.beams.length).toBe(product.getBeamCount())
    })

    it('should have consistent connector count', () => {
      expect(product.connectors.length).toBe(product.getConnectorCount())
    })

    it('should maintain reference to figure', () => {
      expect(product.figure).toBe(figure)
      expect(product.params.radius).toBe(productParams.radius)
    })
  })
})
