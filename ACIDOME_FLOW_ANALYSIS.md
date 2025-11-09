# ACIDOME Complete Function Call Flow Analysis

## Project Structure
- **Main Entry Point**: `/home/user/acidome_AI/src/main.ts` (Vue 3 + Pinia)
- **Legacy Code**: `/home/user/acidome_AI/src/acidome.js` (Knockout.js + Backbone)
- **Core Modules**: 
  - `/home/user/acidome_AI/src/core/Figure.ts` - Geometry calculations
  - `/home/user/acidome_AI/src/core/Product.ts` - Physical components & budget
  - `/home/user/acidome_AI/src/core/Metrics.ts` - Mathematical utilities
- **App Store**: `/home/user/acidome_AI/src/ui/store/appStore.ts` (Pinia store)
- **Vue Component**: `/home/user/acidome_AI/src/App.vue` (Main UI)

---

## FLOW 1: User Clicks "Calculate" Button

### Entry Point
**File**: `/home/user/acidome_AI/src/App.vue` (Lines 119-125)
```html
<button
  @click="store.calculate"
  :disabled="store.isCalculating"
  class="btn-calculate"
>
  {{ store.isCalculating ? 'Calculating...' : 'Calculate' }}
</button>
```

### Function Call Chain

#### 1️⃣ **Pinia Store Action**
- **Function**: `calculate()`
- **File**: `/home/user/acidome_AI/src/ui/store/appStore.ts` (Lines 108-124)
- **Parameters**: None
- **Data Passed**:
  - `figureParams` (observable state)
  - `productParams` (observable state)

```typescript
const calculate = async () => {
  isCalculating.value = true
  error.value = null
  
  try {
    // Create figure
    currentFigure.value = createFigure(figureParams.value)
    
    // Create product
    currentProduct.value = new Product(currentFigure.value, productParams.value)
  } catch (err: any) {
    error.value = err.message || 'Calculation failed'
  } finally {
    isCalculating.value = false
  }
}
```

#### 2️⃣ **Create Figure (Factory Function)**
- **Function**: `createFigure(params)`
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 412-421)
- **Parameters**:
  - `params: FigureParams` - Contains: base, detail, subdivClass, radius, partial, etc.
- **Returns**: `Figure` (Icosahedron or Octohedron instance)

