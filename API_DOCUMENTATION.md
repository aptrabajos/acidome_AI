# ACIDOME REST API Documentation

## Overview

The ACIDOME REST API exposes geodesic dome calculations via HTTP endpoints. It provides a simple, modern interface to calculate complete dome specifications including geometry, dimensions, materials, and more.

**Version:** 1.0.0
**Base URL:** `http://localhost:3000/api`

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the API Server

```bash
npm run api
```

Server will start on `http://localhost:3000`

### 3. Test the API

```bash
curl -X POST http://localhost:3000/api/dome/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "detail": 3,
    "partial": "5/12",
    "radius": 5,
    "connType": "GoodKarma",
    "beamsWidth": 160,
    "beamsThickness": 40
  }'
```

---

## Endpoints

### POST `/api/dome/calculate`

Calculate complete dome specifications.

#### Request Body

```json
{
  "detail": 3,                    // Frequency: 1-18 (V1, V2, V3, V4, etc.)
  "partial": "5/12",              // Dome portion as fraction
  "radius": 5,                    // Sphere radius in meters
  "connType": "GoodKarma",        // Connector type
  "beamsWidth": 160,              // Beam width in mm
  "beamsThickness": 40,           // Beam thickness in mm

  // Optional parameters
  "base": "Icosahedron",          // Geometric base (default: Icosahedron)
  "subdivClass": "I",             // Subdivision class (default: I)
  "subdivMethod": "Kruschke",     // Subdivision method (default: Kruschke)
  "symmetry": "Pentad",           // Rotational symmetry (default: Pentad)
  "fullerenType": "none",         // Fullerene transformation (default: none)
  "partialMode": "faces"          // Slicing mode (default: faces)
}
```

#### Parameters Explanation

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `detail` | number | 1-18 | 3 | Frequency of subdivision (V1, V2, V3, V4, etc.) |
| `partial` | string | "1/8" to "1/1" | "7/12" | Fraction of dome to calculate |
| `radius` | number | 0.1-∞ | 5 | Sphere radius in meters |
| `connType` | string | See below | "GoodKarma" | Type of connector joint |
| `beamsWidth` | number | 10-1000 | 160 | Beam width in mm |
| `beamsThickness` | number | 5-1000 | 40 | Beam thickness in mm |

**Valid `connType` values:**
- `Piped` - Traditional piped connectors
- `GoodKarma` - Good Karma connector system (recommended)
- `Semicone` - Semicone connectors
- `Cone` - Cone connectors
- `Joint` - Simple joint connections
- `Nose` - Nose-type connectors (for Fullerene)

#### Response

```json
{
  "success": true,
  "data": {
    "input": {
      "detail": 3,
      "partial": "5/12",
      "radius": 5,
      "connType": "GoodKarma",
      "beamsWidth": 160,
      "beamsThickness": 40,
      ...
    },
    "geometry": {
      "vertices": 60,
      "faces": 75,
      "edges": 129
    },
    "dimensions": {
      "heightFromBase": 3.83,       // meters
      "baseRadius": 4.47,           // meters
      "baseArea": 62.83,            // m²
      "coverageArea": 130.90        // m²
    },
    "beams": {
      "length": 1717,               // mm
      "totalLength": 221.45,        // meters
      "totalVolume": 1.417,         // m³
      "angleBeweenFaces": 138.19,   // degrees
      "count": 129
    },
    "panels": {
      "count": 75,
      "sideLength": 1717,           // mm
      "height": 1487,               // mm (for triangular panels)
      "areaPerPanel": 1.2761,       // m²
      "totalArea": 95.71            // m²
    },
    "connectors": {
      "count": 60,
      "type": "GoodKarma",
      "convergences": 6
    },
    "metadata": {
      "calculatedAt": "2024-11-09T...",
      "version": "1.0.0"
    }
  }
}
```

#### Response Fields

**`geometry`** - Basic geometric counts
- `vertices` - Total number of connection points
- `faces` - Total number of panels
- `edges` - Total number of beams

