# ACIDOME Function Signatures & Line Numbers

## Vue 3 Component & Store (Modern Code)

### File: `/home/user/acidome_AI/src/App.vue`
```vue
<!-- Calculate Button Entry Point -->
Line 119-125: <button @click="store.calculate" ... >

<!-- Level of Detail Slider -->
Line 45-55: <select v-model.number="store.figureParams.detail" @change="onParamChange">

<!-- Mode Selector Buttons -->
Line 136-146: <button @click="store.setViewerMode(mode)" ... >

<!-- Form Input Fields -->
Line 37-43: base polyhedron select
Line 73-81: radius input
Line 85-95: partial sphere select
Line 97-105: beam width input
Line 107-115: beam thickness input

<!-- Results Display -->
Line 148-153: canvas preview
Line 159: {{ store.reportText }}

<!-- Component Methods -->
Line 183-186: onParamChange()
Line 188-192: onMounted() - Calls store.calculate() on mount
```

### File: `/home/user/acidome_AI/src/ui/store/appStore.ts`
```typescript
Line 13: useAppStore = defineStore('app', () => {

Line 15: figureParams = ref<FigureParams>({ ...CONFIG.defaultFigure })
Line 16-22: productParams = ref<ProductParams>({...})
Line 24: viewerMode = ref<string>('carcass')
Line 25: language = ref<string>('en')
Line 26: isCalculating = ref(false)
Line 27: error = ref<string | null>(null)
Line 30: currentFigure = ref<any>(null)
Line 31: currentProduct = ref<any>(null)

Line 34: detailList = computed(() => DETAIL_LIST)

Line 36-44: subdivClassList = computed(() => {
  return figureParams.value.detail >= 2 ? [...] : []
})

Line 46-55: subdivMethodList = computed(() => {...})

Line 57-66: partialList = computed(() => [...])

Line 68-73: geometryStats = computed(() => {
  if (!currentFigure.value) return {...}
  return currentFigure.value.getStats()
})

Line 75-96: reportText = computed(() => {
  if (!currentFigure.value || !currentProduct.value) return '...'
  const stats = geometryStats.value
  const budgets = currentProduct.value.exportBudget()
  return formatted_report
})

Line 99-102: updateFigureParam(key, value)
  - Modifies: figureParams.value[key]
  - Sync: productParams.value.radius = figureParams.value.radius

Line 104-106: updateProductParam(key, value)
  - Modifies: productParams.value[key]

Line 108-124: calculate = async () => {
  isCalculating.value = true
  error.value = null
  try:
    currentFigure.value = createFigure(figureParams.value)  // Line 114
    currentProduct.value = new Product(currentFigure.value, productParams.value)  // Line 117
  catch: error.value = err.message
  finally: isCalculating.value = false
}

Line 126-128: setViewerMode(mode: string) => {
  viewerMode.value = mode
}

Line 130-132: setLanguage(lang: string) => {
  language.value = lang
}
```

---

## Core Geometry (Modern TypeScript)

### File: `/home/user/acidome_AI/src/core/Figure.ts`

