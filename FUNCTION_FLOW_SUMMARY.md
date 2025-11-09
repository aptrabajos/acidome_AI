# ACIDOME Function Flow - Quick Summary

## Overview
ACIDOME is a geodesic dome calculator with both modern (Vue 3 + TypeScript) and legacy (Knockout.js) code. 
This document provides quick reference for the complete function call flows.

---

## FLOW 1: User Clicks "Calculate" Button

**File**: `/home/user/acidome_AI/src/App.vue` Line 119-125

**Complete Call Chain**:
```
User clicks button
    ↓
store.calculate()  [appStore.ts:108-124]
    ↓
createFigure(params)  [Figure.ts:412-421]
    ↓
new Icosahedron(params) OR new Octohedron(params)  [Figure.ts:300 or 370]
    ↓
initialize()  [Figure.ts:27-46]
    ├─→ createBaseVertices()  [Figure.ts:301-327 or 371-386]
    │   └─→ addVertex(position)  [Figure.ts:61-77]  (12 or 6 times)
    │
    ├─→ createBaseFaces()  [Figure.ts:329-363 or 388-406]
    │   └─→ 20 or 8 triangular faces created
    │
    ├─→ subdivide()  [Figure.ts:101-107]
    │   └─→ subdivideOnce()  [Figure.ts:112-152]  (detail-1 times)
    │       ├─→ Metrics.lerp(v1, v2, 0.5)  (per edge)
    │       ├─→ v.normalize()  (per midpoint)
    │       └─→ Create 4 new faces per original face
    │
    ├─→ scaleToRadius(radius)  [Figure.ts:157-162]
    │   └─→ v.scale(radius/length) per vertex
    │
    ├─→ createEdges()  [Figure.ts:167-187]
    │   └─→ Create edge objects from face vertices
    │
    ├─→ cutPartial()  [Figure.ts:201-227]  (if partial !== '1/1')
    │   └─→ Filter faces and vertices by cut height
    │
    └─→ alignBase()  [Figure.ts:232-243]  (if alignTheBase)
        └─→ Translate all vertices to Y=0 minimum
    ↓
getStats()  [Figure.ts:286-293]
    ↓
new Product(figure, params)  [Product.ts:27-33]
    ├─→ generateFromFigure()  [Product.ts:38-85]
    │   ├─→ For each face: calculatePolygonArea() + calculatePolygonPerimeter()
    │   ├─→ For each edge: Metrics.distance() + create Beam
    │   └─→ For each vertex: count connected edges + create Connector
    │
    └─→ calculateBudget()  [Product.ts:127-193]
        ├─→ Group beams by length
        ├─→ Create lineBudget with items
        ├─→ Create panelBudget
        └─→ Create connectorBudget
    ↓
store._reactive_update
    ├─→ currentFigure.value = figure
    ├─→ currentProduct.value = product
    └─→ isCalculating.value = false
    ↓
reportText.computed()  [appStore.ts:75-96]
    ├─→ getStats()
    └─→ exportBudget()
    ↓
Vue re-renders App.vue
    ├─→ Stats section shows reportText
    ├─→ Mode buttons enabled
    └─→ Calculate button re-enabled
```

**Key Parameters Passed**:
- FigureParams: base, detail, subdivClass, radius, partial, alignTheBase, etc.
- ProductParams: beamsWidth, beamsThickness, connectorType, radius

**Key Data Returned**:
- Figure: vertices[], faces[], edges[]
- Product: panels[], beams[], connectors[], budgets[]
- Report: Vertex count, Face count, Edge count, Surface area, Budget breakdown

---

## FLOW 2: User Changes "Level of Detail" Slider

**File**: `/home/user/acidome_AI/src/App.vue` Lines 45-55

**Simple Call Chain**:
```
User selects detail value
    ↓
v-model updates store.figureParams.detail
    ↓
subdivClassList.computed() recalculates  [appStore.ts:36-44]
    └─→ Show/hide subdivision class options if detail >= 2
    ↓
Vue re-renders dropdown
```