**`dimensions`** - Physical dome dimensions
- `heightFromBase` - Height from base to apex (meters)
- `baseRadius` - Radius of dome base circle (meters)
- `baseArea` - Area of base circle (m²)
- `coverageArea` - Total surface area covered by panels (m²)

**`beams`** - Structural beam specifications
- `length` - Length of each beam (mm)
- `totalLength` - Sum of all beam lengths (meters)
- `totalVolume` - Total volume of all beams (m³)
- `angleBeweenFaces` - Dihedral angle between adjacent faces (degrees)
- `count` - Number of beams needed

**`panels`** - Panel/face specifications
- `count` - Number of triangular panels
- `sideLength` - Side length of each panel (mm)
- `height` - Height of triangular panel (mm)
- `areaPerPanel` - Area of single panel (m²)
- `totalArea` - Total area of all panels (m²)

**`connectors`** - Connection specifications
- `count` - Number of connector nodes
- `type` - Type of connector (GoodKarma, Piped, etc.)
- `convergences` - Number of beams meeting at typical connector

---

### GET `/api/health`

Check API server status.

#### Response

```json
{
  "status": "ok",
  "timestamp": "2024-11-09T15:30:00Z",
  "version": "1.0.0"
}
```

---

### GET `/api/docs`

Get API documentation (this document in JSON format).

#### Response

```json
{
  "version": "1.0.0",
  "title": "ACIDOME REST API",
  "description": "Geodesic Dome Calculator API",
  "baseUrl": "http://localhost:3000/api",
  "endpoints": { ... }
}
```

---

## Examples

### Example 1: Simple V3 Dome

Calculate a small V3 dome with standard parameters.

**Request:**
```bash
curl -X POST http://localhost:3000/api/dome/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "detail": 3,
    "partial": "5/12",
    "radius": 3,
    "connType": "GoodKarma",
    "beamsWidth": 160,
    "beamsThickness": 40
  }'
```

**Response (excerpt):**
```json
{
  "success": true,
  "data": {
    "geometry": {
      "vertices": 60,
      "faces": 75,
      "edges": 129
    },
    "dimensions": {
      "heightFromBase": 2.30,
      "baseRadius": 2.68,
      "baseArea": 22.57,
      "coverageArea": 58.77
    },
    "beams": {
      "length": 1030,
      "totalLength": 132.87,
      "totalVolume": 0.509,
      "angleBeweenFaces": 138.19,
      "count": 129
    }
  }
}
```

### Example 2: Larger V4 Dome with Custom Beams

Calculate a larger V4 dome with thicker beams.

**Request:**
```bash
curl -X POST http://localhost:3000/api/dome/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "detail": 4,
    "partial": "7/12",
    "radius": 10,
    "connType": "GoodKarma",
    "beamsWidth": 200,
    "beamsThickness": 50
  }'
```

---

## Error Handling

### Invalid Parameters

**Status:** `400 Bad Request`

```json
{
  "error": "Invalid parameters",
  "messages": [
    "detail must be between 1 and 18",
    "radius must be greater than 0.1 meters"
  ]
}
```

### Server Error

**Status:** `500 Internal Server Error`

```json
{
  "error": "Internal server error",
  "message": "Error description (only in development mode)"
}
```

### Not Found

**Status:** `404 Not Found`

```json
{
  "error": "Not found",
  "path": "/api/invalid",
  "availableEndpoints": [
    "POST /api/dome/calculate",
    "GET /api/health",
    "GET /api/docs"
  ]
}
```

---

## Common Use Cases

### Calculate Material Requirements

Use the `beams` and `panels` response to determine material quantities:

```python
# Python example
total_beam_length = response['data']['beams']['totalLength']
total_beam_volume = response['data']['beams']['totalVolume']
number_of_beams = response['data']['beams']['count']

# If using wood beams with density 600 kg/m³
wood_density = 600  # kg/m³
total_beam_weight = total_beam_volume * wood_density
```

### Calculate Construction Budget

Use dimensions and counts to estimate costs:

