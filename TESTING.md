# Testing Guide - ACIDOME

Complete guide to running, writing, and maintaining tests for ACIDOME.

## 📋 Overview

- **Framework**: Vitest (Lightning-fast unit test framework)
- **Coverage Target**: 80%+ code coverage
- **Test Types**: Unit tests + Integration tests
- **Environment**: jsdom (browser-like environment)

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
# Run tests once
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Run with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage

# Debug tests
npm run test:debug
```

## 📁 Test Structure

```
test/
├── setup.ts                          # Global test configuration
├── unit/                             # Unit tests
│   ├── Metrics.test.ts              # Vector & math operations
│   ├── Figure.test.ts               # Geometry calculations
│   └── Product.test.ts              # Physical components & budget
└── integration/                      # Integration tests
    └── Calculate.integration.test.ts # Full workflow tests
```

## 🧪 Test Categories

### Unit Tests

Test individual functions and classes in isolation.

#### Metrics.test.ts (150+ test cases)
- Vector3Class construction and operations
- Vector arithmetic (add, subtract, scale)
- Vector normalization and length
- Dot and cross products
- Projections and perpendiculars
- Distance and angle calculations
- Rotations (around X, Y, Z axes)
- Equality checks
- Static utility functions
- Plane operations
- Quaternion operations

#### Figure.test.ts (50+ test cases)
- Icosahedron creation (12 vertices, 20 faces)
- Octohedron creation (6 vertices, 8 faces)
- Base geometry validation
- Subdivision at different levels
- Scaling to specified radius
- Partial sphere cutting
- Base alignment
- Statistics calculation
- Surface area calculation
- Geometry validation (Euler characteristic)
- Factory pattern

#### Product.test.ts (60+ test cases)
- Panel generation from faces
- Beam generation from edges
- Connector generation from vertices
- Beam dimension application
- Panel area and perimeter
- Beam length calculations
- Budget generation
- Budget accuracy
- OBJ export format
- Different connector types
- Edge cases (zero/small/large radius)
- Data consistency

### Integration Tests

Test complete workflows from start to finish.

#### Calculate.integration.test.ts (30+ test cases)
- Standard dome configuration
- Different detail levels (1-4)
- Partial spheres
- Base alignment
- Budget calculations
- Export functionality
- Multiple polyhedron types
- Geometry consistency
- Performance benchmarks

## ✍️ Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { MyModule } from '@/core/MyModule'

describe('MyModule', () => {
  let instance: MyModule

  beforeEach(() => {
    // Setup before each test
    instance = new MyModule()
  })

  describe('Feature Group', () => {
    it('should do something', () => {
      const result = instance.doSomething()
      expect(result).toBe(expectedValue)
    })

    it('should handle edge case', () => {
      expect(() => {
        instance.problematicMethod()
      }).toThrow()
    })
  })
})
```

### Common Assertions

```typescript
// Equality
expect(value).toBe(expected)
expect(obj).toEqual({ x: 1 })
expect(value).not.toBe(other)

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeDefined()
expect(value).toBeNull()

// Numbers
expect(value).toBeCloseTo(3.14159, 5) // 5 decimal places
expect(value).toBeGreaterThan(0)
expect(value).toBeLessThan(10)
expect(value).toBeGreaterThanOrEqual(0)

// Strings
expect(text).toMatch(/pattern/)
expect(text).toContain('substring')

// Arrays
expect(arr).toContain(item)
expect(arr.length).toBe(5)

// Functions
expect(fn).toThrow()
expect(fn).toThrow(ErrorType)
expect(fn).not.toThrow()

// Custom matchers (see setup.ts)
expect(vector).toBeVectorLike({ x: 1, y: 2, z: 3 })
expect(vector).toBeNormalized()
```

### Testing Vectors

```typescript
import { Vector3Class, Metrics } from '@/core/Metrics'

describe('Vector operations', () => {
  it('should add vectors correctly', () => {
    const v1 = new Vector3Class(1, 2, 3)
    const v2 = new Vector3Class(4, 5, 6)

    v1.add(v2)

    expect(v1.x).toBe(5)
    expect(v1.y).toBe(7)
    expect(v1.z).toBe(9)
  })

  it('should normalize vector', () => {
    const v = new Vector3Class(3, 4, 0)
    v.normalize()

    expect(v.length()).toBeCloseTo(1, 5)
    expect(v).toBeNormalized()
  })
})
```

### Testing Figures

```typescript
import { createFigure } from '@/core/Figure'
import type { FigureParams } from '@/types/figure'

describe('Geodesic figures', () => {
  it('should create valid icosahedron', () => {
    const params: FigureParams = {
      base: 'Icosahedron',
      detail: 2,
      radius: 2.0,
      // ... other params
    }

    const figure = createFigure(params)

    expect(figure.getVertexCount()).toBe(12) // At detail 1
    expect(figure.getFaceCount()).toBe(20)

    // Verify geometry
    for (const vertex of figure.vertices) {
      const dist = vertex.position.length()
      expect(dist).toBeCloseTo(params.radius, 4)
    }
  })
})
```