```typescript
export function createFigure(params: FigureParams): Figure {
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

#### 3️⃣ **Figure Constructor (Base Class)**
- **Class**: `Figure` (abstract)
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 19-46)
- **Called Method**: `initialize()`
- **Execution Steps**:

##### Step 3a: Create Base Vertices
- **Function**: `createBaseVertices()` (abstract, overridden by subclass)
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 301-327 for Icosahedron)
- **What it does**: 
  - Generates 12 vertices for Icosahedron OR 6 vertices for Octohedron
  - Uses golden ratio: `phi = (1 + √5) / 2`
  - Calls `addVertex(position)` for each vertex

##### Step 3b: Add Vertices with Deduplication
- **Function**: `addVertex(position, index)`
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 61-77)
- **Parameters**:
  - `position: Vector3Class`
  - `index: number` (optional)
- **Processing**:
  - Converts position to map key with 10-digit precision
  - Checks for duplicates using `vertexMap`
  - Returns vertex index (0-based)
- **Data Modified**: `vertices[]`, `vertexMap`

##### Step 3c: Create Base Faces
- **Function**: `createBaseFaces()` (abstract, overridden)
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 329-363 for Icosahedron)
- **Creates**: 20 triangular faces for Icosahedron (8 for Octohedron)
- **Face Format**:
  ```typescript
  {
    vertices: [Vector3Class, Vector3Class, Vector3Class],
    color?: string
  }
  ```

##### Step 3d: Subdivide Geometry
- **Function**: `subdivide()`
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 101-107)
- **Loop Count**: `detail - 1` iterations
- **Each Iteration Calls**: `subdivideOnce()`

###### Step 3d-i: Single Subdivision
- **Function**: `subdivideOnce()`
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 112-152)
- **Algorithm**:
  1. For each face in `faces[]`
  2. Extract face vertices
  3. Calculate midpoint vertices using linear interpolation: `lerp(v1, v2, 0.5)`
  4. Normalize midpoints to unit sphere
  5. Create 4 new triangular faces from each original triangle
  6. For triangular faces, add center triangle
- **Calls**: `Metrics.lerp()` and `normalize()` on vectors

##### Step 3e: Scale to Radius
- **Function**: `scaleToRadius(radius)`
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 157-162)
- **Parameters**: `radius: number`
- **Processing**:
  - For each vertex: `position.scale(radius / position.length())`
  - Scales all vertices from unit sphere to specified radius

##### Step 3f: Create Edges from Faces
- **Function**: `createEdges()`
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 167-187)
- **Algorithm**:
  1. Iterate through all faces
  2. For each edge in face, create edge key (sorted for consistency)
  3. Avoid duplicates using `edgeSet`
  4. Push to `edges[]` array
- **Edge Format**:
  ```typescript
  {
    vertexA: Vector3Class,
    vertexB: Vector3Class,
    color: string
  }
  ```

##### Step 3g: Cut Partial (if not full sphere)
- **Function**: `cutPartial()`
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 201-227)
- **Condition**: `params.partial !== '1/1'`
- **Processing**:
  - Parse partial parameter (e.g., '7/12')
  - Calculate cut height: `cutHeight = -1 + (2 * numerator) / denominator`
  - Filter faces: keep only those with all vertices >= cutHeight * radius
  - Filter vertices: keep only those with y >= cutHeight * radius

##### Step 3h: Align Base (if needed)
- **Function**: `alignBase()`
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 232-243)
- **Condition**: `params.alignTheBase === true`
- **Processing**:
  - Find minimum Y coordinate among all vertices
  - Translate all vertices so minimum Y = 0

#### 4️⃣ **Figure Statistics Computed**
- **Function**: `getStats()`
- **File**: `/home/user/acidome_AI/src/core/Figure.ts` (Lines 286-293)
- **Returns**:
  ```typescript
  {
    vertexCount: number,
    faceCount: number,
    edgeCount: number,
    surfaceArea: number
  }
  ```

#### 5️⃣ **Create Product (Physical Components)**
- **Class**: `Product`
- **File**: `/home/user/acidome_AI/src/core/Product.ts` (Lines 19-33)
- **Constructor Parameters**:
  - `figure: Figure` - Result from step 3
  - `params: ProductParams`
- **Initialization Calls**:

##### Step 5a: Generate Physical Components
- **Function**: `generateFromFigure()`
- **File**: `/home/user/acidome_AI/src/core/Product.ts` (Lines 38-85)
- **Creates 3 Collections**:

###### 5a-i: Panels (from faces)
- For each face in `figure.faces`:
  - Calculate area: `calculatePolygonArea(face.vertices)`
  - Calculate perimeter: `calculatePolygonPerimeter(face.vertices)`
  - Create panel object with `vertices`, `area`, `perimeter`, `color`
- **Panel Format**:
  ```typescript
  {
    vertices: Vector3Class[],
    area: number,
    perimeter: number,
    color: string
  }
  ```

###### 5a-ii: Beams (from edges)
- For each edge in `figure.edges`:
  - Calculate length: `Metrics.distance(edge.vertexA, edge.vertexB)`
  - Create beam object with `start`, `end`, `length`, `width`, `thickness`, `color`
- **Beam Format**:
  ```typescript
  {
    start: Vector3Class,
    end: Vector3Class,
    length: number,
    width: number,
    thickness: number,
    color: string
  }
  ```

###### 5a-iii: Connectors (from vertices)
- For each vertex in `figure.vertices`:
  - Count connected edges (degree)
  - Create connector object with `position`, `type`, `degree`, `color`
- **Connector Format**:
  ```typescript
  {
    position: Vector3Class,
    type: string,
    degree: number,
    color: string
  }
  ```

##### Step 5b: Calculate Budget
- **Function**: `calculateBudget()`
- **File**: `/home/user/acidome_AI/src/core/Product.ts` (Lines 127-193)
- **Creates 3 Budget Types**:

###### 5b-i: Line Budget
- Group beams by length (rounded to 2 decimals)
- For each group:
  - Create budget item with: size, quantity, unitLength, totalLength
  - Accumulate totalQuantity and totalLength

###### 5b-ii: Panel Budget
- Count all panels
- Create budget item with quantity

###### 5b-iii: Connector Budget
- Count all connectors
- Create budget item with quantity

#### 6️⃣ **Store Update**
- **Function**: Pinia reactive update
- **File**: `/home/user/acidome_AI/src/ui/store/appStore.ts` (Lines 108-124)
- **State Modified**:
  - `currentFigure.value = figure`
  - `currentProduct.value = product`
  - `isCalculating.value = false`

#### 7️⃣ **Computed Properties Recalculate**
- **Function**: `reportText` computed property
- **File**: `/home/user/acidome_AI/src/ui/store/appStore.ts` (Lines 75-96)
- **Processing**:
  - Calls `currentFigure.getStats()`
  - Calls `currentProduct.exportBudget()`
  - Builds text report with statistics
- **Output**: Displayed in stats section

#### 8️⃣ **UI Reactive Updates**
- Vue 3 automatically re-renders due to reactive state changes
- **Template Updates**:
  - Stats section displays `store.reportText`
  - Preview shows `store.currentFigure`
  - Mode buttons become enabled
  - Calculate button re-enables

---

## FLOW 2: User Changes "Level of Detail" Slider

### Entry Point
**File**: `/home/user/acidome_AI/src/App.vue` (Lines 45-55)
```html
<div class="form-group">
  <label>Level of Detail</label>
  <select
    v-model.number="store.figureParams.detail"
    @change="onParamChange"
  >
    <option v-for="d in store.detailList" :key="d" :value="d">
      {{ d }}
    </option>
  </select>
