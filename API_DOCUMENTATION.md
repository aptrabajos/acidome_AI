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

**`plots`** - Technical drawings (returned in main calculate endpoint)
- `beam` - Beam technical drawing with SVG and JSON
- `panel` - Triangular panel drawing with dimensions
- `connector` - Connector node drawing with convergence points
- `assembly` - Complete assembly overview

---

## Technical Drawing Endpoints

### GET `/api/plots/beam`

Generate technical drawing for a beam/strut.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `length` | number | 1717 | Beam length in mm |
| `width` | number | 160 | Beam width in mm |
| `thickness` | number | 40 | Beam thickness in mm |
| `scale` | number | 0.5 | Drawing scale factor |

#### Response

```json
{
  "success": true,
  "data": {
    "type": "beam",
    "title": "Beam/Strut 1717mm × 160mm × 40mm",
    "dimensions": {
      "width": 400,
      "height": 200,
      "padding": 20
    },
    "scale": 0.5,
    "elements": [
      {
        "type": "rect",
        "x": 20,
        "y": 20,
        "width": 343.4,
        "height": 32,
        "stroke": "black",
        "fill": "none",
        "strokeWidth": 2
      },
      {
        "type": "line",
        "x1": 20,
        "y1": 74,
        "x2": 363.4,
        "y2": 74,
        "stroke": "red",
        "strokeWidth": 1
      },
      {
        "type": "text",
        "x": 191.7,
        "y": 99,
        "text": "1717 mm",
        "stroke": "red"
      }
    ],
    "svg": "<svg width=\"400\" height=\"200\"...></svg>",
    "json": {
      "type": "beam",
      "length": 1717,
      "width": 160,
      "thickness": 40,
      "unit": "mm",
      "profile": "rectangular",
      "sections": [
        { "axis": "length", "value": 1717 },
        { "axis": "width", "value": 160 },
        { "axis": "thickness", "value": 40 }
      ]
    }
  }
}
```

---

### GET `/api/plots/panel`

Generate technical drawing for a triangular panel.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sideLength` | number | 1717 | Triangle side length in mm |
| `scale` | number | 0.5 | Drawing scale factor |

#### Response

```json
{
  "success": true,
  "data": {
    "type": "panel",
    "title": "Triangular Panel 1717mm",
    "dimensions": {
      "width": 400,
      "height": 350,
      "padding": 20
    },
    "scale": 0.5,
    "elements": [
      {
        "type": "polygon",
        "points": "191.7,20 20,321.1 363.4,321.1",
        "stroke": "black",
        "fill": "none",
        "strokeWidth": 2
      }
    ],
    "svg": "<svg width=\"400\" height=\"350\"...></svg>",
    "json": {
      "type": "triangle",
      "sideLength": 1717,
      "height": 1487,
      "area": 1276.1,
      "unit": "mm",
      "vertices": [
        { "x": 0, "y": 0 },
        { "x": 1717, "y": 0 },
        { "x": 858.5, "y": 1487 }
      ]
    }
  }
}
```

---

### GET `/api/plots/connector`

Generate technical drawing for a connector node.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | "GoodKarma" | Connector type (GoodKarma, Piped, Semicone, etc.) |
| `convergences` | number | 6 | Number of connection points |
| `scale` | number | 1 | Drawing scale factor |

#### Response

```json
{
  "success": true,
  "data": {
    "type": "connector",
    "title": "GoodKarma Connector - 6-way",
    "dimensions": {
      "width": 120,
      "height": 120,
      "padding": 20
    },
    "scale": 1,
    "elements": [
      {
        "type": "circle",
        "x": 80,
        "y": 80,
        "r": 30,
        "stroke": "black",
        "fill": "lightgray",
        "strokeWidth": 2
      },
      {
        "type": "circle",
        "x": 110,
        "y": 80,
        "r": 3,
        "stroke": "black",
        "fill": "black"
      },
      {
        "type": "line",
        "x1": 80,
        "y1": 80,
        "x2": 110,
        "y2": 80,
        "stroke": "gray",
        "strokeWidth": 1
      }
    ],
    "svg": "<svg width=\"120\" height=\"120\"...></svg>",
    "json": {
      "type": "connector",
      "connectorType": "GoodKarma",
      "convergences": 6,
      "angles": [0, 60, 120, 180, 240, 300]
    }
  }
}
```

---

### GET `/api/plots/assembly`

Generate complete assembly drawing showing all components.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `beams` | number | 129 | Number of beams |
| `panels` | number | 75 | Number of panels |
| `connectors` | number | 60 | Number of connectors |
| `scale` | number | 0.5 | Drawing scale factor |

#### Response

```json
{
  "success": true,
  "data": {
    "type": "assembly",
    "title": "Assembly Drawing",
    "dimensions": {
      "width": 630,
      "height": 530,
      "padding": 30
    },
    "scale": 0.5,
    "elements": [
      {
        "type": "text",
        "x": 30,
        "y": 15,
        "text": "Assembly Drawing (Beams: 129, Panels: 75, Connectors: 60)",
        "stroke": "black"
      }
    ],
    "svg": "<svg width=\"630\" height=\"530\"...></svg>",
    "json": {
      "type": "assembly",
      "components": {
        "beams": 129,
        "panels": 75,
        "connectors": 60
      },
      "layout": {
        "columns": 3,
        "rows": 3
      }
    }
  }
}
```

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

### Example 3: Get Beam Technical Drawing

Retrieve a technical drawing for a beam with custom dimensions.

**Request:**
```bash
curl http://localhost:3000/api/plots/beam?length=2000&width=200&thickness=50&scale=0.75
```

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "beam",
    "title": "Beam/Strut 2000mm × 200mm × 50mm",
    "svg": "<svg width=\"450\" height=\"250\" xmlns=\"http://www.w3.org/2000/svg\">...</svg>",
    "json": {
      "type": "beam",
      "length": 2000,
      "width": 200,
      "thickness": 50,
      "unit": "mm"
    }
  }
}
```