#### Abstract Base Class
```typescript
Line 12-18: export abstract class Figure {
  params: FigureParams
  vertices: Vertex[] = []
  faces: Face[] = []
  edges: Edge[] = []
  private vertexMap: Map<string, number>
}

Line 19-22: constructor(params: FigureParams) {
  this.params = params
  this.initialize()
}

Line 27-46: protected initialize(): void {
  this.vertices = []
  this.faces = []
  this.edges = []
  this.vertexMap.clear()
  
  this.createBaseVertices()          // Line 33
  this.createBaseFaces()             // Line 34
  this.subdivide()                   // Line 35
  this.scaleToRadius(params.radius)  // Line 36
  this.createEdges()                 // Line 37
  
  if (params.partial !== '1/1') {
    this.cutPartial()                // Line 40
  }
  
  if (params.alignTheBase) {
    this.alignBase()                 // Line 44
  }
}

Line 51: abstract createBaseVertices(): void
Line 56: abstract createBaseFaces(): void

Line 61-77: protected addVertex(position: Vector3Class, index?: number): number {
  const key = this.vectorToKey(position)
  
  if (this.vertexMap.has(key)) {
    return this.vertexMap.get(key)!
  }
  
  const vertexIndex = this.vertices.length
  this.vertices.push({
    position: position.clone(),
    index: vertexIndex,
    connections: []
  })
  
  this.vertexMap.set(key, vertexIndex)
  return vertexIndex
}

Line 82-88: protected getVertexIndex(position: Vector3Class): number {
  const key = this.vectorToKey(position)
  if (this.vertexMap.has(key)) {
    return this.vertexMap.get(key)!
  }
  return this.addVertex(position)
}

Line 93-96: private vectorToKey(v: Vector3Class, precision: number = 10): string {
  const p = Math.pow(10, precision)
  return `${Math.round(v.x * p)},${Math.round(v.y * p)},${Math.round(v.z * p)}`
}

Line 101-107: private subdivide(): void {
  const detail = this.params.detail
  
  for (let level = 1; level < detail; level++) {
    this.subdivideOnce()
  }
}

Line 112-152: private subdivideOnce(): void {
  const newFaces: Face[] = []
  const newVertexMap = new Map<string, Vector3Class>()

  for (const face of this.faces) {
    const faceVertices = face.vertices.map(v => new Vector3Class().copy(v))

    // Find or create midpoint vertices
    const midpoints: Vector3Class[] = []
    for (let i = 0; i < faceVertices.length; i++) {
      const v1 = faceVertices[i]
      const v2 = faceVertices[(i + 1) % faceVertices.length]
      const mid = Metrics.lerp(v1, v2, 0.5)  // Line 124
      mid.normalize()                         // Line 125
      midpoints.push(mid)
    }

    // Create 4 new triangular faces from each original triangle
    for (let i = 0; i < faceVertices.length; i++) {
      const v0 = faceVertices[i]
      const m0 = midpoints[i]
      const m1 = midpoints[(i - 1 + faceVertices.length) % faceVertices.length]

      // Corner triangle
      newFaces.push({
        vertices: [v0, m0, m1],
        color: face.color
      })
    }

    // Center triangle (for triangular faces)
    if (faceVertices.length === 3) {
      newFaces.push({
        vertices: [midpoints[0], midpoints[1], midpoints[2]],
        color: face.color
      })
    }
  }

  this.faces = newFaces
}

Line 157-162: private scaleToRadius(radius: number): void {
  for (const vertex of this.vertices) {
    const length = vertex.position.length()
    vertex.position.scale(radius / length)
  }
}

Line 167-187: private createEdges(): void {
  const edgeSet = new Set<string>()

  for (const face of this.faces) {
    const vertices = face.vertices
    for (let i = 0; i < vertices.length; i++) {
      const v1 = vertices[i]
      const v2 = vertices[(i + 1) % vertices.length]

      const key = this.createEdgeKey(v1, v2)
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        this.edges.push({
          vertexA: v1,
          vertexB: v2,
          color: '#999'
        })
      }
    }
  }
}

Line 192-196: private createEdgeKey(v1: Vector3Class, v2: Vector3Class): string {
  const k1 = this.vectorToKey(v1 as Vector3Class)
  const k2 = this.vectorToKey(v2 as Vector3Class)
  return k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`
}

Line 201-227: private cutPartial(): void {
  let cutHeight: number

  if (this.params.partialMode === 'faces') {
    // Parse 'X/Y' format
    const match = this.params.partial.match(/(\d+)\/(\d+)/)
    if (match) {
      const numerator = parseInt(match[1])
      const denominator = parseInt(match[2])
      cutHeight = -1 + (2 * numerator) / denominator
    } else {
      cutHeight = 0
    }
  } else {
    cutHeight = this.params.partialHeight || 0.777
  }

  // Remove vertices and faces above/below the cutting plane
  this.faces = this.faces.filter(face => {
    return face.vertices.every(v => v.y >= cutHeight * this.params.radius)
  })

  this.vertices = this.vertices.filter(v => {
    return v.position.y >= cutHeight * this.params.radius
  })
}

Line 232-243: private alignBase(): void {
  // Find lowest Y coordinate
  let minY = Infinity
  for (const vertex of this.vertices) {
    minY = Math.min(minY, vertex.position.y)
  }

  // Translate all vertices so minimum Y is at 0
  for (const vertex of this.vertices) {
    vertex.position.y -= minY
  }
}

