/**
 * Vitest setup file
 * Global configuration for all tests
 */

import { expect, afterEach, vi } from 'vitest'

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}

// Custom matchers for geometric operations
expect.extend({
  toBeVectorLike(received: any, expected: any) {
    const pass =
      typeof received.x === 'number' &&
      typeof received.y === 'number' &&
      typeof received.z === 'number' &&
      Math.abs(received.x - expected.x) < 0.0001 &&
      Math.abs(received.y - expected.y) < 0.0001 &&
      Math.abs(received.z - expected.z) < 0.0001

    return {
      pass,
      message: () =>
        pass
          ? `Vector is equal to ${JSON.stringify(expected)}`
          : `Vector ${JSON.stringify(received)} is not equal to ${JSON.stringify(expected)}`
    }
  },

  toBeNormalized(received: any) {
    const length = Math.sqrt(received.x ** 2 + received.y ** 2 + received.z ** 2)
    const pass = Math.abs(length - 1) < 0.0001

    return {
      pass,
      message: () =>
        pass
          ? 'Vector is normalized'
          : `Vector length is ${length}, expected 1`
    }
  }
})

// Extend the Matchers interface with custom matchers
declare global {
  namespace Vi {
    interface Matchers<R> {
      toBeVectorLike(expected: any): R
      toBeNormalized(): R
    }
  }
}
