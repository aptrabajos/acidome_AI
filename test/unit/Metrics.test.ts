/**
 * Unit tests for Metrics module
 * Tests all vector and mathematical operations
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  Vector3Class,
  Metrics,
  PlaneClass,
  QuaternionClass
} from '@/core/Metrics'

describe('Vector3Class', () => {
  let v1: Vector3Class
  let v2: Vector3Class
  let v3: Vector3Class

  beforeEach(() => {
    v1 = new Vector3Class(1, 2, 3)
    v2 = new Vector3Class(4, 5, 6)
    v3 = new Vector3Class(0, 0, 0)
  })

  describe('Constructor & Basic Operations', () => {
    it('should create vector with correct values', () => {
      expect(v1.x).toBe(1)
      expect(v1.y).toBe(2)
      expect(v1.z).toBe(3)
    })

    it('should handle NaN values', () => {
      const v = new Vector3Class(NaN, NaN, NaN)
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
      expect(v.z).toBe(0)
    })

    it('should clone vector correctly', () => {
      const cloned = v1.clone()
      expect(cloned).toEqual(v1)
      expect(cloned).not.toBe(v1) // Different object
      cloned.x = 999
      expect(v1.x).toBe(1) // Original unchanged
    })

    it('should copy from another vector', () => {
      v3.copy(v1)
      expect(v3.x).toBe(1)
      expect(v3.y).toBe(2)
      expect(v3.z).toBe(3)
    })
  })

  describe('Arithmetic Operations', () => {
    it('should add vectors', () => {
      v1.add(v2)
      expect(v1.x).toBe(5)
      expect(v1.y).toBe(7)
      expect(v1.z).toBe(9)
    })

    it('should subtract vectors', () => {
      v2.subtract(v1)
      expect(v2.x).toBe(3)
      expect(v2.y).toBe(3)
      expect(v2.z).toBe(3)
    })

    it('should scale vector', () => {
      v1.scale(2)
      expect(v1.x).toBe(2)
      expect(v1.y).toBe(4)
      expect(v1.z).toBe(6)
    })

    it('should calculate length correctly', () => {
      const length = v1.length()
      expect(length).toBeCloseTo(Math.sqrt(14), 5)
    })

    it('should calculate lengthSq efficiently', () => {
      const lengthSq = v1.lengthSq()
      expect(lengthSq).toBe(14)
    })
  })

  describe('Normalization', () => {
    it('should normalize vector to unit length', () => {
      v1.normalize()
      const length = v1.length()
      expect(length).toBeCloseTo(1, 5)
    })

    it('should handle zero vector normalization gracefully', () => {
      v3.normalize()
      expect(v3.x).toBe(0)
      expect(v3.y).toBe(0)
      expect(v3.z).toBe(0)
    })

    it('should check if vector is zero', () => {
      expect(v3.isZero()).toBe(true)
      expect(v1.isZero()).toBe(false)
    })
  })

  describe('Dot & Cross Product', () => {
    it('should calculate dot product', () => {
      const dot = v1.dot(v2)
      expect(dot).toBe(1 * 4 + 2 * 5 + 3 * 6) // 32
    })

    it('should calculate cross product', () => {
      const cross = v1.cross(v2)
      expect(cross.x).toBe(2 * 6 - 3 * 5) // -3
      expect(cross.y).toBe(3 * 4 - 1 * 6) // 6
      expect(cross.z).toBe(1 * 5 - 2 * 4) // -3
    })

    it('should return zero vector for parallel vectors cross product', () => {
      const v = new Vector3Class(1, 2, 3)
      const parallel = new Vector3Class(2, 4, 6)
      const cross = v.cross(parallel)
      expect(cross.isZero()).toBe(true)
    })
  })

  describe('Projection & Perpendicular', () => {
    it('should project vector onto another', () => {
      const proj = v1.projectOnto(new Vector3Class(1, 0, 0))
      expect(proj.x).toBeCloseTo(1, 5)
      expect(proj.y).toBe(0)
      expect(proj.z).toBe(0)
    })

    it('should get perpendicular component', () => {
      const perp = v1.perpendicular(new Vector3Class(1, 0, 0))
      expect(perp.x).toBeCloseTo(0, 5)
      expect(perp.y).toBeCloseTo(2, 5)
      expect(perp.z).toBeCloseTo(3, 5)
    })
  })

  describe('Distance & Angle', () => {
    it('should calculate distance to another vector', () => {
      const dist = v1.distanceTo(v2)
      expect(dist).toBeCloseTo(Math.sqrt(27), 5)
    })

    it('should calculate squared distance', () => {
      const distSq = v1.distanceToSq(v2)
      expect(distSq).toBe(27)
    })

    it('should calculate angle between vectors', () => {
      const v = new Vector3Class(1, 0, 0)
      const angle = v.angleTo(new Vector3Class(0, 1, 0))
      expect(angle).toBeCloseTo(Math.PI / 2, 5)
    })
  })

  describe('Rotations', () => {
    it('should rotate around X axis', () => {
      const v = new Vector3Class(0, 1, 0)
      v.rotateX(Math.PI / 2)
      expect(v.x).toBeCloseTo(0, 5)
      expect(v.y).toBeCloseTo(0, 5)
      expect(v.z).toBeCloseTo(1, 5)
    })

    it('should rotate around Y axis', () => {
      const v = new Vector3Class(1, 0, 0)
      v.rotateY(Math.PI / 2)
      expect(v.x).toBeCloseTo(0, 5)
      expect(v.y).toBe(0)
      expect(v.z).toBeCloseTo(-1, 5)
    })

    it('should rotate around Z axis', () => {
      const v = new Vector3Class(1, 0, 0)
      v.rotateZ(Math.PI / 2)
      expect(v.x).toBeCloseTo(0, 5)
      expect(v.y).toBeCloseTo(1, 5)
      expect(v.z).toBe(0)
    })
  })

  describe('Equality', () => {
    it('should check equality with tolerance', () => {
      const v = new Vector3Class(1.00000001, 2, 3)
      expect(v.equals(v1)).toBe(true)
    })

    it('should reject unequal vectors', () => {
      expect(v1.equals(v2)).toBe(false)
    })
  })

  describe('String representation', () => {
    it('should return readable string', () => {
      const str = v1.toString()
      expect(str).toContain('Vector3')
      expect(str).toContain('1')
      expect(str).toContain('2')
      expect(str).toContain('3')
    })
  })
})

describe('Metrics (Static Utilities)', () => {
  let v1: Vector3Class
  let v2: Vector3Class

  beforeEach(() => {
    v1 = new Vector3Class(1, 2, 3)
    v2 = new Vector3Class(4, 5, 6)
  })

  describe('Vector Operations', () => {
    it('should add vectors statically', () => {
      const sum = Metrics.addVectors(v1, v2)
      expect(sum.x).toBe(5)
      expect(sum.y).toBe(7)
      expect(sum.z).toBe(9)
    })

    it('should subtract vectors statically', () => {
      const diff = Metrics.subtractVectors(v1, v2)
      expect(diff.x).toBe(-3)
      expect(diff.y).toBe(-3)
      expect(diff.z).toBe(-3)
    })

    it('should multiply vector by scalar', () => {
      const scaled = Metrics.multiplyVectorScalar(v1, 3)
      expect(scaled.x).toBe(3)
      expect(scaled.y).toBe(6)
      expect(scaled.z).toBe(9)
    })

    it('should divide vector by scalar', () => {
      const divided = Metrics.divideVectorScalar(v1, 2)
      expect(divided.x).toBe(0.5)
      expect(divided.y).toBe(1)
      expect(divided.z).toBe(1.5)
    })
  })

  describe('Trigonometric Functions', () => {
    it('should calculate triangle area with Heron formula', () => {
      const area = Metrics.triangleHeronArea(3, 4, 5) // Right triangle
      expect(area).toBeCloseTo(6, 5)
    })

    it('should calculate distance between vectors', () => {
      const dist = Metrics.distance(v1, v2)
      expect(dist).toBeCloseTo(Math.sqrt(27), 5)
    })

    it('should calculate angle between two vectors', () => {
      const v = new Vector3Class(1, 0, 0)
      const angle = Metrics.angle(v, new Vector3Class(0, 1, 0))
      expect(angle).toBeCloseTo(Math.PI / 2, 5)
    })

    it('should calculate angle at a point', () => {
      const a = new Vector3Class(1, 0, 0)
      const b = new Vector3Class(0, 0, 0)
      const c = new Vector3Class(0, 1, 0)
      const angle = Metrics.angle(a, b, c)
      expect(angle).toBeCloseTo(Math.PI / 2, 5)
    })
  })

  describe('Interpolation', () => {
    it('should linearly interpolate between vectors', () => {
      const lerp = Metrics.lerp(v1, v2, 0.5)
      expect(lerp.x).toBeCloseTo(2.5, 5)
      expect(lerp.y).toBeCloseTo(3.5, 5)
      expect(lerp.z).toBeCloseTo(4.5, 5)
    })

    it('should average multiple vectors', () => {
      const avg = Metrics.average(v1, v2)
      expect(avg.x).toBeCloseTo(2.5, 5)
      expect(avg.y).toBeCloseTo(3.5, 5)
      expect(avg.z).toBeCloseTo(4.5, 5)
    })
  })

  describe('Normalization', () => {
    it('should normalize vector statically', () => {
      const normalized = Metrics.normalizeVector(v1)
      const length = normalized.length()
      expect(length).toBeCloseTo(1, 5)
    })
  })
})

describe('PlaneClass', () => {
  let plane: PlaneClass

  beforeEach(() => {
    plane = new PlaneClass(new Vector3Class(0, 1, 0), 0)
  })

  describe('Plane Operations', () => {
    it('should calculate distance from point to plane', () => {
      const distance = plane.distanceToPoint(new Vector3Class(0, 5, 0))
      expect(distance).toBe(5)
    })

    it('should get closest point on plane', () => {
      const closest = plane.getClosestPointToPoint(new Vector3Class(0, 5, 0))
      expect(closest.x).toBeCloseTo(0, 5)
      expect(closest.y).toBeCloseTo(0, 5)
      expect(closest.z).toBeCloseTo(0, 5)
    })

    it('should check if point is on plane', () => {
      expect(plane.containsPoint(new Vector3Class(0, 0, 0))).toBe(true)
      expect(plane.containsPoint(new Vector3Class(0, 1, 0))).toBe(false)
    })
  })
})

describe('QuaternionClass', () => {
  describe('Quaternion Operations', () => {
    it('should create quaternion from axis-angle', () => {
      const axis = new Vector3Class(0, 0, 1)
      const q = QuaternionClass.fromAxisAngle(axis, Math.PI / 2)
      expect(q.w).toBeCloseTo(Math.cos(Math.PI / 4), 5)
      expect(q.z).toBeCloseTo(Math.sin(Math.PI / 4), 5)
    })

    it('should rotate vector by quaternion', () => {
      const q = QuaternionClass.fromAxisAngle(
        new Vector3Class(0, 0, 1),
        Math.PI / 2
      )
      const v = new Vector3Class(1, 0, 0)
      const rotated = q.rotateVector(v)
      expect(rotated.x).toBeCloseTo(0, 5)
      expect(rotated.y).toBeCloseTo(1, 5)
      expect(rotated.z).toBeCloseTo(0, 5)
    })
  })
})
