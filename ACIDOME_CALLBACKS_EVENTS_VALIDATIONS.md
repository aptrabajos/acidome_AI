# ACIDOME - Complete Callback, Event Handler & Validation Reference

## SECTION 1: EVENT HANDLERS & LISTENERS

### 1.1 Vue 3 Template Events (App.vue)

#### Language Selector
- **Event**: @change (line 16)
- **Handler**: `store.setLanguage(store.language)`
- **What it does**: Changes language and updates UI translations
- **Affected store state**: `language` ref
- **File**: /home/user/acidome_AI/src/App.vue:16

#### Form Input Changes - All Parameters
- **Event**: @change (lines 39, 49, 61, 80, 86, 104, 115)
- **Handler**: `onParamChange()` 
- **What it does**: Triggers recalculation if needed (currently empty)
- **Parameters affected**:
  - base (line 39)
  - detail (line 49)
  - subdivClass (line 61)
  - radius (line 80)
  - partial (line 86)
  - beamsWidth (line 104)
  - beamsThickness (line 115)
- **File**: /home/user/acidome_AI/src/App.vue:39-115

#### Calculate Button Click
- **Event**: @click (line 120)
- **Handler**: `store.calculate()`
- **What it does**: Initiates async calculation of figure and product
- **Associated state**: `isCalculating` flag changes during calculation
- **File**: /home/user/acidome_AI/src/App.vue:120

#### Mode Selector Buttons
- **Event**: @click (line 140)
- **Handler**: `store.setViewerMode(mode)`
- **What it does**: Switches between visualization modes (base, carcass, schema, cover)
- **Modes**: 'base', 'carcass', 'schema', 'cover'
- **File**: /home/user/acidome_AI/src/App.vue:140

### 1.2 Legacy Knockout.js Event Handlers (acidome.js)

#### Language Observable Subscription
- **Line**: 7455, 7465, 7474
- **Observable**: `form.lang` (knockout)
- **Handler Type**: .subscribe()
- **What it does**: 
  - Updates UI when language changes (line 7465)
  - Saves language to localStorage (line 7474)
- **LocalStorage key**: i18n language setting
- **File**: /home/user/acidome_AI/src/acidome.js:7455-7476

#### Viewer Mode Observable
- **Lines**: 8600, 8626, 8679
- **Observable**: `viewer.mode` (knockout)
- **Handler Type**: .subscribe()
- **What it does**: Updates visualization when mode changes
- **Modes**: 'polyhedron', 'pattern', and others
- **File**: /home/user/acidome_AI/src/acidome.js:8600-8685

#### Canvas Interaction Events
- **Lines**: 8384, 8388, 8394, 8403
- **Event Types**: 
  - mousedown/touchstart (line 8384)
  - mouseup/touchend (line 8388)
  - mousemove/touchmove (line 8394)
  - click (line 8403)
- **Handler Functions**:
  - Rotation/zoom on drag
  - Canvas interaction handling
  - Raycasting for face/element selection
- **File**: /home/user/acidome_AI/src/acidome.js:8384-8403

#### Window Resize Event
- **Line**: 8353
- **Event**: resize (with debounce 300ms)
- **Handler**: `resizeCanvas`
- **What it does**: Adjusts canvas size and camera aspect ratio
- **Debounce**: 300ms to prevent excessive recalculations
- **File**: /home/user/acidome_AI/src/acidome.js:8353

#### Form Submission / Calculation Chain
- **Lines**: 10174, 10178, 10182, 10186, 10190
- **Observables triggering chains**:
  - `form.base.subscribe()` - resets subdivisions
  - `form.detail.subscribe()` - validates detail level
  - `form.fullerenType.subscribe()` - updates fulleren settings
  - `form.subdivClass.subscribe()` - validates class
  - `form.subdivMethod.subscribe()` - validates method
- **File**: /home/user/acidome_AI/src/acidome.js:10174-10190

#### URL Fragment (Router) Changes
- **Line**: 11165, 11188
- **Event Types**:
  - popstate (window history)
  - params event from fragmentRouter
- **Handlers**: Parse URL hash and update form state
- **File**: /home/user/acidome_AI/src/acidome.js:11165-11232

#### Download Button Click
- **Line**: 8863
- **Event**: click on '.download' element
- **Handler**: Triggers file download (OBJ/CSV export)
- **File**: /home/user/acidome_AI/src/acidome.js:8863

