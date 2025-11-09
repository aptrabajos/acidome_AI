# ACIDOME Frontend - Setup & Usage Guide

Complete guide for using the Vue 3 frontend with the Express REST API.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the API Server (Terminal 1)

```bash
npm run api
```

You should see output like:
```
═══════════════════════════════════════════════════════════
ACIDOME REST API Server started
═══════════════════════════════════════════════════════════

Endpoints:
  POST  http://localhost:3000/api/dome/calculate
  POST  http://localhost:3000/api/dome/batch
  GET   http://localhost:3000/api/plots/beam
  GET   http://localhost:3000/api/plots/panel
  GET   http://localhost:3000/api/plots/connector
  GET   http://localhost:3000/api/plots/assembly
  GET   http://localhost:3000/api/health
  GET   http://localhost:3000/api/docs
```

### 3. Start the Frontend (Terminal 2)

```bash
npm run dev
```

The development server will start at `http://localhost:5173`

Open your browser and navigate to the application.

## Frontend Components

### DomeCalculator.vue

Main component that contains the calculation form.

**Features:**
- Form with all dome calculation parameters
- Frequency (V1-V18) selector
- Partial dome options (1/8 to full sphere)
- Radius input (meters)
- Connector type selection (GoodKarma, Piped, Semicone, etc.)
- Beam dimension inputs (width, thickness in mm)
- Real-time validation
- Loading spinner during calculation
- Error message display
- Reset button

**Usage:**
```vue
<DomeCalculator />
```

### DomeResults.vue

Displays calculation results in a card-based layout.

**Displays:**
- **Geometry**: Vertices, faces, edges counts
- **Dimensions**: Height, base radius, areas
- **Beams**: Length, count, total volume, dihedral angle
- **Panels**: Count, side length, height, areas
- **Connectors**: Count, type, convergence count
- **Material Estimation**: Weight calculations, panel counts

**Usage:**
```vue
<DomeResults :results="results" />
```

### DomePlots.vue

Renders technical drawings as SVG with JSON data.

**Features:**
- Beam technical drawing (rectangular cross-section)
- Panel drawing (triangular with dimensions)
- Connector node drawing (radial convergence points)
- Assembly overview (component distribution)
- Toggle JSON data visualization
- SVG export/download for each drawing

**Usage:**
```vue
<DomePlots :results="results" />
```

## API Client

Located at `src/api/client.ts`, provides functions to call all REST endpoints.

### Available Functions

```typescript
// Main calculation
await calculateDome(params: DomeParams)

// Health and info
await getHealth()
await getApiDocs()

// Individual plots
await getBeamPlot(length, width, thickness, scale)
await getPanelPlot(sideLength, scale)
await getConnectorPlot(type, convergences, scale)
await getAssemblyPlot(beams, panels, connectors, scale)
```

## Configuration

### API URL

The API URL is configured via environment variables:

**Development (.env or .env.development):**
```
VITE_API_URL=http://localhost:3000/api
```

**Production (.env.production):**
```
VITE_API_URL=https://api.acidome.example.com/api
```

Create a `.env.local` file to override defaults:
```bash
VITE_API_URL=http://192.168.1.100:3000/api
```

## Workflow

### Typical User Flow

1. **User opens application** → DomeCalculator form appears
2. **User fills parameters** → Form validates in real-time
3. **User clicks "Calculate"** → Request sent to API via client.ts
4. **API processes request** → Calculates geometry and plots
5. **Frontend receives response** → DomeResults and DomePlots render
6. **User views results** → Can toggle JSON, download SVGs

### Example Calculation

```
Frequency: 3 (V3)
Partial: 5/12
Radius: 5 meters
Connector: GoodKarma
Beam Width: 160 mm
Beam Thickness: 40 mm

↓ (Calculate button)

Response includes:
- Geometry: 60 vertices, 75 faces, 129 edges
- Dimensions: 3.83m height, 4.47m base radius
- Beams: 1717mm × 160mm × 40mm, 129 total
- Panels: 75 triangular panels
- Plots: SVG drawings + JSON data
```

## Development

### Component Structure

```
src/
├── api/
│   ├── client.ts           # HTTP client functions
│   ├── calculator.ts       # Backend calculator
│   ├── plots.ts            # SVG generation
│   └── server.ts           # Express server
├── components/
│   ├── DomeCalculator.vue  # Main form
│   ├── DomeResults.vue     # Results display
│   └── DomePlots.vue       # Technical drawings
└── App.vue                 # Root component
```

### Styling

Components use scoped CSS with variables:

```scss
// Colors
$primary: #0066cc
$background: #f5f5f5
$border: #ddd

// Spacing
$gap: 1.5rem
$padding: 1rem
```

### Build

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

## Troubleshooting

### "API Connection Failed"

**Problem:** Frontend can't connect to API server.

**Solution:**
1. Ensure API is running: `npm run api`
2. Check API is on port 3000: `curl http://localhost:3000/api/health`
3. Check VITE_API_URL in environment
4. Check browser console for CORS errors

### "Invalid parameters" Error

**Problem:** API returns 400 Bad Request.

**Solution:**
1. Check parameter ranges:
   - detail: 1-18
   - radius: > 0.1
   - beamsWidth: ≥ 10 mm
   - beamsThickness: ≥ 5 mm
2. Check connector type is valid
3. Try with default values

### SVG Not Rendering

**Problem:** Technical drawings don't display.

**Solution:**
1. Check network request in DevTools
2. Verify SVG data in response
3. Check browser console for errors
4. Clear browser cache

### Performance Issues

**Problem:** Slow calculations or UI lag.

**Solution:**
1. Lower detail frequency (use V3 instead of V5)
2. Close other browser tabs
3. Check server logs: `npm run api` (shows calculation times)
4. Try smaller radius values

## Advanced Usage

### Custom Calculations

You can call the API directly with custom parameters:

```javascript
const result = await calculateDome({
  detail: 4,
  partial: '7/12',
  radius: 10,
  connType: 'Piped',
  beamsWidth: 200,
  beamsThickness: 50
})
```

### Batch Processing

Calculate multiple domes:

```javascript
const domes = [
  { detail: 3, radius: 5, ... },
  { detail: 3, radius: 7, ... },
  { detail: 4, radius: 10, ... }
]

const response = await fetch('http://localhost:3000/api/dome/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ domes })
})
```

### Direct Plot Access

Get plots without full calculation:

```javascript
const beamPlot = await getBeamPlot(2000, 200, 50, 1.5)
document.getElementById('plot').innerHTML = beamPlot.data.svg
```

### Exporting Results

The plots are already exportable from the UI. For programmatic export:

```javascript
function downloadSvg(svgString, filename) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// Usage
downloadSvg(results.plots.beam.svg, 'beam.svg')
```

## Next Steps

- [ ] Add 3D visualization (Three.js)
- [ ] Add export to PDF/DXF
- [ ] Add calculation history
- [ ] Add saved configurations
- [ ] Add comparison mode (side-by-side)
- [ ] Add dark mode
- [ ] Add internationalization
- [ ] Add user authentication (if needed)

## Support

For issues or questions:
1. Check API_DOCUMENTATION.md for API reference
2. Check browser DevTools → Network tab for HTTP requests
3. Check server logs: `npm run api`
4. Check component console output

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-09