</div>
```

### Function Call Chain

#### 1️⃣ **Slider Change Event**
- **Event**: `@change="onParamChange"`
- **File**: `/home/user/acidome_AI/src/App.vue` (Lines 183-186)
- **Function**: `onParamChange()`
- **Parameters**: None
- **Current Implementation**: Empty (comment says "This can be automatic or debounced")

#### 2️⃣ **Direct Store Update** (via v-model)
- **Observable**: `store.figureParams.detail`
- **File**: `/home/user/acidome_AI/src/ui/store/appStore.ts` (Lines 15, 48-49)
- **Trigger**: Pinia reactive update

#### 3️⃣ **Computed Property Recalculation**
- **Computed**: `subdivClassList`
- **File**: `/home/user/acidome_AI/src/ui/store/appStore.ts` (Lines 36-44)
- **Logic**:
  ```typescript
  return figureParams.value.detail >= 2
    ? [
        { id: 'I', name: 'Class I' },
        { id: 'II', name: 'Class II' },
        { id: 'III', name: 'Class III' }
      ]
    : []
  ```
- **Effect**: Subdivision class dropdown appears/updates when detail >= 2

#### 4️⃣ **Optional: Automatic Recalculation**
- Can trigger `store.calculate()` automatically or debounced
- Would execute full calculation pipeline (Flow 1 steps 2-8)

---

## FLOW 3: User Clicks "Rotate" Button

### Entry Point (Legacy Knockout.js Code)
**File**: `/home/user/acidome_AI/index.html` (Lines 667-681)
```html
<button class="rotate" data-bind="
  click: function(vm, event) {
    var scrollTop = $(window).scrollTop(),
        offsetTop = $(event.target).offset().top;

    form.strutViewBySide(! form.strutViewBySide()); // toggle view mode

    $(window).scrollTop(
      scrollTop + (
        $(event.target).offset().top - offsetTop
      )
    );
  },
  text: form.strutViewBySide() ? '⤴' : '⤵'