#### Face Click Events (3D Scene)
- **Lines**: 9220-9229, 9407-9415, 9545-9553, 9644-9650
- **Event Types**: mousein, mouseout, click
- **Handlers**: 
  - Highlight face on hover
  - Face selection on click
  - Execute face-specific callbacks
- **File**: /home/user/acidome_AI/src/acidome.js:9220-9650

#### Stats Toggle Click
- **Line**: 8715
- **Event**: click on '.stat .toggle'
- **Handler**: Toggle statistics panel visibility
- **File**: /home/user/acidome_AI/src/acidome.js:8715

#### Removed List / Tent Net Subscriptions
- **Lines**: 10244, 10280, 10292, 10298, 10307
- **Observables**:
  - `form.removedList.subscribe()` - tracks removed elements
  - `form.tentNetBeginFace.subscribe()` - validates tent start face
  - `form.tentNetTextureName.subscribe()` - updates texture
  - `form.tentNetStaticLineList.subscribe()` - updates static lines
  - `form.tentNetAdvancedLineList.subscribe()` - updates advanced lines
- **File**: /home/user/acidome_AI/src/acidome.js:10244-10314

#### Custom Viewer Events
- **Lines**: 8699, 8703, 8778
- **Custom Events**:
  - 'tent-calc-start' - fires when tent calculation begins
  - 'tent-calc-success' - fires when calculation completes
  - 'render' - fires when figure is rendered
- **File**: /home/user/acidome_AI/src/acidome.js:8699-8778

#### LocalStorage Change Subscribers
- **Lines**: 10214-10216
- **Observable**: `form.strutViewBySide`
- **LocalStorage key**: 'acidome.view-strut-by-side'
- **Behavior**: Saves boolean preference to localStorage on change
- **File**: /home/user/acidome_AI/src/acidome.js:10214-10216

---

## SECTION 2: VALIDATIONS

### 2.1 Parameter Validations (Type Constraints)

#### Base Polyhedron Validation
- **Parameter**: `params.base`
- **Valid values**: 'Icosahedron', 'Octohedron'
- **Implementation**: Switch statement with error throw
- **Line**: Figure.ts:412-420
- **Error handling**: Throws `Error("Unknown base polyhedron: ${params.base}")`
- **Location**: /home/user/acidome_AI/src/core/Figure.ts:419

#### Detail Level Validation
- **Parameter**: `figureParams.detail`
- **Valid range**: 1-5 (from DETAIL_LIST constant)
- **Type**: number
- **Conditional behavior**: Detail level affects available options
- **Sub-validations**:
  - detail >= 2: Enables subdivClass selector
  - detail >= 3: Enables subdivMethod selector
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:36-55

#### Subdivision Class Validation
- **Parameter**: `subdivClass`
- **Valid values**: 'I', 'II', 'III'
- **Condition**: Only available when detail >= 2
- **Implementation**: Computed property filters based on detail
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:36-44

#### Subdivision Method Validation
- **Parameter**: `subdivMethod`
- **Valid values**: 'Chords', 'Arcs', 'Kruschke', 'Mexican'
- **Conditions**:
  - Only available when detail >= 3
  - Only available when subdivClass === 'I'
- **Implementation**: Computed property chains conditions
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:46-55

#### Radius Validation
- **Parameter**: `radius`
- **Type**: number (float)
- **Range**: > 0.1 (HTML min="0.1")
- **Unit**: meters
- **Sync**: Updates productParams.radius whenever figure radius changes
- **Location**: /home/user/acidome_AI/src/App.vue:76, appStore.ts:101

#### Partial Sphere Validation
- **Parameter**: `partial`
- **Valid values**: '1/1', '7/8', '3/4', '5/8', '7/12', '1/2', '5/12', '1/3'
- **Format**: Numerator/Denominator (for 'faces' mode)
- **Parsing logic**: Lines 207-214 in Figure.ts
- **Validation**: Regex match `(\d+)\/(\d+)` for parsing
- **Fallback**: Default to 0.777 if parsing fails
- **Location**: /home/user/acidome_AI/src/core/Figure.ts:205-217

#### Beams Width & Thickness Validation
- **Parameters**: 
  - `beamsWidth` (HTML min="1")
  - `beamsThickness` (HTML min="1")
