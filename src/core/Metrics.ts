/**
 * Metrics - Mathematical utilities for geometric calculations
 * This module provides vector and matrix operations essential for geodesic dome calculations
 */

import { Vector3, Quaternion, EulerAngles } from '../types/geometry'

/**
 * Vector3 class - 3D vector with mathematical operations
 */
export class Vector3Class implements Vector3 {
  x: number
  y: number
  z: number

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = isNaN(x) ? 0 : Number(x)
    this.y = isNaN(y) ? 0 : Number(y)
    this.z = isNaN(z) ? 0 : Number(z)
  }

  /**
   * Create a copy of this vector
   */
  clone(): Vector3Class {
    return new Vector3Class(this.x, this.y, this.z)
  }

  /**
   * Copy values from another vector
   */
  copy(v: Vector3): this {
    this.x = v.x
    this.y = v.y
    this.z = v.z
    return this
  }

  /**
   * Check if vectors are approximately equal
   */
  equals(v: Vector3, epsilon: number = 0.000001): boolean {
    return (
      Math.abs(this.x - v.x) +
      Math.abs(this.y - v.y) +
      Math.abs(this.z - v.z) < epsilon
    )
  }

  /**
   * Add vector in place
   */
  add(v: Vector3): this {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    return this
  }

  /**
   * Subtract vector in place
   */
  subtract(v: Vector3): this {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    return this
  }

  /**
   * Scale vector in place
   */
  scale(scalar: number): this {
    this.x *= scalar
    this.y *= scalar
    this.z *= scalar
    return this
  }

  /**
   * Get vector length/magnitude
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  /**
   * Get squared length (faster, avoids sqrt)
   */
  lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  /**
   * Check if vector is zero
   */
  isZero(epsilon: number = 1e-20): boolean {
    return this.lengthSq() < epsilon
  }

  /**
   * Normalize vector in place
   */
  normalize(): this {
    const length = this.length()
    if (length > 0) {
      this.x /= length
      this.y /= length
      this.z /= length
    }
    return this
  }

  /**
   * Dot product
   */
  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  /**
   * Cross product
   */
  cross(v: Vector3): Vector3Class {
    return new Vector3Class(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    )
  }

  /**
   * Project this vector onto another vector
   */
  projectOnto(v: Vector3): Vector3Class {
    const vDotV = v.x * v.x + v.y * v.y + v.z * v.z
    if (vDotV === 0) {
      return new Vector3Class()
    }
    const scalar = this.dot(v) / vDotV
    return new Vector3Class(v.x * scalar, v.y * scalar, v.z * scalar)
  }

  /**
   * Get perpendicular component relative to another vector
   */
  perpendicular(v: Vector3): Vector3Class {
    return this.clone().subtract(this.projectOnto(v))
  }

  /**
   * Distance to another vector
   */
  distanceTo(v: Vector3): number {
    const dx = this.x - v.x
    const dy = this.y - v.y
    const dz = this.z - v.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * Squared distance (faster)
   */
  distanceToSq(v: Vector3): number {
    const dx = this.x - v.x
    const dy = this.y - v.y
    const dz = this.z - v.z
    return dx * dx + dy * dy + dz * dz
  }

  /**
   * Angle between this and another vector (in radians)
   */
  angleTo(v: Vector3): number {
    const theta = this.dot(v) / (this.length() * (v as Vector3Class).length())
    return Math.acos(Math.max(-1, Math.min(1, theta)))
  }

  /**
   * Rotate around axis
   */
  rotateAroundAxis(axis: Vector3, angle: number): this {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const oneMinusCos = 1 - cos

    const ax = (axis as Vector3Class).clone().normalize()
    const { x: ax_x, y: ax_y, z: ax_z } = ax

    const dot = this.dot(ax)

    this.x =
      this.x * cos +
      (ax_x * dot * oneMinusCos + (ax_y * this.z - ax_z * this.y) * sin)

    this.y =
      this.y * cos +
      (ax_y * dot * oneMinusCos + (ax_z * this.x - ax_x * this.z) * sin)

    this.z =
      this.z * cos +
      (ax_z * dot * oneMinusCos + (ax_x * this.y - ax_y * this.x) * sin)

    return this
  }

  /**
   * Rotate around X axis
   */
  rotateX(angle: number): this {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const ty = this.y
    this.y = ty * cos - this.z * sin
    this.z = ty * sin + this.z * cos
    return this
  }

  /**
   * Rotate around Y axis
   */
  rotateY(angle: number): this {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const tx = this.x
    this.x = tx * cos + this.z * sin
    this.z = -tx * sin + this.z * cos
    return this
  }

  /**
   * Rotate around Z axis
   */
  rotateZ(angle: number): this {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const tx = this.x
    this.x = tx * cos - this.y * sin
    this.y = tx * sin + this.y * cos
    return this
  }

  /**
   * String representation
   */
  toString(): string {
    return `Vector3(${this.x.toFixed(3)}, ${this.y.toFixed(3)}, ${this.z.toFixed(3)})`
  }
}

/**
 * Metrics class - static utility functions for vector operations
 */
export class Metrics {
  /**
   * Calculate Heron's formula for triangle area
   */
  static triangleHeronArea(a: number, b: number, c: number): number {
    const p = (a + b + c) / 2
    return Math.sqrt(p * (p - a) * (p - b) * (p - c))
  }

  /**
   * Create a vector from components
   */
  static createVector(x: number, y: number, z: number): Vector3Class {
    return new Vector3Class(x, y, z)
  }