"></button>
```

### Function Call Chain

#### 1️⃣ **Click Handler**
- **Handler**: Inline click function
- **File**: `/home/user/acidome_AI/src/acidome.js` (Line 10214)
- **Observable Being Toggled**: `form.strutViewBySide`
- **Definition**:
  ```javascript
  form.strutViewBySide = ko.observable(
    JSON.parse(localStorage.getItem('acidome.view-strut-by-side') || 'false')
  );
  ```

#### 2️⃣ **Toggle View Mode**
- **Line**: Toggle between true/false
- **Storage**: Persists to localStorage
- **Subscription** (Line 10215):
  ```javascript
  form.strutViewBySide.subscribe(function(bySide) {
    // Updates canvas display - renders side view or front view
  });
  ```

#### 3️⃣ **Canvas Re-rendering**
- **Binding**: `plot` binding on canvas elements
- **File**: `/home/user/acidome_AI/src/acidome.js` (Lines 9889-9902)
- **Data Binding**:
  ```javascript
  ko.bindingHandlers.plot = {
    update: function(canvas, valueAccessor) {
      var product = valueAccessor();
      if (_.isArray(product)) {
        var options = product[1];
        product = product[0];
      }
      _.defer(_.bind(product.plot, product, canvas, options));
    }
  };
  ```

#### 4️⃣ **Canvas Rendering**
- **Function**: `product.plot(canvas, options)`
- **File**: `/home/user/acidome_AI/src/acidome.js` (Multiple implementations)
  - Lines 3469-4544: Draw product scheme
  - Lines 4545-5516: Draw product scheme (alternative)
  - Lines 5517+: Draw product scheme (alternative)
- **Parameters**:
  - `canvas`: HTML canvas element
  - `options`: Optional rendering options
- **Processing**:
  - Draws 2D representation of product
  - Switches between side view (bySide=true) or front view (bySide=false)

#### 5️⃣ **Scroll Restoration**
- **Line 674-678**: Restores scroll position to account for layout changes
- **Calculation**: `scrollTop + (newOffsetTop - oldOffsetTop)`

---

## FLOW 4: User Changes Visualization Mode (Base/Carcass/Schema/Cover/Tent)

### Entry Point
**File**: `/home/user/acidome_AI/src/App.vue` (Lines 136-146)
```html
<div class="mode-selector">
  <button
    v-for="mode in ['base', 'carcass', 'schema', 'cover']"
    :key="mode"
    @click="store.setViewerMode(mode)"
    :class="{ active: store.viewerMode === mode }"
    class="mode-btn"
  >
    {{ mode }}
  </button>