```javascript
// JavaScript example
const beamCount = response.data.beams.count;
const panelCount = response.data.panels.count;
const connectorCount = response.data.connectors.count;

const beamCost = 50;  // per beam
const panelCost = 30; // per panel
const connectorCost = 25; // per connector

const totalCost =
  (beamCount * beamCost) +
  (panelCount * panelCost) +
  (connectorCount * connectorCost);
```

### Compare Different Configurations

```bash
# Compare V3 vs V4 domes
curl http://localhost:3000/api/dome/calculate -d '{"detail": 3, ...}'
curl http://localhost:3000/api/dome/calculate -d '{"detail": 4, ...}'
```

---

## Technical Details

### Architecture

The API is built on:
- **Framework:** Express.js 4.18
- **Language:** TypeScript 5.3
- **Core Engine:** ACIDOME Calculator (refactored from original acidome.js)
- **Database:** None (stateless calculations)

### Calculation Pipeline

1. **Input Validation** - Validate parameters
2. **Figure Creation** - Create base geometric figure (Icosahedron/Octohedron)
3. **Subdivision** - Subdivide by frequency using specified method
4. **Slicing** - Cut dome to specified fraction
5. **Product Creation** - Create beams, connectors, panels with specifications
6. **Metrics Calculation** - Calculate all geometric metrics
7. **Response Generation** - Format results for client

### Performance

- Single calculation: ~50-200ms depending on frequency
- Batch calculations: Linear scaling with number of items
- Memory: ~50-100MB for API server

---

## Development

### Running in Development Mode

```bash
npm run api:dev
```

This starts the API with auto-reload on file changes.

### Building for Production

```bash
npm run api:build
```

Compiles TypeScript to JavaScript in `dist/api/`

### Testing

```bash
npm run test
```

---

## Frontend Integration

### Vue 3 Example

```javascript
// src/api/client.ts
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export async function calculateDome(params) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/dome/calculate`,
      params
    )
    return response.data.data
  } catch (error) {
    console.error('Calculation error:', error)
    throw error
  }
}
```

```vue
<!-- src/components/DomeCalculator.vue -->
<template>
  <div class="calculator">
    <form @submit.prevent="calculateDome">
      <input v-model.number="params.detail" type="number" placeholder="Frequency" />
      <input v-model="params.partial" type="text" placeholder="Partial (e.g., 5/12)" />
      <input v-model.number="params.radius" type="number" placeholder="Radius (m)" />

      <button type="submit">Calculate</button>
    </form>

    <div v-if="results" class="results">
      <h2>Results</h2>
      <div class="geometry">
        <p>Vertices: {{ results.geometry.vertices }}</p>
        <p>Faces: {{ results.geometry.faces }}</p>
        <p>Edges: {{ results.geometry.edges }}</p>
      </div>
      <!-- ... more results ... -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { calculateDome } from '@/api/client'

const params = ref({
  detail: 3,
  partial: '5/12',
  radius: 5,
  connType: 'GoodKarma',
  beamsWidth: 160,
  beamsThickness: 40
})

const results = ref(null)

async function calculateDome() {
  results.value = await calculateDome(params.value)
}
</script>
```

---

## Future Enhancements

- [ ] Batch calculation endpoint
- [ ] Advanced parametrization (edge angles, vertex forces)
- [ ] 3D model export (OBJ, STL, GLTF)
- [ ] Bill of materials generation
- [ ] Cost estimation
- [ ] Constructor PDF generation
- [ ] Real-time visualization

---

## Support & Troubleshooting

### API won't start

1. Check Node.js version: `node --version` (requires 16+)
2. Install dependencies: `npm install`
3. Check port availability: Is 3000 already in use?
4. Run with verbose logging: `DEBUG=* npm run api`

### Calculations seem incorrect

1. Verify all input parameters are valid
2. Check parameter ranges in documentation
3. Compare results against original ACIDOME for validation

### Performance issues

1. Reduce batch calculation size
2. Check server logs for errors
3. Monitor memory usage

---

## License

ACIDOME © 2024. All rights reserved.

---

**Last Updated:** November 2024
**API Version:** 1.0.0