- **Type**: number (integer)
- **Unit**: millimeters
- **Range**: >= 1 mm
- **Location**: /home/user/acidome_AI/src/App.vue:99-115

#### Partial Mode Validation
- **Parameter**: `partialMode`
- **Valid values**: 'faces' | 'height'
- **Behavior**:
  - If 'faces': Parse partial as fraction (X/Y)
  - If 'height': Use partialHeight parameter (default 0.777)
- **Location**: /home/user/acidome_AI/src/core/Figure.ts:205

### 2.2 Geometric Validations

#### Vector Length Validation
- **Function**: `Vector3Class.length()`
- **What it validates**: Magnitude of 3D vector
- **Implementation**: 
  ```javascript
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }
  ```
- **Used for**: Distance calculations, normalization checks
- **Location**: /home/user/acidome_AI/src/core/Metrics.ts:83-85

#### Zero Vector Check
- **Function**: `Vector3Class.isZero(epsilon = 1e-20)`
- **What it validates**: Whether vector is effectively zero
- **Implementation**: Checks lengthSq() < epsilon
- **Epsilon default**: 1e-20 (very small tolerance)
- **Used for**: Avoiding division by zero in normalize()
- **Location**: /home/user/acidome_AI/src/core/Metrics.ts:97-99

#### Vector Normalization Safety
- **Function**: `Vector3Class.normalize()`
- **Safety check**: Guards against zero-length vectors
- **Implementation**: 
  ```typescript
  normalize(): this {
    const length = this.length()
    if (length > 0) {
      this.x /= length
      this.y /= length
      this.z /= length
    }
    return this
  }
  ```
- **Consequence**: Returns unchanged if length is 0
- **Location**: /home/user/acidome_AI/src/core/Metrics.ts:104-112

#### Vector Projection Validation
- **Function**: `Vector3Class.projectOnto(v: Vector3)`
- **Validation**: Checks if target vector is zero (vDotV === 0)
- **Consequence**: Returns zero vector if target is invalid
- **Implementation**: Guards against division by zero
- **Location**: /home/user/acidome_AI/src/core/Metrics.ts:135-142

#### Angle Calculation Clamping
- **Function**: `Vector3Class.angleTo(v: Vector3)`
- **Validation**: Clamps dot product to [-1, 1] range
- **Implementation**: 
  ```typescript
  Math.acos(Math.max(-1, Math.min(1, theta)))
  ```
- **Why**: Prevents NaN from acos due to floating-point errors
- **Location**: /home/user/acidome_AI/src/core/Metrics.ts:174-177

#### Vertex Deduplication
- **Function**: `Figure.addVertex()` and `getVertexIndex()`
- **Validation**: Uses vectorToKey() to detect duplicate vertices
- **Precision**: 10 decimal places (configurable)
- **Purpose**: Ensures no duplicate vertices in mesh
- **Location**: /home/user/acidome_AI/src/core/Figure.ts:61-88, 93-96

#### Face Vertex Count Validation
- **Check**: Face surfaces use `if (vertices.length === 3)`
- **Purpose**: Only calculates area for triangular faces
- **Location**: Multiple in Product.ts and Figure.ts
- **Consequence**: Returns 0 area for non-triangular faces
- **Location**: /home/user/acidome_AI/src/core/Figure.ts:272

#### Partial Sphere Cutting Validation
- **Check**: `face.vertices.every(v => v.y >= cutHeight * radius)`
- **Purpose**: Ensures face is completely above cutting plane
- **Implementation**: All vertices of face must be above cut
- **Consequence**: Removes faces that cross cutting plane
- **Location**: /home/user/acidome_AI/src/core/Figure.ts:220-222

#### Convexity Validation (Legacy - acidome.js)
- **Check**: `isConvex = _.every(normals, normal => Vector.dotProduct(normal, normals[0]) > -1e-9)`
- **Purpose**: Validates that face is convex
- **Tolerance**: -1e-9 (allows slight numerical errors)
- **Location**: /home/user/acidome_AI/src/acidome.js:1978

#### Normal Vector Length Check
- **Check**: `normal.length() > 1e-9`
- **Purpose**: Filters out invalid (zero-length) normals
- **Tolerance**: 1e-9
- **Location**: /home/user/acidome_AI/src/acidome.js:1975

### 2.3 State Validations

#### Element Live/Removed Status
- **Checks in acidome.js**:
  - `! face.removed && face.live` (line 7220)
  - `! line.removed && line.live` (line 7252)