Line 248-250: getVertexCount(): number {
  return this.vertices.length
}

Line 255-257: getFaceCount(): number {
  return this.faces.length
}

Line 262-264: getEdgeCount(): number {
  return this.edges.length
}

Line 269-281: calculateSurfaceArea(): number {
  let area = 0
  for (const face of this.faces) {
    if (face.vertices.length === 3) {
      const [v0, v1, v2] = face.vertices as [Vector3Class, Vector3Class, Vector3Class]
      const a = Metrics.distance(v0, v1)
      const b = Metrics.distance(v1, v2)
      const c = Metrics.distance(v2, v0)
      area += Metrics.triangleHeronArea(a, b, c)
    }
  }
  return area
}

Line 286-293: getStats(): GeometryStats {
  return {
    vertexCount: this.getVertexCount(),
    faceCount: this.getFaceCount(),
    edgeCount: this.getEdgeCount(),
    surfaceArea: this.calculateSurfaceArea()
  }
}
```

#### Icosahedron Class
```typescript
Line 300: export class Icosahedron extends Figure {

Line 301-327: protected createBaseVertices(): void {
  const phi = (1 + Math.sqrt(5)) / 2
  const vertices = [
    [-1, phi, 0],      // Line 306
    [1, phi, 0],
    [-1, -phi, 0],
    [1, -phi, 0],
    [0, -1, phi],
    [0, 1, phi],
    [0, -1, -phi],
    [0, 1, -phi],
    [phi, 0, -1],
    [phi, 0, 1],
    [-phi, 0, -1],
    [-phi, 0, 1]        // Line 319
  ]

  for (const [x, y, z] of vertices) {
    const v = new Vector3Class(x, y, z)
    v.normalize()
    this.addVertex(v)
  }
}

Line 329-363: protected createBaseFaces(): void {
  const faceIndices = [
    [0, 11, 5],  // ... 20 triangular faces
  ]

  for (const indices of faceIndices) {
    this.faces.push({
      vertices: indices.map(i => this.vertices[i].position)
    })
  }
}
```

#### Octohedron Class
```typescript
Line 370: export class Octohedron extends Figure {

Line 371-386: protected createBaseVertices(): void {
  const vertices = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1]
  ]
  // Same as Icosahedron - normalize and add vertices
}