### Example 4: Get Panel Drawing with SVG Rendering

Retrieve a triangular panel drawing for rendering in web browser.

**Request:**
```bash
curl http://localhost:3000/api/plots/panel?sideLength=1500&scale=1
```

**Response (SVG string can be directly embedded in HTML):**
```json
{
  "success": true,
  "data": {
    "type": "panel",
    "title": "Triangular Panel 1500mm",
    "svg": "<svg width=\"400\" height=\"350\">...</svg>",
    "json": {
      "type": "triangle",
      "sideLength": 1500,
      "height": 1299,
      "area": 1120.5,
      "unit": "mm"
    }
  }
}
```

**HTML Usage:**
```html
<div id="panel-plot"></div>
<script>
fetch('http://localhost:3000/api/plots/panel?sideLength=1500')
  .then(res => res.json())
  .then(data => {
    document.getElementById('panel-plot').innerHTML = data.data.svg;
  })
</script>
```

### Example 5: Get Connector Drawing

Retrieve a connector node drawing with convergence points.

**Request:**
```bash
curl http://localhost:3000/api/plots/connector?type=Piped&convergences=5&scale=1.5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "connector",
    "title": "Piped Connector - 5-way",
    "svg": "<svg>...</svg>",
    "json": {
      "type": "connector",
      "connectorType": "Piped",
      "convergences": 5,
      "angles": [0, 72, 144, 216, 288]
    }
  }
}
```

### Example 6: Get Complete Assembly Drawing

Retrieve overview of all components for a dome configuration.

**Request:**
```bash
curl http://localhost:3000/api/plots/assembly?beams=150&panels=90&connectors=75&scale=0.4
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

### Rendering Technical Drawings (SVG Plots)

Once you have calculation results, the API provides plots as both SVG and JSON data. Here's how to display them:

```vue
<!-- src/components/DomePlots.vue -->
<template>
  <div class="plots-container">
    <div class="plot-section">
      <h3>Beam Technical Drawing</h3>
      <div class="plot" v-html="results.plots?.beam.svg"></div>
      <pre v-if="showJson">{{ results.plots?.beam.json }}</pre>
    </div>

    <div class="plot-section">
      <h3>Panel Technical Drawing</h3>
      <div class="plot" v-html="results.plots?.panel.svg"></div>
      <p>Panel height: {{ results.plots?.panel.json.height }} mm</p>
      <p>Panel area: {{ results.plots?.panel.json.area }} mm²</p>
    </div>

    <div class="plot-section">
      <h3>Connector Assembly</h3>
      <div class="plot" v-html="results.plots?.connector.svg"></div>
      <p>Type: {{ results.plots?.connector.json.connectorType }}</p>
      <p>Convergences: {{ results.plots?.connector.json.convergences }}</p>
    </div>

    <div class="plot-section">
      <h3>Assembly Overview</h3>
      <div class="plot" v-html="results.plots?.assembly.svg"></div>
    </div>

    <button @click="toggleJsonView">{{ showJson ? 'Hide' : 'Show' }} JSON Data</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  results: {
    type: Object,
    required: true
  }
})

const showJson = ref(false)

function toggleJsonView() {
  showJson.value = !showJson.value
}
</script>

<style scoped>
.plots-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 2rem;
}

.plot-section {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

.plot {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

svg {
  border: 1px solid #ccc;
  max-width: 100%;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.8rem;
  overflow-x: auto;
}
</style>
```

### Standalone Plot Endpoints

You can also fetch individual plots directly:

```javascript
// Fetch just the beam plot
async function fetchBeamPlot() {
  const response = await fetch(
    'http://localhost:3000/api/plots/beam?length=2000&width=200'
  );
  const data = await response.json();

  // Render SVG directly
  document.getElementById('beam-container').innerHTML = data.data.svg;

  // Use JSON data for further processing
  console.log('Beam dimensions:', data.data.json);
}

// Fetch panel plot with custom scale
async function fetchPanelPlot(sideLength) {
  const response = await fetch(
    `http://localhost:3000/api/plots/panel?sideLength=${sideLength}&scale=1.5`
  );
  const { data } = await response.json();

  return {
    svg: data.svg,
    height: data.json.height,
    area: data.json.area
  };
}
```

---

## Future Enhancements

- [x] Technical drawing endpoints (beam, panel, connector, assembly plots)
- [x] SVG + JSON plot output
- [x] Batch calculation endpoint
- [ ] Advanced parametrization (edge angles, vertex forces)
- [ ] 3D model export (OBJ, STL, GLTF)
- [ ] Bill of materials generation
- [ ] Cost estimation
- [ ] Constructor PDF generation
- [ ] Real-time visualization
- [ ] Interactive 3D viewer component

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