- **Purpose**: Only processes valid/active elements
- **Consequence**: Skips elements marked as removed
- **Location**: /home/user/acidome_AI/src/acidome.js:7220, 7252

#### Observable Existence Check
- **Check**: `ko.isObservable(form[key])`
- **Purpose**: Validates that form property is an observable
- **Location**: /home/user/acidome_AI/src/acidome.js:9970

#### Type Validation on Numeric Input
- **Vue validation**: `v-model.number` with `type="number"`
- **HTML constraints**: `min="0.1"`, `step="0.1"` for radius
- **Purpose**: Ensures numeric values in form inputs
- **Location**: /home/user/acidome_AI/src/App.vue:75-80, 99-115

### 2.4 Relationship Validations

#### Vertices-Edges-Faces Consistency
- **In Product class**:
  - Panels created from Face vertices
  - Beams created from Edge endpoints
  - Connectors created from Vertex positions
- **Validation**: Vertex degree calculation checks edge count
  ```typescript
  const degree = this.figure.edges.filter(
    e => Metrics.distance(e.vertexA, vertex.position) < 0.01 ||
         Metrics.distance(e.vertexB, vertex.position) < 0.01
  ).length
  ```
- **Tolerance**: 0.01 units for floating-point comparison
- **Location**: /home/user/acidome_AI/src/core/Product.ts:71-75

#### Beam Length Rounding
- **Validation**: Beams grouped by length with precision
  ```typescript
  const roundedLength = (Math.round(beam.length * 100) / 100).toFixed(2)
  ```
- **Purpose**: Groups similar-length beams (tolerance 0.01m)
- **Location**: /home/user/acidome_AI/src/core/Product.ts:141

#### Viewport Dimension Validation
- **Check**: `if (w > 0 && h > 0)` for canvas dimensions
- **Purpose**: Prevents rendering with invalid canvas size
- **Location**: /home/user/acidome_AI/src/acidome.js:1371

### 2.5 Conditional UI Rendering Validations

#### Detail Level Conditional Display
- **Line**: 57 (App.vue)
- **Condition**: `v-if="store.figureParams.detail >= 2"`
- **What it validates**: Shows subdivClass only when applicable
- **File**: /home/user/acidome_AI/src/App.vue:57

#### Calculate Button Disabled State
- **Line**: 121 (App.vue)
- **Condition**: `:disabled="store.isCalculating"`
- **What it prevents**: Multiple simultaneous calculations
- **File**: /home/user/acidome_AI/src/App.vue:121

#### Error Message Display
- **Line**: 127 (App.vue)
- **Condition**: `v-if="store.error"`
- **What it shows**: Error messages from failed calculations
- **File**: /home/user/acidome_AI/src/App.vue:127

#### Placeholder Display
- **Line**: 150 (App.vue)
- **Condition**: `v-if="!store.currentFigure"`
- **What it shows**: Guidance text before calculation
- **File**: /home/user/acidome_AI/src/App.vue:150

#### Mode Button Active State
- **Line**: 141 (App.vue)
- **Condition**: `:class="{ active: store.viewerMode === mode }"`
- **What it validates**: Highlights current viewing mode
- **File**: /home/user/acidome_AI/src/App.vue:141

---

## SECTION 3: CALLBACKS & SUBSCRIPTIONS

### 3.1 Vue 3 Computed Properties (Reactive Callbacks)

#### Subdivision Class List Computed Property
- **Triggers on**: figureParams.detail change
- **Computes**: Available subdivision classes
- **Returns**: Array of class options or empty if detail < 2
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:36-44

#### Subdivision Method List Computed Property
- **Triggers on**: figureParams.detail or subdivClass change
- **Computes**: Available subdivision methods
- **Conditions**: 
  - detail >= 3
  - subdivClass === 'I'
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:46-55

#### Partial List Computed Property
- **Triggers on**: Always available (no dependencies)
- **Computes**: List of partial sphere options
- **Returns**: Static list of 8 options
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:57-66

#### Geometry Stats Computed Property
- **Triggers on**: currentFigure change
- **Computes**: Vertex, face, edge, and surface area statistics
- **Returns**: GeometryStats object or defaults if no figure
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:68-73

#### Report Text Computed Property
- **Triggers on**: currentFigure or currentProduct change
- **Computes**: Formatted statistics and budget report
- **Returns**: Multi-line string with complete dome information
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:75-96