**NOTE**: Currently, changing detail does NOT automatically trigger calculation. 
Would need to manually call `store.calculate()` or add automatic debounced recalculation.

---

## FLOW 3: User Clicks "Rotate" Button (Legacy Code)

**File**: `/home/user/acidome_AI/index.html` Lines 667-681

**Call Chain**:
```
User clicks "Rotate" button
    ↓
Toggle form.strutViewBySide observable  [acidome.js:10214]
    └─→ form.strutViewBySide(! form.strutViewBySide())
    ↓
Subscribe handler fires  [acidome.js:10215]
    ↓
Knockout.js binding triggers
    ├─→ Canvas plot binding updates
    │   └─→ ko.bindingHandlers.plot  [acidome.js:9889-9902]
    │       └─→ _.defer(product.plot(canvas, options))
    │
    └─→ Button text toggles
        └─→ form.strutViewBySide() ? '⤴' : '⤵'
    ↓
product.plot(canvas, options)  [acidome.js:3469+ or 4545+ or 5517+]
    └─→ Draw 2D representation on canvas
        ├─→ If bySide=true: Side view
        └─→ If bySide=false: Front view
    ↓
Scroll position restored  [index.html:674-678]
```

---

## FLOW 4: User Changes Visualization Mode (Vue 3)

**File**: `/home/user/acidome_AI/src/App.vue` Lines 136-146

**Call Chain**:
```
User clicks mode button (base/carcass/schema/cover)
    ↓
@click="store.setViewerMode(mode)"
    ↓
setViewerMode(mode)  [appStore.ts:126-128]
    └─→ viewerMode.value = mode
    ↓
Vue re-renders
    ├─→ Mode button CSS class 'active' updates
    └─→ Button styling changes
```

**Legacy Integration** (if using old Knockout viewer):
```
    ↓
viewer.mode observable updates  [acidome.js:8600]
    ↓
viewer.mode.subscribe()  [acidome.js:8626]
    └─→ activeMode = viewer.mode()
    ↓
viewer.trigger('render')  [acidome.js:8649]
    ↓
viewer.drivers[activeMode]
    ├─→ viewer.drivers.base
    ├─→ viewer.drivers.carcass
    ├─→ viewer.drivers.schema
    ├─→ viewer.drivers.cover
    └─→ viewer.drivers.tent
    ↓
Three.js scene updates  [acidome.js:8723+]
    ├─→ Rebuild scene with mode-specific particles
    └─→ renderer.render(scene, camera)
```

---

## FLOW 5: Complete Legacy Calculation Pipeline

**Triggered by**: Form state change  [acidome.js:11283]

**Pipeline Execution** [acidome.js:11385-12194]:

```
onFormChange()
    ↓
calcProc.start(steps)
    ├─→ Step 1: reset  [11386-11393]
    │   └─→ Figure.__enum = 0
    │
    ├─→ Step 2: base figure  [11394-11411]
    │   └─→ new Figure["Icosahedron" | "Octohedron" | "TetrakisHexahedron" | "PentakisDodecahedron"]()
    │
    ├─→ Step 3: subdivision  [11412-11562]
    │   ├─→ figure.splitFaces(V)  [Chords]
    │   ├─→ figure.splitFaces_EA(V)  [Equal Arcs]
    │   ├─→ figure.splitFaces_EA_updateToMexican(V)  [Mexican]
    │   ├─→ figure.splitFaces_updateToClassII()
    │   └─→ figure.splitFaces_updateToClassIII(p,q)
    │
    ├─→ Step 4: primitive relations  [11563-11575]
    │   └─→ figure.relations()
    │
    ├─→ Step 5: transmutation figure to fulleren  [11577-11629]  (if fullerenType)
    │   ├─→ figure.fulleren()  [inscribed]
    │   └─→ figure.outerFulleren()  [circumscribed]
    │
    ├─→ Step 6: set items remove indexes  [11630-11641]
    │
    ├─→ Step 7: pre-slice  [11642-11920+]
    │   └─→ Complex cutting/door logic
    │
    ├─→ Step 8: tent net  [11920+]
    │
    ├─→ Step 9: finish figure  [12080-12104]
    │   └─→ form.resultFigure(figure)  [Line 12101]
    │
    ├─→ Step 10: plot product  [12106-12164]
    │   └─→ form.budgetList()  [Canvas visualizations]
    │
    ├─→ Step 11: render scene  [12166-12170]
    │   └─→ viewer.trigger('render', figure)
    │
    └─→ Step 12: push log  [12172+]
```