</div>
```

### Function Call Chain

#### 1️⃣ **Mode Button Click**
- **Event**: `@click="store.setViewerMode(mode)"`
- **Mode Values**: 'base', 'carcass', 'schema', 'cover', 'tent'

#### 2️⃣ **Store Action: setViewerMode**
- **Function**: `setViewerMode(mode)`
- **File**: `/home/user/acidome_AI/src/ui/store/appStore.ts` (Lines 126-128)
- **Parameters**: `mode: string`
- **Operation**:
  ```typescript
  const setViewerMode = (mode: string) => {
    viewerMode.value = mode
  }
  ```

#### 3️⃣ **Reactive Update**
- **State Modified**: `viewerMode.value`
- **File**: `/home/user/acidome_AI/src/ui/store/appStore.ts` (Line 24)

#### 4️⃣ **Vue Component Re-render**
- **Template**: Mode button CSS class binding updates
- **Active Button**: CSS class 'active' updates
- **Visual Effect**: Button styling changes to indicate active mode

#### 5️⃣ **Legacy Viewer Mode Update** (if using old Knockout integration)
- **Observable**: `viewer.mode`
- **File**: `/home/user/acidome_AI/src/acidome.js` (Lines 8600-8626)
- **Subscription**:
  ```javascript
  viewer.mode.subscribe(function(mode) {
    activeMode = viewer.mode();
  });
  ```

#### 6️⃣ **Viewer Render Trigger**
- **Function**: `viewer.trigger('render')`
- **File**: `/home/user/acidome_AI/src/acidome.js` (Line 8649)
- **Drivers**: Different rendering logic for each mode
- **Mode Drivers** (Line 8679+):
  - `viewer.drivers.base` - Base geometry
  - `viewer.drivers.carcass` - Frame only
  - `viewer.drivers.schema` - Structure diagram
  - `viewer.drivers.cover` - With covering/panels
  - `viewer.drivers.tent` - Tent configuration

#### 7️⃣ **Three.js Scene Update**
- **Scene Variables**: (Line 8723+)
  - `camera`
  - `scene`
  - `light`
  - `renderer`
  - `commonGroup`
- **Particle Update** (Line 8760):
  - Gets particle type for active mode
  - Builds 3D representation
- **Canvas Render** (Line 8769+):
  - Uses THREE.CanvasRenderer
  - Renders scene with updated mode

---

## FLOW 5: Form Submission → Calculation Pipeline (Legacy Code)

### Legacy Entry Point
**File**: `/home/user/acidome_AI/index.html` (Line 303)
```html
<button data-bind="text: 'buyme:Buy it', click: submit, attr: { disabled: pending }"></button>
```

### Function Call Chain

#### 1️⃣ **Submit Button Click**
- **Handler**: `click: submit`
- **File**: `/home/user/acidome_AI/src/acidome.js` (Line 12385)

#### 2️⃣ **Submit Function**
- **Function**: `this.submit(order, event)`
- **File**: `/home/user/acidome_AI/src/acidome.js` (Lines 12385-12429)
- **Processing**:
  1. Validates email regex (line 12389)
  2. Saves email to localStorage
  3. Sets `order.pending(true)` (loading state)
  4. Sends AJAX POST to `//acidome.ru/lab/calc/order-flow/?action=create`
  5. Sends data:
     - `order`: { email, producer, selectedPositions }
     - `url`: Current location hash
     - `form`: form.state (all form parameters)

#### 3️⃣ **AJAX Response**
- **Endpoint**: External server (acidome.ru)
- **Response Handling**:
  - On error: Shows alert with error message
  - On success: Shows confirmation alert
  - Always: Sets `order.pending(false)`

---

## COMPLETE CALCULATION PIPELINE (Legacy Code)

### Main Trigger
**File**: `/home/user/acidome_AI/src/acidome.js` (Lines 11225-11283)
- Triggered by form state changes
- Multiple listeners on `form.on('change', ...)`

### Calculation Process Chain
**File**: `/home/user/acidome_AI/src/acidome.js` (Lines 11385-12164)
- Uses `calcProc.start()` with array of calculation steps

#### Step Sequence:

| # | Name | Lines | Purpose |
|---|------|-------|---------|
| 1 | reset | 11386-11393 | Clear Figure enum counter |
| 2 | base figure | 11395-11411 | Create Icosahedron/Octohedron or Tetrakis/Pentakis for class II |
| 3 | subdivision | 11413-11562 | Apply subdivision (Chords, Arcs, Mexican, Kruschke, Class II, Class III) |
| 4 | primitive relations | 11564-11575 | Calculate relationships between primitives |
| 5 | transmutation figure to fulleren | 11578-11629 | (Conditional) Apply fullerene transformation if enabled |
| 6 | set items remove indexes | 11631-11641 | Assign unique identifiers for removable items |
| 7 | pre-slice | 11643-11920+ | Complex cutting and slicing logic for partial domes and doors |
| 8 | tent net | 11920+ | Tent network calculation |
| 9 | finish figure | 12080-12104 | Mark result figure and trigger report computation |
| 10 | plot product | 12106-12164 | Prepare product visualization on canvases |
| 11 | render scene | 12166-12170 | Trigger Three.js scene rendering |
| 12 | push log | 12172+ | Log changes for analytics |