#### Detail List Computed Property
- **Triggers on**: Never (returns static constant)
- **Returns**: [1, 2, 3, 4, 5]
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:34

### 3.2 Async Actions & Promises

#### Calculate Action (Async)
- **Function**: `store.calculate()` (line 108, appStore.ts)
- **Triggers**:
  - Button click (@click="store.calculate")
  - Component mount (onMounted hook)
- **Sequence**:
  1. Sets `isCalculating = true`
  2. Clears previous error
  3. Creates figure via `createFigure(figureParams)`
  4. Creates product via `new Product(figure, productParams)`
  5. Catches errors and sets `error` state
  6. Finally sets `isCalculating = false`
- **Error handling**: Try-catch with console.error
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:108-124

#### Component Mount Lifecycle
- **Hook**: `onMounted()` (line 188, App.vue)
- **Callback**: Calls `store.calculate()`
- **Purpose**: Initial calculation on component load
- **Location**: /home/user/acidome_AI/src/App.vue:188-192

### 3.3 Knockout.js Computed Observables (Legacy)

#### Form Change Detection
- **Line**: 10047
- **Observable**: Fires when any form state changes
- **Handler**: `fireChange()` callback
- **Purpose**: Triggers URL fragment updates and persistence
- **Location**: /home/user/acidome_AI/src/acidome.js:10047

#### Tent Net Line List Computed
- **Lines**: 10262, 10280-10314
- **Triggers on**: tentNetBeginFace, static/advanced line lists
- **Computes**: Complete list of tent net lines
- **Callback**: Subscribes to updates for rendering
- **Location**: /home/user/acidome_AI/src/acidome.js:10262-10314

#### Tent Net Stamp Computed
- **Lines**: 10314
- **Triggers on**: Entire tent net configuration
- **Computes**: Unique identifier/timestamp for changes
- **Purpose**: Triggers re-render when any tent setting changes
- **Location**: /home/user/acidome_AI/src/acidome.js:10314

#### Budget List Observable
- **Line**: 10675
- **What it tracks**: Material budgets (beams, panels, connectors)
- **Updates on**: Product calculation completion
- **Location**: /home/user/acidome_AI/src/acidome.js:10675

### 3.4 localStorage Integration Callbacks

#### Language Persistence
- **Key**: 'i18n' or localStorage key
- **Trigger**: `lang.subscribe()` callback
- **Operation**: `localStorage.setItem(i18n.LOCAL_STORAGE_KEY, lang())`
- **On load**: `localStorage.getItem(i18n.LOCAL_STORAGE_KEY)`
- **Location**: /home/user/acidome_AI/src/acidome.js:7459-7476

#### Strut View Preference
- **Key**: 'acidome.view-strut-by-side'
- **Trigger**: `form.strutViewBySide.subscribe()` callback
- **Operation**: Saves boolean as JSON string
- **On load**: Parsed from localStorage with default 'false'
- **Location**: /home/user/acidome_AI/src/acidome.js:10214-10216

#### Client Email Storage
- **Key**: 'client-email'
- **Trigger**: Form submission or input blur
- **Operation**: `localStorage["client-email"] = email`
- **On load**: `localStorage["client-email"] || ''`
- **Location**: /home/user/acidome_AI/src/acidome.js:12378, 12395

#### Geo-Location Cache
- **Keys**: 'geoDataStorage', 'geoDataExpires'
- **Operation**: Caches geo-location data with 24-hour expiry
- **Check**: `expires > +new Date` before using cached data
- **Location**: /home/user/acidome_AI/src/acidome.js:391-402

---

## SECTION 4: VALIDATION MATRIX

### Parameter Constraints Reference

