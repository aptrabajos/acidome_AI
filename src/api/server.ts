/**
 * ACIDOME REST API Server
 *
 * Express.js server that exposes geodesic dome calculations via REST endpoints
 *
 * Usage:
 *   npm run api
 *
 * Endpoints:
 *   POST /api/dome/calculate - Calculate dome specifications
 *   GET  /api/health - Server health check
 *   GET  /api/docs - API documentation
 */

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { AcidomeCalculator, DomeParams, DomeResults } from './calculator'

/**
 * Initialize Express app
 */
const app = express()
const PORT = process.env.PORT || 3000

/**
 * Middleware
 */
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * Request logging middleware
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`)
  })
  next()
})

/**
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

/**
 * API Documentation
 */
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    version: '1.0.0',
    title: 'ACIDOME REST API',
    description: 'Geodesic Dome Calculator API',
    baseUrl: `http://localhost:${PORT}/api`,
    endpoints: {
      calculate: {
        method: 'POST',
        path: '/dome/calculate',
        description: 'Calculate complete dome specifications',
        request: {
          detail: '3-4 (frequency V3-V4)',
          partial: '"5/12", "7/12", etc.',
          radius: '5 (meters)',
          connType: '"GoodKarma", "Piped", "Semicone", etc.',
          beamsWidth: '160 (mm)',
          beamsThickness: '40 (mm)',
        },
        response: 'DomeResults object with geometry, dimensions, beams, panels, connectors',
      },
      health: {
        method: 'GET',
        path: '/health',
        description: 'Server health status',
      },
      docs: {
        method: 'GET',
        path: '/docs',
        description: 'This documentation',
      },
    },
  })
})

/**
 * Main calculation endpoint
 *
 * POST /api/dome/calculate
 *
 * Request body:
 * {
 *   "detail": 3,
 *   "partial": "5/12",
 *   "radius": 5,
 *   "connType": "GoodKarma",
 *   "beamsWidth": 160,
 *   "beamsThickness": 40
 * }
 *
 * Response:
 * {
 *   "input": {...},
 *   "geometry": {...},
 *   "dimensions": {...},
 *   "beams": {...},
 *   "panels": {...},
 *   "connectors": {...},
 *   "metadata": {...}
 * }
 */
app.post('/api/dome/calculate', (req: Request, res: Response, next: NextFunction) => {
  try {
    const params: DomeParams = {
      detail: req.body.detail || 3,
      partial: req.body.partial || '5/12',
      radius: req.body.radius || 5,
      connType: req.body.connType || 'GoodKarma',
      beamsWidth: req.body.beamsWidth || 160,
      beamsThickness: req.body.beamsThickness || 40,
      base: req.body.base || 'Icosahedron',
      subdivClass: req.body.subdivClass || 'I',
      subdivMethod: req.body.subdivMethod || 'Kruschke',
      symmetry: req.body.symmetry || 'Pentad',
      fullerenType: req.body.fullerenType || 'none',
      partialMode: req.body.partialMode || 'faces',
    }

    // Validate parameters
    const validation = validateDomeParams(params)
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid parameters',
        messages: validation.errors,
      })
    }

    // Calculate
    const calculator = new AcidomeCalculator(params)
    const results = calculator.calculate()

    // Return results
    res.json({
      success: true,
      data: results,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * Batch calculation endpoint (optional, for future use)
 */
app.post('/api/dome/batch', (req: Request, res: Response, next: NextFunction) => {
  try {
    const paramsList: DomeParams[] = req.body.domes || []

    if (!Array.isArray(paramsList) || paramsList.length === 0) {
      return res.status(400).json({
        error: 'Request must contain "domes" array',
      })
    }

    const results = paramsList.map((params) => {
      const calculator = new AcidomeCalculator(params)
      return calculator.calculate()
    })

    res.json({
      success: true,
      count: results.length,
      data: results,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * Error handling middleware
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    availableEndpoints: [
      'POST /api/dome/calculate',
      'GET /api/health',
      'GET /api/docs',
    ],
  })
})

/**
 * Validate dome parameters
 */
interface ValidationResult {
  valid: boolean
  errors: string[]
}

function validateDomeParams(params: DomeParams): ValidationResult {
  const errors: string[] = []

  if (!params.detail || params.detail < 1 || params.detail > 18) {
    errors.push('detail must be between 1 and 18')
  }

  if (!params.radius || params.radius < 0.1) {
    errors.push('radius must be greater than 0.1 meters')
  }

  if (!params.beamsWidth || params.beamsWidth < 10) {
    errors.push('beamsWidth must be at least 10 mm')
  }

  if (!params.beamsThickness || params.beamsThickness < 5) {
    errors.push('beamsThickness must be at least 5 mm')
  }

  const validConnTypes = ['Piped', 'GoodKarma', 'Semicone', 'Cone', 'Joint', 'Nose']
  if (!validConnTypes.includes(params.connType)) {
    errors.push(`connType must be one of: ${validConnTypes.join(', ')}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Start server
 */
export function startServer(port: number = PORT) {
  app.listen(port, () => {
    console.log(`\n`)
    console.log(`═══════════════════════════════════════════════════════════`)
    console.log(`ACIDOME REST API Server started`)
    console.log(`═══════════════════════════════════════════════════════════`)
    console.log(`\nEndpoints:`)
    console.log(`  POST  http://localhost:${port}/api/dome/calculate`)
    console.log(`  GET   http://localhost:${port}/api/health`)
    console.log(`  GET   http://localhost:${port}/api/docs`)
    console.log(`\nExample request:`)
    console.log(`  curl -X POST http://localhost:${port}/api/dome/calculate \\`)
    console.log(`    -H "Content-Type: application/json" \\`)
    console.log(`    -d '{`)
    console.log(`      "detail": 3,`)
    console.log(`      "partial": "5/12",`)
    console.log(`      "radius": 5,`)
    console.log(`      "connType": "GoodKarma",`)
    console.log(`      "beamsWidth": 160,`)
    console.log(`      "beamsThickness": 40`)
    console.log(`    }'`)
    console.log(`\n`)
  })
}

// Start server if this is the main module
if (require.main === module) {
  startServer()
}

export default app