### Testing Products

```typescript
import { Product } from '@/core/Product'

describe('Product budget', () => {
  it('should calculate budget correctly', () => {
    const figure = createFigure(params)
    const product = new Product(figure, productParams)

    const budgets = product.exportBudget()

    expect(budgets).toHaveLength(3) // line, panel, connector

    const lineBudget = budgets[0]
    expect(lineBudget.type).toBe('line')
    expect(lineBudget.totalQuantity).toBe(figure.getEdgeCount())
    expect(lineBudget.totalLength).toBeGreaterThan(0)
  })
})
```

## 📊 Coverage Reports

### Generate Coverage Report

```bash
npm run test:coverage
```

This generates:
- **Text output** in terminal
- **HTML report** in `coverage/index.html`
- **LCOV format** in `coverage/lcov.info`

### Coverage Targets

- **Lines**: 80% minimum
- **Functions**: 80% minimum
- **Branches**: 75% minimum
- **Statements**: 80% minimum

### View Coverage Report

```bash
# Open HTML report
open coverage/index.html
```

## 🔍 Test Matchers

### Custom Matchers (defined in test/setup.ts)

```typescript
// Check if value is vector-like
expect(vector).toBeVectorLike({ x: 1, y: 2, z: 3 })

// Check if vector is normalized (length === 1)
expect(vector).toBeNormalized()
```

## 🐛 Debugging Tests

### Run Tests in Debug Mode

```bash
npm run test:debug
```

Then open Chrome DevTools to debug.

### Add Debug Logs

```typescript
it('should debug', () => {
  const value = someFunction()
  console.log('Value is:', value)  // Will not appear in test output
  expect(value).toBeDefined()
})
```

### Run Specific Test

```bash
# Run only tests matching pattern
npm test -- --grep "Vector"

# Run specific file
npm test -- test/unit/Metrics.test.ts

# Run in UI mode for interactive debugging
npm run test:ui
```

## 🚨 Common Issues

### Tests Timeout

If a test takes too long:

```typescript
it('slow test', async () => {
  // ... code
}, 10000) // 10 second timeout
```

### Import Errors

Ensure path alias is configured in `vitest.config.ts`:

```typescript
resolve: {
  alias: {
    '@': resolve(__dirname, './src')
  }
}
```

### Mock Modules

```typescript
import { vi } from 'vitest'

vi.mock('@/core/Figure', () => ({
  createFigure: vi.fn(() => mockFigure)
}))
```

## 📈 Best Practices

### 1. Clear Test Names
```typescript
// ❌ Bad
it('works', () => { ... })

// ✅ Good
it('should calculate correct surface area for unit sphere', () => { ... })
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('should add vectors', () => {
  // Arrange
  const v1 = new Vector3Class(1, 2, 3)
  const v2 = new Vector3Class(4, 5, 6)

  // Act
  v1.add(v2)

  // Assert
  expect(v1.x).toBe(5)
})
```

### 3. Test One Thing
```typescript
// ❌ Bad - tests multiple things
it('should validate geometry', () => {
  const fig = createFigure(params)
  expect(fig.vertices).toBeDefined()
  expect(fig.faces).toBeDefined()
  expect(fig.edges).toBeDefined()
  expect(fig.calculateSurfaceArea()).toBeGreaterThan(0)
})

// ✅ Good - one assertion per test
it('should define vertices', () => {
  expect(fig.vertices).toBeDefined()
})
```

### 4. Use beforeEach for Setup
```typescript
describe('Figure', () => {
  let figure: Figure

  beforeEach(() => {
    // This runs before each test
    figure = createFigure(defaultParams)
  })

  it('test 1', () => { ... })
  it('test 2', () => { ... })
})
```

### 5. Test Edge Cases
```typescript
describe('Vector length', () => {
  it('should handle zero vector', () => {
    const v = new Vector3Class(0, 0, 0)
    expect(v.length()).toBe(0)
  })

  it('should handle very large values', () => {
    const v = new Vector3Class(1e10, 1e10, 1e10)
    expect(v.length()).toBeGreaterThan(0)
  })
})
```

## 🔄 Continuous Integration

Tests run automatically on:
- Every commit (via pre-commit hook)
- Every push to main branches
- Pull requests

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest Matchers](https://vitest.dev/api/)

## ❓ FAQ

**Q: Why are tests failing?**
A: Run tests in watch mode to debug:
```bash
npm run test:watch
```

**Q: How do I skip a test?**
A: Use `.skip`:
```typescript
it.skip('should test this later', () => { ... })
```

**Q: How do I focus on one test?**
A: Use `.only`:
```typescript
it.only('should test this', () => { ... })
```

**Q: Can I test async code?**
A: Yes:
```typescript
it('should load data', async () => {
  const data = await loadData()
  expect(data).toBeDefined()
})
```

---

**Last Updated**: 2025-11-09
**Coverage Target**: 80%+
**Framework**: Vitest 1.1.0+
