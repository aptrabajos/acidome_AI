# ACIDOME Lines/Beams - Quick Reference Guide

## Critical Files

| File | Purpose | Key Components |
|------|---------|-----------------|
| `/src/acidome.js` | Original implementation (336KB) | Meter, Plotter, Product.Rib.Beam, all drawing logic |
| `/src/core/Product.ts` | TypeScript migration | Beam generation from edges, Budget calculation |
| `/src/types/product.ts` | Type definitions | Beam, Panel, Connector interfaces |
| `/src/core/Metrics.ts` | Math utilities | Vector3Class, distance calculations |
| `/src/core/Figure.ts` | Geometry builder | Vertices, Edges, Faces generation |

---

## Key Classes & Functions

### 1. **Meter Class** (Lines 6405-6539)
**Purpose:** Accumulates and formats measurements
```
- push(map, context) - Add measurements
- operators: {default, min, max, swing, range} - Aggregation types
- numberFormat(val) - Format numbers to decimals
```

### 2. **Product.Rib.Beam** (Lines 5300-5707)
**Purpose:** Defines beam properties and measurements
```
Key Methods:
- getTails() - Calculate endpoints with bevels
- unify() - Categorize beam configuration
- maxLength() / minLength() - Calculate lengths
- meter() - Generate measurements report
- materialName() - Format "Beams XxYmm"
```

### 3. **Plotter Base Class** (Lines 5713-6100+)
**Purpose:** Canvas 2D drawing engine
```
Key Methods:
- line(p1, p2, style) - Draw line segment
- textByLine(text, A, B, opts) - Label along line
- circle(pos, r, style) - Draw circle (vertex)
- text(pos, text, opts) - Draw text at position
- _plane(p, offset) - Convert data→canvas coordinates
```

### 4. **Plotter.Beam** (Lines 6162-6298)
**Purpose:** Technical drawing for beam cross-sections
```
Key Methods:
- start(product, tail) - Initialize drawing
- tail(tail, turnMe, whichSide, product) - Draw endpoint with angles
- end() - Complete drawing
```

### 5. **Plotter.Triangle** (Lines 6304-6395)
**Purpose:** Technical drawing for faces/panels
```
Key Methods:
- triangle() - Draw edges with measurements
- vertexes() - Label vertices
```

---

## Data Flow

```
Figure (Geometry)
    ↓ (edges)
Product.Rib.Beam (Define properties)
    ├── getTails() → Bevel calculations
    ├── unify() → Configuration categorization
    ├── maxLength()/minLength() → Length ranges
    └── meter() → Measurements collection
        ↓
    Meter (Accumulate & format)
        ↓
    Technical Drawing (Canvas)
        ├── Plotter.line() → Beam edges
        ├── Plotter.textByLine() → Dimension labels
        └── Plotter.vertexLabel() → Vertex markings
```

---

## Essential Measurements

### Beam Properties
- **length**: Distance between vertices
- **width**: Beam width (mm, parallel to radius)
- **thickness**: Beam height (mm, perpendicular to radius)
- **midLength**: Center section length
- **maxLength**: With extended bevel lengths
- **minLength**: Shortest possible length

### Bevel Properties
- **bevelInner**: Inner cutting angle
- **bevelSides[0]**: Left side bevel
- **bevelSides[1]**: Right side bevel
- **bevelZero**: No bevels present
- **bevelStraight**: Side bevels cancel
- **bevelsEquals**: Left == Right

### Output Measurements
- Total beam length (m)
- Total volume (m³)
- Beam length range (mm)
- Angle between faces (degrees)
- Base area (m²)
- Material designation: "Beams XxYmm"

---

## Drawing Annotations

### Labels on Beam Drawing
1. **Bevel angles** (degrees): "∟15.2°"
2. **Length segments** (mm): "450"
3. **Vertex index**: "V0", "V1", etc.
4. **Rib counts**: Number of connected beams

### Labels on Face Drawing
1. **Edge index**: Letters (A, B, C, ...)
2. **Edge length**: Divided into segments
3. **Dihedral angle**: Face-to-face angle
4. **Vertex indices**: Marked with circles

---

## Indexing System

### Beam/Line Indices
```
0-25:  A, B, C, ..., Z
26-51: AA, AB, AC, ..., AZ
52-77: BA, BB, BC, ..., BZ
```

Function: `Product.index(type, order)` (Lines 3479-3484)

### Vertex Indices
```
0, 1, 2, ..., N
```

---

## Precision Constants

| Constant | Value | Use |
|----------|-------|-----|
| `LENGTH_PRECISION` | 0.001 | Round to 1mm |
| `ANGLE_PRECISION` | 0.1 | Round to 0.1° |
| `epsilon` | 1e-6 | Floating point comparison |

---

## Common Operations

### Extract Beam Properties
```javascript
// From edge
const length = Metrics.distance(edge.vertexA, edge.vertexB);
const beam = {
    start: edge.vertexA,
    end: edge.vertexB,
    length: length,
    width: params.beamsWidth,
    thickness: params.beamsThickness
};
```

### Calculate Measurements
```javascript
const material = 'Beams ' + width + 'x' + thickness + 'mm';
const totalLength = beam.maxLength() * R;
const volume = beam.midLength * beam.width * beam.thickness * R³;
const range = Product.lengthUnify(totalLength);  // In mm
```

### Draw on Canvas
```javascript
const plotter = new Plotter(canvas, {
    width: beamLength,
    height: beamWidth,
    margin: 20,
    R: radius
});

plotter.line({x: 0, y: 0}, {x: 100, y: 50}, 'solid');
plotter.textByLine('450mm', {x: 0, y: 0}, {x: 100, y: 50}, {q: 0.5});
plotter.vertexLabel(0, {x: 0, y: 0}, ribs);
```

---

## TypeScript Migration Status

### Implemented ✓
- Beam interface definition
- Edge extraction from Figure
- Beam array generation
- Basic length calculation
- Connector generation

### To Implement
- Tail calculations and bevels
- Comprehensive meter() function
- Canvas drawing (Plotter)
- Triangle/Face drawing
- Material naming and budget

---

## File Locations Reference

**Meter Class:**
`/home/user/acidome_AI/src/acidome.js:6405-6539`

**Product.Rib.Beam:**
`/home/user/acidome_AI/src/acidome.js:5300-5707`

**Plotter Base:**
`/home/user/acidome_AI/src/acidome.js:5713-6100+`

**Plotter.Beam:**
`/home/user/acidome_AI/src/acidome.js:6162-6298`

**Product.ts (Migration):**
`/home/user/acidome_AI/src/core/Product.ts`

**Types:**
`/home/user/acidome_AI/src/types/product.ts`