| Parameter | Min | Max | Type | Default | Constraints | Conditional |
|-----------|-----|-----|------|---------|-------------|-------------|
| base | - | - | enum | 'Icosahedron' | 'Icosahedron' \| 'Octohedron' | - |
| detail | 1 | 5 | int | 3 | [1,2,3,4,5] | - |
| subdivClass | - | - | enum | 'I' | 'I' \| 'II' \| 'III' | detail >= 2 |
| subdivMethod | - | - | enum | 'Kruschke' | 'Chords' \| 'Arcs' \| 'Kruschke' \| 'Mexican' | detail >= 3 && subdivClass === 'I' |
| symmetry | - | - | enum | 'Pentad' | 'Pentad' \| 'Cross' \| 'Triad' | - |
| fullerenType | - | - | enum | 'none' | 'none' \| 'inscribed' \| 'circumscribed' | - |
| radius | 0.1 | ∞ | float | 2.2 | > 0.1 | - |
| partial | - | - | string | '7/12' | See PARTIAL_LIST | - |
| partialHeight | 0 | 1 | float | 0.777 | 0 <= h <= 1 | partialMode === 'height' |
| beamsWidth | 1 | ∞ | int | 120 | >= 1 (mm) | - |
| beamsThickness | 1 | ∞ | int | 40 | >= 1 (mm) | - |
| connectorType | - | - | enum | 'GoodKarma' | 'Piped' \| 'GoodKarma' \| 'Semicone' \| 'Cone' \| 'Joint' | - |
| clockwise | - | - | bool | true | true \| false | - |

### Numeric Tolerances & Epsilon Values

| Check | Epsilon | Purpose | Location |
|-------|---------|---------|----------|
| Zero vector detection | 1e-20 | Prevents div by zero in normalization | Metrics.ts:97 |
| Vector equality | 0.000001 | Floating-point comparison | Metrics.ts:42 |
| Vertex deduplication | 10 decimal places | Prevent duplicate vertices | Figure.ts:93 |
| Convexity check | -1e-9 | Allow for numerical errors in angle checks | acidome.js:1978 |
| Normal vector validity | 1e-9 | Filters invalid normals | acidome.js:1975 |
| Vertex degree calculation | 0.01 units | Tolerance for spatial comparison | Product.ts:73 |
| Beam length rounding | 0.01 m | Groups similar lengths | Product.ts:141 |
| Point-in-plane check | Varies | Geometric validations | acidome.js:1371 |

---

## SECTION 5: ERROR HANDLING & RECOVERY

### 5.1 Error Types & Handling

#### Unknown Base Polyhedron Error
- **Error type**: Throws Error
- **Message**: `Unknown base polyhedron: ${params.base}`
- **Location**: /home/user/acidome_AI/src/core/Figure.ts:419
- **Triggered by**: Invalid base parameter in createFigure()
- **Recovery**: Try-catch in store.calculate() catches and displays to user

#### Calculation Errors (Async)
- **Error location**: store.calculate() try-catch block
- **Triggered by**: Any error in Figure or Product construction
- **Error state**: Sets `error.value = err.message`
- **Display**: Shown in error-message div (line 127-129, App.vue)
- **Recovery**: User can modify parameters and recalculate
- **Location**: /home/user/acidome_AI/src/ui/store/appStore.ts:118-120

#### Vector Calculation Safety
- **Invalid angle inputs**: Clamped to [-1, 1] before acos
- **Zero-length vectors**: normalize() silently returns unchanged
- **Zero divisors**: projectOnto() returns zero vector if target is zero
- **Location**: /home/user/acidome_AI/src/core/Metrics.ts

#### Geolocation Fallback
- **If offline**: Skips geo-fetch
- **If cache expired**: `expires > +new Date` check prevents use
- **Fallback**: Uses default values or empty data
- **Location**: /home/user/acidome_AI/src/acidome.js:395-402

### 5.2 Fallback Behaviors

#### Partial Sphere Parsing
- **If regex doesn't match**: Uses default partialHeight (0.777)
- **If partialMode is 'height'**: Directly uses partialHeight parameter
- **Location**: /home/user/acidome_AI/src/core/Figure.ts:207-217

#### Component Placeholder
- **If no figure calculated**: Shows "Configure and calculate to see preview"
- **Condition**: `v-if="!store.currentFigure"`
- **Location**: /home/user/acidome_AI/src/App.vue:150-152

#### Default Form Values
- **Initial state**: CONFIG.defaultFigure provides sensible defaults
- **Fallback**: All parameters have defaults ensuring valid state
- **Location**: /home/user/acidome_AI/src/utils/config.ts:21-35

#### Observable Unwrapping
- **Fallback in Knockout**: `ko.unwrap()` safely unwraps any observable or plain value
- **Purpose**: Handles both computed and plain values uniformly
- **Location**: /home/user/acidome_AI/src/acidome.js:7512

