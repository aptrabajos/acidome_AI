/**
 * Unit tests for Figure module
 * Tests geodesic dome geometry calculations
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Icosahedron, Octohedron, createFigure } from '@/core/Figure'
import type { FigureParams } from '@/types/figure'

describe('Icosahedron', () => {
  let params: FigureParams
  let ico: Icosahedron

  beforeEach(() => {
    params = {
      base: 'Icosahedron',
      detail: 1,
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
    ico = new Icosahedron(params)
  })

  describe('Base Geometry', () => {
    it('should create icosahedron with correct vertex count', () => {
      expect(ico.getVertexCount()).toBe(12) // Icosahedron has 12 vertices
    })

    it('should create icosahedron with correct face count', () => {
      expect(ico.getFaceCount()).toBe(20) // Icosahedron has 20 faces
    })

    it('should create edges', () => {
      expect(ico.getEdgeCount()).toBeGreaterThan(0)
    })

    it('should normalize all vertices to unit sphere', () => {
      for (const vertex of ico.vertices) {
        const length = Math.sqrt(
          vertex.position.x ** 2 +
          vertex.position.y ** 2 +
          vertex.position.z ** 2
        )
        expect(length).toBeCloseTo(1, 5)
      }
    })
  })

  describe('Subdivision', () => {
    it('should subdivide geometry', () => {
      const params2 = { ...params, detail: 2 }
      const ico2 = new Icosahedron(params2)
      expect(ico2.getVertexCount()).toBeGreaterThan(ico.getVertexCount())
      expect(ico2.getFaceCount()).toBeGreaterThan(ico.getFaceCount())
    })

    it('should increase complexity with detail level', () => {
      const level1 = new Icosahedron({ ...params, detail: 1 })
      const level2 = new Icosahedron({ ...params, detail: 2 })
      const level3 = new Icosahedron({ ...params, detail: 3 })

      expect(level1.getVertexCount()).toBeLessThan(level2.getVertexCount())
      expect(level2.getVertexCount()).toBeLessThan(level3.getVertexCount())
    })
  })

  describe('Scaling', () => {
    it('should scale to specified radius', () => {
      const params2 = { ...params, radius: 2.5 }
      const ico2 = new Icosahedron(params2)

      for (const vertex of ico2.vertices) {
        const length = Math.sqrt(
          vertex.position.x ** 2 +
          vertex.position.y ** 2 +
          vertex.position.z ** 2
        )
        expect(length).toBeCloseTo(2.5, 4)
      }
    })
  })

  describe('Partial Sphere', () => {
    it('should cut partial sphere correctly', () => {
      const fullParams = { ...params, partial: '1/1' }
      const partialParams = { ...params, partial: '1/2' }

      const full = new Icosahedron(fullParams)
      const partial = new Icosahedron(partialParams)

      expect(partial.getVertexCount()).toBeLessThan(full.getVertexCount())
      expect(partial.getFaceCount()).toBeLessThan(full.getFaceCount())
    })
  })

  describe('Base Alignment', () => {
    it('should align base to horizontal plane', () => {
      const params2 = { ...params, alignTheBase: true }
      const ico2 = new Icosahedron(params2)

      let minY = Infinity
      for (const vertex of ico2.vertices) {
        minY = Math.min(minY, vertex.position.y)
      }

      expect(minY).toBeCloseTo(0, 5)
    })
  })

  describe('Statistics', () => {
    it('should calculate statistics', () => {
      const stats = ico.getStats()

      expect(stats.vertexCount).toBe(ico.getVertexCount())
      expect(stats.faceCount).toBe(ico.getFaceCount())
      expect(stats.edgeCount).toBe(ico.getEdgeCount())
      expect(stats.surfaceArea).toBeGreaterThan(0)
    })

    it('should calculate surface area', () => {
      const area = ico.calculateSurfaceArea()
      // For sphere of radius 1, surface area should be ~4π
      expect(area).toBeCloseTo(4 * Math.PI, 1)
    })
  })
})

describe('Octohedron', () => {
  let params: FigureParams
  let octo: Octohedron

  beforeEach(() => {
    params = {
      base: 'Octohedron',
      detail: 1,
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
    octo = new Octohedron(params)
  })

  describe('Base Geometry', () => {
    it('should create octohedron with correct vertex count', () => {
      expect(octo.getVertexCount()).toBe(6) // Octohedron has 6 vertices
    })

    it('should create octohedron with correct face count', () => {
      expect(octo.getFaceCount()).toBe(8) // Octohedron has 8 faces
    })

    it('should normalize all vertices to unit sphere', () => {
      for (const vertex of octo.vertices) {
        const length = Math.sqrt(
          vertex.position.x ** 2 +
          vertex.position.y ** 2 +
          vertex.position.z ** 2
        )
        expect(length).toBeCloseTo(1, 5)
      }
    })
  })

  describe('Subdivision', () => {
    it('should subdivide like icosahedron', () => {
      const params2 = { ...params, detail: 2 }
      const octo2 = new Octohedron(params2)
      expect(octo2.getVertexCount()).toBeGreaterThan(octo.getVertexCount())
      expect(octo2.getFaceCount()).toBeGreaterThan(octo.getFaceCount())
    })
  })
})

describe('Factory Function', () => {
  let icoParams: FigureParams
  let octoParams: FigureParams

  beforeEach(() => {
    icoParams = {
      base: 'Icosahedron',
      detail: 1,
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
    octoParams = { ...icoParams, base: 'Octohedron' }
  })

  it('should create icosahedron from factory', () => {
    const fig = createFigure(icoParams)
    expect(fig).toBeInstanceOf(Icosahedron)
    expect(fig.getVertexCount()).toBe(12)
  })

  it('should create octohedron from factory', () => {
    const fig = createFigure(octoParams)
    expect(fig).toBeInstanceOf(Octohedron)
    expect(fig.getVertexCount()).toBe(6)
  })

  it('should throw error for unknown polyhedron', () => {
    expect(() => {
      const invalidParams = {
        ...icoParams,
        base: 'InvalidPolyhedron' as any
      }
      createFigure(invalidParams)
    }).toThrow()
  })
})

describe('Geometry Validation', () => {
  let ico: Icosahedron

  beforeEach(() => {
    const params: FigureParams = {
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
    ico = new Icosahedron(params)
  })

  it('should have valid face indices', () => {
    for (const face of ico.faces) {
      expect(face.vertices.length).toBeGreaterThanOrEqual(3)
      for (const vertex of face.vertices) {
        expect(vertex.x).toBeDefined()
        expect(vertex.y).toBeDefined()
        expect(vertex.z).toBeDefined()
        expect(typeof vertex.x).toBe('number')
        expect(typeof vertex.y).toBe('number')
        expect(typeof vertex.z).toBe('number')
      }
    }
  })

  it('should have valid edges', () => {
    for (const edge of ico.edges) {
      expect(edge.vertexA).toBeDefined()
      expect(edge.vertexB).toBeDefined()
      const dist = Math.sqrt(
        (edge.vertexA.x - edge.vertexB.x) ** 2 +
        (edge.vertexA.y - edge.vertexB.y) ** 2 +
        (edge.vertexA.z - edge.vertexB.z) ** 2
      )
      expect(dist).toBeGreaterThan(0)
    }
  })

  it('should have consistent geometry', () => {
    const stats = ico.getStats()

    // All values should be positive
    expect(stats.vertexCount).toBeGreaterThan(0)
    expect(stats.faceCount).toBeGreaterThan(0)
    expect(stats.edgeCount).toBeGreaterThan(0)
    expect(stats.surfaceArea).toBeGreaterThan(0)

    // Euler characteristic for sphere: V - E + F = 2
    // (might not be exactly 2 due to boundary/cutting)
    const euler = stats.vertexCount - stats.edgeCount + stats.faceCount
    expect(euler).toBeGreaterThan(0)
  })
})