**Result Propagation**:
```
form.resultFigure(figure)
    ├─→ form.resultMeter.computed() recalculates
    │   └─→ Iterates figure.$primitives
    │       └─→ Builds meter with statistics
    │
    └─→ form.reportText.computed() recalculates
        └─→ meter.reportText()
            └─→ Text report displayed on page
```

---

## Key Files & Line Numbers

### Modern Vue 3 Code (Primary)
| File | Purpose | Key Lines |
|------|---------|-----------|
| App.vue | Main UI component | 119-125 (calc), 45-55 (detail), 136-146 (modes) |
| appStore.ts | Pinia state management | 108-124 (calculate), 75-96 (reportText) |
| Figure.ts | Geometry calculations | 27-46 (init), 101-107 (subdivide), 412-421 (factory) |
| Product.ts | Physical components | 27-33 (constructor), 38-85 (generateFromFigure) |
| Metrics.ts | Math utilities | 11+ (Vector3Class), ~static methods |

### Legacy Knockout.js Code (Secondary)
| File | Purpose | Key Lines |
|------|---------|-----------|
| index.html | HTML with bindings | 667-681 (rotate), 466-475 (detail) |
| acidome.js | All legacy logic | 11283+ (calc trigger), 8334+ (viewer) |

---

## Data Flow Overview

```
INPUT: FigureParams (form values)
    ↓
1. createFigure()
    ├─→ Create base polyhedron (12 or 6 vertices)
    ├─→ Subdivide to create faces (20*4^(detail-1) for Icosahedron)
    ├─→ Create edges from faces
    ├─→ Cut partial if needed
    ├─→ Align base if needed
    └─→ Calculate statistics
    ↓
2. new Product()
    ├─→ Create panels from faces
    ├─→ Create beams from edges
    ├─→ Create connectors from vertices
    └─→ Calculate budget (group beams by length)
    ↓
3. Store & Compute
    ├─→ Update figure and product state
    └─→ Generate report text
    ↓
4. Render
    ├─→ Vue component re-renders
    ├─→ Display stats, preview, mode buttons
    └─→ Optional Three.js 3D scene update
    ↓
OUTPUT: Complete dome specification with budget
```

---

## Complexity Notes

**Subdivision Growth**:
- Detail 1: 20 faces (Icosahedron) / 8 faces (Octohedron)
- Detail 2: 80 faces / 32 faces
- Detail 3: 320 faces / 128 faces
- Detail 4: 1,280 faces / 512 faces
- Detail 5: 5,120 faces / 2,048 faces

**Performance Optimizations**:
- Debounce form changes: 200ms (acidome.js:10045)
- Defer plot binding: Uses _.defer() (acidome.js:9900)
- Throttle viewer render: viewer.flash() (acidome.js:8639)
- Vertex deduplication: Using vectorToKey() (Figure.ts:93-96)
- Edge deduplication: Using createEdgeKey() (Figure.ts:192-196)

---

## Files Created (Analysis Documents)

1. **ACIDOME_FLOW_ANALYSIS.md** (22 KB)
   - Comprehensive flow documentation
   - All user interactions traced
   - Complete calculation pipeline
   - Data structures and formats
   - Error handling and state management

2. **ACIDOME_FUNCTION_SIGNATURES.md** (23 KB)
   - Detailed function signatures
   - All line numbers and file paths
   - Parameter and return types
   - Complete code snippets
   - Reference tables

3. **FUNCTION_FLOW_SUMMARY.md** (This file)
   - Quick reference guide
   - Visual ASCII call chains
   - Key findings and complexity notes