#### Window Dimension Fallback
- **Multiple fallbacks**: Checks documentElement, body, and window properties
- **Purpose**: Works across different browsers and edge cases
- **Location**: /home/user/acidome_AI/src/acidome.js:1387-1437

---

## SECTION 6: SUMMARY OF CRITICAL FLOWS

### Calculation Flow with Validations
```
User clicks Calculate
  ↓
store.calculate() async action starts
  ├─ Sets isCalculating = true
  ├─ Clears previous errors
  ├─ Calls createFigure(figureParams)
  │   ├─ Validates base parameter (throws if invalid)
  │   ├─ Initializes vertices and edges
  │   ├─ Validates vertex deduplication (tolerance 10 decimals)
  │   ├─ Subdivides geometry based on detail level
  │   ├─ Scales to radius (validates radius > 0)
  │   ├─ If partial !== '1/1':
  │   │   ├─ Parses partial string (X/Y format)
  │   │   ├─ Validates all vertices above cut plane
  │   │   └─ Removes faces crossing cut plane
  │   ├─ If alignTheBase: Aligns base to Y=0
  │   └─ Creates edges from faces
  ├─ Creates Product instance
  │   ├─ Generates panels from faces
  │   ├─ Generates beams from edges (validates beam length rounding)
  │   ├─ Creates connectors (calculates degree with 0.01 tolerance)
  │   └─ Calculates budget (groups by length)
  ├─ Updates currentFigure, currentProduct observables
  ├─ Triggers computed properties:
  │   ├─ geometryStats update
  │   └─ reportText regenerates
  ├─ Catch block: Sets error.value if exception
  └─ Finally: Sets isCalculating = false
```

### UI Update Flow with Form Changes
```
User changes parameter (detail, radius, etc.)
  ↓
@change event fires on input
  ↓
onParamChange() called (currently empty, but could debounce)
  ↓
Vue reactivity updates store properties
  ↓
Computed properties re-evaluate:
  ├─ subdivClassList (if detail changed)
  ├─ subdivMethodList (if detail or class changed)
  └─ Other dependent properties
  ↓
Template updates reflect new options
  ↓
User clicks Calculate to recompute geometry
```

### Parameter Dependency Flow
```
detail level
  ├─ detail >= 2: Enables subdivClass options
  └─ detail >= 3 && subdivClass === 'I': Enables subdivMethod options

subdivClass
  └─ subdivClass === 'I': Enables methods (only with detail >= 3)

radius
  └─ Updates productParams.radius synchronously

partial
  ├─ Format: X/Y for 'faces' mode
  └─ Parsed during Figure initialization

partialMode
  ├─ 'faces': Uses partial string
  └─ 'height': Uses partialHeight value
```

### localStorage Integration Points
```
1. Language Selection:
   - On change: Saves to localStorage[i18n.LOCAL_STORAGE_KEY]
   - On load: Retrieved and restored to form state

2. View Preferences:
   - strutViewBySide: Persists display preference
   - Key: 'acidome.view-strut-by-side' (JSON boolean)

3. User Email:
   - For order form: Stored in localStorage["client-email"]
   - Persists across sessions

4. Geo-location:
   - Cached for 24 hours
   - Keys: 'geoDataStorage', 'geoDataExpires'
   - Checked before re-fetching
```

---

## FILE REFERENCE SUMMARY

**Vue 3 Application Files:**
- /home/user/acidome_AI/src/App.vue (442 lines) - Main UI template, all event handlers
- /home/user/acidome_AI/src/ui/store/appStore.ts (160 lines) - Computed properties, async actions
- /home/user/acidome_AI/src/main.ts (28 lines) - Vue initialization

**Core Geometry:**
- /home/user/acidome_AI/src/core/Figure.ts (422 lines) - Validation, geometric calculations
- /home/user/acidome_AI/src/core/Product.ts (258 lines) - Component generation, budget calc
- /home/user/acidome_AI/src/core/Metrics.ts (250+ lines) - Vector math, tolerances

**Configuration & Types:**
- /home/user/acidome_AI/src/utils/config.ts (153 lines) - Parameter constraints, defaults
- /home/user/acidome_AI/src/types/figure.ts (132 lines) - Type definitions
- /home/user/acidome_AI/src/types/product.ts (128 lines) - Type definitions

**Legacy (Knockout.js):**
- /home/user/acidome_AI/src/acidome.js (12,512 lines) - All legacy event handlers, validations

