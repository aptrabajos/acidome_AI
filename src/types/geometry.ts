/**
 * Type definitions for geometric math classes
 * These types represent the core mathematical structures used for geodesic dome calculations
 */

/**
 * 3D Vector with x, y, z components
 */
export interface Vector3 {
  x: number
  y: number
  z: number
}

/**
 * 4D Vector (used for rotations/quaternions)
 */
export interface Vector4 {
  x: number
  y: number
  z: number
  w: number
}

/**
 * Quaternion for 3D rotations
 */
export interface Quaternion {
  x: number
  y: number
  z: number
  w: number
}

/**
 * Plane definition: normal vector + distance from origin
 */
export interface Plane {
  normal: Vector3
  distance: number
}

/**
 * 4x4 Matrix for 3D transformations
 */
export interface Matrix4 {
  elements: number[] // 16 elements in column-major order
}

/**
 * Euler angles for rotations (in radians)
 */
export interface EulerAngles {
  x: number
  y: number
  z: number
  order?: 'XYZ' | 'YXZ' | 'ZXY' | 'ZYX' | 'YZX' | 'XZY'
}

/**
 * Metrics class - mathematical utilities for vector operations
 */
export class Metrics {
  // Vector operations
  static createVector(x: number, y: number, z: number): Vector3
  static addVectors(a: Vector3, b: Vector3): Vector3
  static subtractVectors(a: Vector3, b: Vector3): Vector3
  static multiplyVectorScalar(v: Vector3, scalar: number): Vector3
  static divideVectorScalar(v: Vector3, scalar: number): Vector3
  static dotProduct(a: Vector3, b: Vector3): number
  static crossProduct(a: Vector3, b: Vector3): Vector3
  static vectorLength(v: Vector3): number
  static normalizeVector(v: Vector3): Vector3

  // Quaternion operations
  static createQuaternion(x: number, y: number, z: number, w: number): Quaternion
  static quaternionFromAxisAngle(axis: Vector3, angle: number): Quaternion
  static quaternionToAxisAngle(q: Quaternion): { axis: Vector3; angle: number }
  static multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion
  static rotateVectorByQuaternion(v: Vector3, q: Quaternion): Vector3

  // Matrix operations
  static createMatrix4(): Matrix4
  static multiplyMatrices(a: Matrix4, b: Matrix4): Matrix4
  static transformVector(v: Vector3, m: Matrix4): Vector3
  static invertMatrix(m: Matrix4): Matrix4
}