  /**
   * Add two vectors
   */
  static addVectors(a: Vector3, b: Vector3): Vector3Class {
    return new Vector3Class(a.x + b.x, a.y + b.y, a.z + b.z)
  }

  /**
   * Subtract two vectors
   */
  static subtractVectors(a: Vector3, b: Vector3): Vector3Class {
    return new Vector3Class(a.x - b.x, a.y - b.y, a.z - b.z)
  }

  /**
   * Multiply vector by scalar
   */
  static multiplyVectorScalar(v: Vector3, scalar: number): Vector3Class {
    return new Vector3Class(v.x * scalar, v.y * scalar, v.z * scalar)
  }

  /**
   * Divide vector by scalar
   */
  static divideVectorScalar(v: Vector3, scalar: number): Vector3Class {
    return new Vector3Class(v.x / scalar, v.y / scalar, v.z / scalar)
  }

  /**
   * Dot product
   */
  static dotProduct(a: Vector3, b: Vector3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z
  }

  /**
   * Cross product
   */
  static crossProduct(a: Vector3, b: Vector3): Vector3Class {
    return new Vector3Class(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    )
  }

  /**
   * Get vector length
   */
  static vectorLength(v: Vector3): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
  }

  /**
   * Normalize vector
   */
  static normalizeVector(v: Vector3): Vector3Class {
    return (v as Vector3Class).clone().normalize()
  }

  /**
   * Distance between two vectors
   */
  static distance(a: Vector3, b: Vector3): number {
    const dx = a.x - b.x
    const dy = a.y - b.y
    const dz = a.z - b.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * Angle between two vectors (in radians)
   */
  static angle(a: Vector3, b: Vector3, c?: Vector3): number {
    if (c) {
      const ba = Metrics.subtractVectors(a, b)
      const bc = Metrics.subtractVectors(c, b)
      return ba.angleTo(bc)
    }
    return (a as Vector3Class).angleTo(b)
  }

  /**
   * Linear interpolation between two vectors
   */
  static lerp(a: Vector3, b: Vector3, t: number): Vector3Class {
    return new Vector3Class(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t,
      a.z + (b.z - a.z) * t
    )
  }

  /**
   * Get average of multiple vectors
   */
  static average(...vectors: Vector3[]): Vector3Class {
    if (vectors.length === 0) return new Vector3Class()
    let sum = new Vector3Class()
    for (const v of vectors) {
      sum.add(v)
    }
    return sum.scale(1 / vectors.length)
  }
}

/**
 * Plane class - plane defined by normal and distance
 */
export class PlaneClass {
  normal: Vector3Class
  distance: number

  constructor(normal: Vector3 = new Vector3Class(0, 0, 1), distance: number = 0) {
    this.normal = (normal as Vector3Class).clone().normalize()
    this.distance = distance
  }

  /**
   * Set from normal and distance
   */
  setFromNormalAndDistance(normal: Vector3, distance: number): this {
    this.normal = (normal as Vector3Class).clone().normalize()
    this.distance = distance
    return this
  }

  /**
   * Get distance from point to plane
   */
  distanceToPoint(point: Vector3): number {
    return this.normal.dot(point) - this.distance
  }

  /**
   * Get the closest point on plane to a given point
   */
  getClosestPointToPoint(point: Vector3): Vector3Class {
    const d = this.distanceToPoint(point)
    return Metrics.subtractVectors(
      point,
      Metrics.multiplyVectorScalar(this.normal, d)
    )
  }

  /**
   * Check if point is coplanar
   */
  containsPoint(point: Vector3, epsilon: number = 0.00001): boolean {
    return Math.abs(this.distanceToPoint(point)) < epsilon
  }
}

/**
 * Quaternion class - for 3D rotations
 */
export class QuaternionClass implements Quaternion {
  x: number
  y: number
  z: number
  w: number

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  /**
   * Create from axis and angle
   */
  static fromAxisAngle(axis: Vector3, angle: number): QuaternionClass {
    const halfAngle = angle / 2
    const s = Math.sin(halfAngle)
    const normalized = (axis as Vector3Class).clone().normalize()
    return new QuaternionClass(
      normalized.x * s,
      normalized.y * s,
      normalized.z * s,
      Math.cos(halfAngle)
    )
  }

  /**
   * Multiply two quaternions
   */
  multiply(q: Quaternion): this {
    const ax = this.x,
      ay = this.y,
      az = this.z,
      aw = this.w
    const bx = q.x,
      by = q.y,
      bz = q.z,
      bw = q.w

    this.x = ax * bw + aw * bx + ay * bz - az * by
    this.y = ay * bw + aw * by + az * bx - ax * bz
    this.z = az * bw + aw * bz + ax * by - ay * bx
    this.w = aw * bw - ax * bx - ay * by - az * bz

    return this
  }

  /**
   * Rotate a vector by this quaternion
   */
  rotateVector(v: Vector3): Vector3Class {
    const x = v.x,
      y = v.y,
      z = v.z
    const qx = this.x,
      qy = this.y,
      qz = this.z,
      qw = this.w

    const ix = qw * x + qy * z - qz * y
    const iy = qw * y + qz * x - qx * z
    const iz = qw * z + qx * y - qy * x
    const iw = -qx * x - qy * y - qz * z

    return new Vector3Class(
      ix * qw + iw * -qx + iy * -qz - iz * -qy,
      iy * qw + iw * -qy + iz * -qx - ix * -qz,
      iz * qw + iw * -qz + ix * -qy - iy * -qx
    )
  }
}