### Key Function Calls in Pipeline:

#### Figure Methods:
- `new Figure["Icosahedron" | "Octohedron" | "TetrakisHexahedron" | "PentakisDodecahedron"]()`
- `figure.splitFaces(V)` - Chords subdivision
- `figure.splitFaces_EA(V)` - Equal Arcs subdivision
- `figure.splitFaces_EA_updateToMexican(V)` - Mexican variant
- `figure.splitFaces_updateToClassII()` - Class II conversion
- `figure.splitFaces_updateToClassIII(p, q)` - Class III conversion
- `figure.fulleren()` - Inscribed fullerene
- `figure.outerFulleren()` - Circumscribed fullerene
- `figure.relations()` - Recalculate geometric relationships
- `figure.$primitives` - Access vertices, edges, faces
- `figure.CuttingLine()` - Advanced cutting tool for partial domes

#### Result Update:
- `form.resultFigure(figure)` (Line 12101)
  - Triggers computed: `form.resultMeter`
  - Triggers computed: `form.reportText`

#### Viewer Trigger:
- `viewer.trigger('render', figure)` (Line 12168)

---

## Data Flow Summary

### Input Parameters (FigureParams)
```typescript
{
  base: 'Icosahedron' | 'Octohedron',
  detail: 1-18,
  subdivClass: 'I' | 'II' | 'III_p,q',
  subdivMethod: 'Chords' | 'Arcs' | 'Mexican' | 'Kruschke',
  symmetry: 'Pentad' | ...,
  fullerenType: 'none' | 'inscribed' | 'described',
  partial: '1/1' | '7/12' | '5/8' | ...,
  partialMode: 'faces' | 'height',
  partialHeight: 0-1,
  alignTheBase: boolean,
  connType: 'GoodKarma' | 'Semicone' | 'Piped' | ...,
  pipeD: number,
  clockwise: boolean,
  radius: number,
  beamsWidth: number,
  beamsThickness: number,
  M: number,
  N: number
}
```

### Output Data (Figure)
```typescript
{
  vertices: Vertex[],
  faces: Face[],
  edges: Edge[],
  params: FigureParams,
  $primitives: Figure[] (all geometry elements)
}
```

### Output Data (Product)
```typescript
{
  panels: Panel[],
  beams: Beam[],
  connectors: Connector[],
  budgets: Budget[]
}
```

### Final Output (Report)
```
Vertices: [number]
Faces: [number]
Edges: [number]
Surface Area: [number] m²

LINE
Total: [number]
Total Length: [number] m

PANEL
Total: [number]

CONNECTOR
Total: [number]
```

---

## Performance Considerations

1. **Debouncing**: Form changes debounced 200ms (Line 10045)
2. **Deferred Evaluation**: Plot binding uses `_.defer()` (Line 9900)
3. **Computed Dependencies**: Result meter only computed when figure changes
4. **Canvas Rendering**: Uses throttle for `viewer.flash()` (Line 8639)
5. **Subdivision**: Quadratic growth (detail=3 → 1280 faces, detail=4 → 5120 faces)

---

## Error Handling

### Vue 3 (App Store)
- Try-catch in `calculate()` function
- Error stored in `error.value`
- Displayed in template if error exists

### Legacy Code
- Error alerts on AJAX failure
- Email validation before submission
- Bad factor warnings for fullerene faces

---

## State Management

### Pinia Store (`appStore.ts`)
- `figureParams`: Input parameters
- `productParams`: Product properties
- `currentFigure`: Calculated geometry
- `currentProduct`: Physical components
- `viewerMode`: Current visualization mode
- `isCalculating`: Loading flag
- `error`: Error message

### Local Storage (Legacy)
- `acidome.view-strut-by-side`: Beam view mode
- `client-email`: For order submission

### URL Fragment
- Encodes complete figure specification
- Allows sharing/bookmarking configurations