Line 388-406: protected createBaseFaces(): void {
  const faceIndices = [
    [0, 2, 4],  // ... 8 triangular faces
  ]
  // Same as Icosahedron
}
```

#### Factory Function
```typescript
Line 412-421: export function createFigure(params: FigureParams): Figure {
  switch (params.base) {
    case 'Icosahedron':
      return new Icosahedron(params)
    case 'Octohedron':
      return new Octohedron(params)
    default:
      throw new Error(`Unknown base polyhedron: ${params.base}`)
  }
}
```

---

### File: `/home/user/acidome_AI/src/core/Product.ts`

```typescript
Line 19: export class Product {
  params: ProductParams
  figure: Figure
  panels: Panel[] = []
  beams: Beam[] = []
  connectors: Connector[] = []
  budgets: Budget[] = []

Line 27-33: constructor(figure: Figure, params: ProductParams) {
  this.figure = figure
  this.params = params

  this.generateFromFigure()
  this.calculateBudget()
}

Line 38-85: private generateFromFigure(): void {
  this.panels = []
  this.beams = []
  this.connectors = []

  // Create panels from faces (Line 44-52)
  for (const face of this.figure.faces) {
    const panel: Panel = {
      vertices: face.vertices,
      area: this.calculatePolygonArea(face.vertices),
      perimeter: this.calculatePolygonPerimeter(face.vertices),
      color: face.color || '#cccccc'
    }
    this.panels.push(panel)
  }

  // Create beams from edges (Line 55-66)
  for (const edge of this.figure.edges) {
    const length = Metrics.distance(edge.vertexA, edge.vertexB)
    const beam: Beam = {
      start: edge.vertexA as Vector3Class,
      end: edge.vertexB as Vector3Class,
      length,
      width: this.params.beamsWidth,
      thickness: this.params.beamsThickness,
      color: edge.color || '#999999'
    }
    this.beams.push(beam)
  }

  // Create connectors from vertices (Line 69-84)
  for (let i = 0; i < this.figure.vertices.length; i++) {
    const vertex = this.figure.vertices[i]
    const degree = this.figure.edges.filter(
      e =>
        Metrics.distance(e.vertexA, vertex.position) < 0.01 ||
        Metrics.distance(e.vertexB, vertex.position) < 0.01
    ).length

    const connector: Connector = {
      position: vertex.position,
      type: this.params.connectorType,
      degree,
      color: '#ff6600'
    }
    this.connectors.push(connector)
  }
}

Line 90-109: private calculatePolygonArea(vertices: any[]): number {
  if (vertices.length < 3) return 0

  let area = 0
  for (let i = 0; i < vertices.length; i++) {
    const v0 = vertices[i]
    const v1 = vertices[(i + 1) % vertices.length]
    const v2 = vertices[(i + 2) % vertices.length]

    if (vertices.length === 3) {
      const a = Metrics.distance(v0, v1)
      const b = Metrics.distance(v1, v2)
      const c = Metrics.distance(v2, v0)
      area = Metrics.triangleHeronArea(a, b, c)
      break
    }
  }

  return area
}

Line 114-122: private calculatePolygonPerimeter(vertices: any[]): number {
  let perimeter = 0
  for (let i = 0; i < vertices.length; i++) {
    const v1 = vertices[i]
    const v2 = vertices[(i + 1) % vertices.length]
    perimeter += Metrics.distance(v1, v2)
  }
  return perimeter
}

Line 127-193: private calculateBudget(): void {
  this.budgets = []

  // Beams/Lines budget (Line 131-164)
  const lineBudget: Budget = {
    type: 'line',
    items: [],
    totalQuantity: 0,
    totalLength: 0
  }

  const beamLengths: Map<string, Beam[]> = new Map()
  for (const beam of this.beams) {
    const roundedLength = (Math.round(beam.length * 100) / 100).toFixed(2)
    const key = `${roundedLength}m`

    if (!beamLengths.has(key)) {
      beamLengths.set(key, [])
    }
    beamLengths.get(key)!.push(beam)
  }

  for (const [size, beams] of beamLengths.entries()) {
    const beamLength = parseFloat(size)
    const item: BudgetItem = {
      size,
      quantity: beams.length,
      unitLength: beamLength,
      totalLength: beamLength * beams.length
    }
    lineBudget.items.push(item)
    lineBudget.totalQuantity += beams.length
    lineBudget.totalLength! += item.totalLength!
  }

  this.budgets.push(lineBudget)

  // Panels budget (Line 167-178)
  const panelBudget: Budget = {
    type: 'panel',
    items: [
      {
        size: 'panels',
        quantity: this.panels.length,
        unitLength: 0
      }
    ],
    totalQuantity: this.panels.length
  }
  this.budgets.push(panelBudget)

  // Connectors budget (Line 181-193)
  const connectorBudget: Budget = {
    type: 'connector',
    items: [
      {
        size: 'connectors',
        quantity: this.connectors.length,
        unitLength: 0
      }
    ],
    totalQuantity: this.connectors.length
  }
  this.budgets.push(connectorBudget)
}

Line 198-200: getPanelCount(): number {
  return this.panels.length
}

Line 205-207: getBeamCount(): number {
  return this.beams.length
}

Line 212-214: getConnectorCount(): number {
  return this.connectors.length
}

Line 219-221: getTotalBeamLength(): number {
  return this.beams.reduce((sum, beam) => sum + beam.length, 0)
}

Line 226-228: exportBudget(): Budget[] {
  return this.budgets
}

Line 233-257: exportOBJ(): string {
  let obj = '# Acidome - Geodesic Dome\n'
  obj += `# Vertices: ${this.figure.vertices.length}\n`
  obj += `# Faces: ${this.figure.faces.length}\n\n`

  // Vertices section
  for (const vertex of this.figure.vertices) {
    obj += `v ${vertex.position.x} ${vertex.position.y} ${vertex.position.z}\n`
  }

  // Faces section
  for (const face of this.figure.faces) {
    const indices = face.vertices
      .map((v, i) => {
        const vertex = this.figure.vertices.find(
          vv => Metrics.distance(vv.position, v) < 0.0001
        )
        return (vertex!.index! + 1).toString()
      })
      .join(' ')
    obj += `f ${indices}\n`
  }

  return obj
}
```

---

### File: `/home/user/acidome_AI/src/core/Metrics.ts`

```typescript
Line 11: export class Vector3Class implements Vector3 {
  x: number
  y: number
  z: number

Line 16-20: constructor(x: number = 0, y: number = 0, z: number = 0) {
  this.x = isNaN(x) ? 0 : Number(x)
  this.y = isNaN(y) ? 0 : Number(y)
  this.z = isNaN(z) ? 0 : Number(z)
}

Line 25-27: clone(): Vector3Class {
  return new Vector3Class(this.x, this.y, this.z)
}

Line 32-37: copy(v: Vector3): this {
  this.x = v.x
  this.y = v.y
  this.z = v.z
  return this
}

Line 42-48: equals(v: Vector3, epsilon: number = 0.000001): boolean {
  return (
    Math.abs(this.x - v.x) +
    Math.abs(this.y - v.y) +
    Math.abs(this.z - v.z) < epsilon
  )
}

Line 53-58: add(v: Vector3): this {
  this.x += v.x
  this.y += v.y
  this.z += v.z
  return this
}

Line 63-68: subtract(v: Vector3): this {
  this.x -= v.x
  this.y -= v.y
  this.z -= v.z
  return this
}

Line 73-78: scale(scalar: number): this {
  this.x *= scalar
  this.y *= scalar
  this.z *= scalar
  return this
}

Line 83-85: length(): number {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
}

Line 90-92: lengthSq(): number {
  return this.x * this.x + this.y * this.y + this.z * this.z
}

Line 97-99: isZero(epsilon: number = 1e-20): boolean {
  return this.lengthSq() < epsilon
}
```

---

## HTML/Legacy Code (Knockout.js)

### File: `/home/user/acidome_AI/index.html`

```html
Line 13: <div class="geodesic">

Line 15: <canvas class="preview"></canvas>

Line 37-44: <select id="lang-select" ... data-bind="
  options: i18n.langOptions(),
  optionsValue: 'id',
  optionsText: 'name',
  value: i18n.lang,
  ...
"></select>

Line 321: <form class="options transparent slow-toggle-visibility" ...>

Line 466-475: Level of detail select:
<dt>Level of detail, V</dt>
<select data-bind="
  options: detailList,
  value: detail
"></select>

Line 667-681: Rotate button:
<button class="rotate" data-bind="
  click: function(vm, event) {
    form.strutViewBySide(! form.strutViewBySide())
    // scroll restoration
  },
  text: form.strutViewBySide() ? '⤴' : '⤵'
"></button>

Line 684-688: Canvas for line visualization:
<canvas data-bind="
  attr: $parent.canvasAttr,
  plot: product,
  visible: ! form.strutViewBySide()
"></canvas>

Line 303: Buy button:
<button data-bind="text: 'buyme:Buy it', click: submit, attr: { disabled: pending }"></button>
```

---

## Legacy acidome.js Key Functions

### Initialization & Form Setup
```javascript
Line 9873-11220: var form = (function() { ... })()
  Creates global form object with FigureOptionsVM

Line 9909-9911: const form = new FigureOptionsVM(function(state){
  form.trigger('change', state);
})

Line 10214: form.strutViewBySide = ko.observable(...)
  Beam view mode toggle

Line 10215: form.strutViewBySide.subscribe(function(bySide) {...})
  Handler for view mode change
```

### Form State Change Handler
```javascript
Line 11225-11248: form.on('change', function(state) {
  Update URL fragment based on form state
})

Line 11283: form.on('change', onFormChange)
  Main calculation trigger

Line 11294-12194: function onFormChange() {
  Main calculation pipeline starts here
}
```

### Calculation Pipeline
```javascript
Line 11385: calcProc.start(_.compact([
  Line 11386-11393: reset step
  Line 11394-11411: base figure creation
  Line 11412-11562: subdivision step
  Line 11563-11575: primitive relations
  Line 11577-11629: fullerene transformation (conditional)
  Line 11630-11641: set remove indexes
  Line 11642-11920+: pre-slice/cutting
  Line 11920+: tent net
  Line 12080-12104: finish figure
  Line 12105-12164: plot product
  Line 12165-12170: render scene
  Line 12171-12194: push log
]))
```

### Viewer & Rendering
```javascript
Line 8334-8800: var viewer = (function() { ... })()
  Three.js viewer initialization

Line 8344: var viewer = _.clone(Backbone.Events)
  Backbone events mixin for viewer

Line 8600: viewer.mode = ko.observable()
  Current visualization mode

Line 8626: viewer.mode.subscribe(function(mode) {
  Mode change handler
})

Line 8639: viewer.flash = _.throttle(function(render) { ... })
  Throttled render function

Line 8647-8652: Render logic within flash():
  if (render) {
    viewer.trigger('render', currentFigure)
    renderer.render(scene, camera)
  }

Line 12168: viewer.trigger('render', figure)
  Render trigger in calculation pipeline
```

### Product Visualization
```javascript
Line 9889-9902: ko.bindingHandlers.plot = {
  update: function(canvas, valueAccessor) {
    var product = valueAccessor()
    _.defer(_.bind(product.plot, product, canvas, options))
  }
}

Line 3469-4544: product.plot(canvas, options)
  First implementation of 2D product drawing

Line 4545-5516: product.plot(canvas, options)
  Alternative implementation

Line 5517+: product.plot(canvas, options)
  Another alternative implementation
```

### Order Submission
```javascript
Line 12385-12429: this.submit = function(order, event) {
  // Email validation
  // localStorage save
  // AJAX POST to //acidome.ru/lab/calc/order-flow/?action=create
  // Response handling
}
```

---

## Summary Tables

### Function Call Sequence: "Calculate" Button

| Step | Function | File | Lines | Parameters |
|------|----------|------|-------|------------|
| 1 | `store.calculate()` | appStore.ts | 108-124 | None |
| 2 | `createFigure(params)` | Figure.ts | 412-421 | FigureParams |
| 3a | `Icosahedron(params)` | Figure.ts | 300 | FigureParams |
| 3b | `initialize()` | Figure.ts | 27-46 | None |
| 3b1 | `createBaseVertices()` | Figure.ts | 301-327 | None |
| 3b2 | `addVertex(pos, idx)` | Figure.ts | 61-77 | Vector3Class |
| 3b3 | `createBaseFaces()` | Figure.ts | 329-363 | None |
| 3b4 | `subdivide()` | Figure.ts | 101-107 | None |
| 3b4a | `subdivideOnce()` | Figure.ts | 112-152 | None |
| 3b4a-i | `Metrics.lerp(v1,v2,0.5)` | Metrics.ts | ~static | Vector3 |
| 3b5 | `scaleToRadius(radius)` | Figure.ts | 157-162 | number |
| 3b6 | `createEdges()` | Figure.ts | 167-187 | None |
| 3b7 | `cutPartial()` | Figure.ts | 201-227 | None |
| 3b8 | `alignBase()` | Figure.ts | 232-243 | None |
| 3c | `getStats()` | Figure.ts | 286-293 | None |
| 4 | `new Product(fig, params)` | Product.ts | 27-33 | Figure, ProductParams |
| 4a | `generateFromFigure()` | Product.ts | 38-85 | None |
| 4a1 | `calculatePolygonArea(verts)` | Product.ts | 90-109 | Vector3[] |
| 4a2 | `calculatePolygonPerimeter(verts)` | Product.ts | 114-122 | Vector3[] |
| 4a3 | `Metrics.distance(v1, v2)` | Metrics.ts | ~static | Vector3 |
| 4b | `calculateBudget()` | Product.ts | 127-193 | None |
| 5 | `store._reactive.update()` | appStore.ts | ~automatic | None |
| 6 | `reportText.computed()` | appStore.ts | 75-96 | None |
| 6a | `exportBudget()` | Product.ts | 226-228 | None |
| 7 | Vue render | App.vue | ~template | None |

