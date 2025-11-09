# ACIDOME Lines/Beams Drawing and Measurement System - Complete Analysis

## Overview
The ACIDOME system handles drawing and measuring individual beams/lines through a sophisticated multi-layer architecture combining geometric calculations, canvas rendering, and comprehensive metrics collection.

---

## 1. CORE DATA STRUCTURES

### Beam/Line Interface (TypeScript)
**Location:** `/home/user/acidome_AI/src/types/product.ts`

```typescript
/**
 * Beam/Strut connecting vertices
 */
export interface Beam {
  start: Vector3                    // Starting vertex position
  end: Vector3                      // Ending vertex position
  length: number                    // Calculated beam length
  width: number                     // Beam width (mm) - parallel to radius
  thickness: number                 // Beam thickness (mm)
  color?: string                    // Visual color for rendering
}
```

### Product.Rib.Beam Class (Original acidome.js)
**Location:** `/home/user/acidome_AI/src/acidome.js` lines 5300-5707

```javascript
Product.Rib.Beam = function(params) {
	Product.Rib.apply(this, [{
		type: 'Beam',
		title: 'Брус',
		width: 0,           // ширина бруса (в радиусах) - параллельна радиусу
		thickness: 0,       // толщина
		R: 0                // радиус сферы должен быть известен!
	}, params || {}]);
	
	// Convert to radius fractions
	this.width *= (this.measure || 1) / this.R;
	this.thickness *= (this.measure || 1) / this.R;
}
```

**Key Properties:**
- **width**: Beam width parallel to radius (in radius fractions, converted to actual units)
- **thickness**: Beam thickness/height
- **measure**: Reference measurement for scaling
- **R**: Sphere radius for calculations
- **midLength**: Calculated middle section length
- **maxOuterLength**: Maximum extended length with connectors

---

## 2. MEASUREMENT CALCULATION SYSTEM

### Beam Length Calculations
**Location:** Lines 5421-5447

#### maxLength()
```javascript
maxLength: function(){
    var maxLength = this.midLength;
    this.getTails().each(function(){
        if (_.contains(['Joint', 'GoodKarma', 'Semicone'], this.vertex.product.type))
            maxLength += Math.abs(this.bevelSides[0]);
        maxLength += Math.abs(this.bevelInner);
    });
    return maxLength;
}
```

#### minLength()
```javascript
minLength: function(){
    var minLength = this.midLength;
    this.getTails().each(function(){
        if (_.contains(['Joint', 'GoodKarma', 'Semicone'], this.vertex.product.type))
            minLength -= Math.abs(this.bevelSides[0]);
        minLength -= Math.abs(this.bevelInner);
    });
    return minLength;
}
```

### Tail Calculations (Beam Endpoints)
**Location:** Lines 5317-5352

Calculates endpoint configurations based on connector types:
- **bevelInner**: Inner bevel angle
- **bevelSides**: [left, right] side bevels
- **bevelZero**: Boolean - whether bevels are zero
- **bevelStraight**: Boolean - whether side bevels sum to zero
- **bevelsEquals**: Boolean - whether left equals right
- **bevelChaos**: Boolean - irregular bevel configuration

---

## 3. MEASUREMENT METRICS COLLECTION

### Meter Class - Statistics Accumulator
**Location:** Lines 6405-6539

```javascript
Meter = function(){
    this.values = {};
}
.override({
    push: function(map, context) {
        // Accumulates values with operators (min, max, swing, range, default/sum)
    },
    
    operators: {
        default: function(accum, value) { return (accum || (isNaN(value) ? '' : 0)) + value; },
        min: function(accum, value) { return (accum == undefined) ? value : Math.min(accum, value); },
        max: function(accum, value) { return (accum == undefined) ? value : Math.max(accum, value); },
        swing: function(accum, value) { return { min: ..., max: ... }; },
        range: function(accum, value) { return { min: ..., max: ... }; }
    },
    
    reporters: {
        swing: function(value) { return (value.max || 0) - (value.min || 0); },
        range: function(value) { return (value.max - value.min < 1e-6) ? value.min : [value.min, '-', value.max]; }
    }
});

Meter.numberFormat = function(val){
    // Formats numbers with proper decimal handling
};
```

### Beam Meter Function
**Location:** Lines 5665-5706

```javascript
meter: function(){
    const mat = this.materialName(),
        meter = {};
    
    // Base area calculation (if on edge)
    if (1 === this.line.origin.$super.face.length){
        const facePoints = this.line.origin.$super.face[0].$points.get();
        var pp = this.line.$points.get();
        const ppIndex = pp.map(p => facePoints.indexOf(p));
        if ((ppIndex[0] + 1) % facePoints.length !== ppIndex[1]) {
            pp = pp.reverse();
        }
        meter[__('Base area, m2')] = (pp[0].x * pp[1].z - pp[1].x * pp[0].z) / 2 * this.R * this.R;
    }
    
    meter[mat] = {};
    meter[mat][__('Total length of beams, m')] = this.maxLength() * this.R;
    meter[mat][__('Total volume of beams, m3')] = this.midLength * this.width * this.thickness * this.R * this.R * this.R;
    meter[mat]['range:' + __('Beam length, mm')] = Product.lengthUnify(this.maxLength() * this.R);
    
    // Angle between faces
    var $faces = this.line.origin.$super.face;
    var $normals = $faces.length == 2 ? $faces.map(function(){...}) : false;
    var edgel = $normals ? $normals[0].angleWith($normals[1]) : false;
    if (edgel) {
        meter[mat]['range:' + __('Angle between faces, °')] = 180 - 180 * edgel / Math.PI;
    }
    
    return meter;
}
```

**Measurements Collected:**
- Base area (m²)
- Total length of beams (m)
- Total volume (m³)
- Beam length range (mm)
- Angle between connected faces (degrees)

### Material Naming
**Location:** Lines 5659-5662

```javascript
materialName: function(){
    return __('Beams') + ' ' +
        Math.round(this.width * this.R / .001) + 'x' + 
        Math.round(this.thickness * this.R / .001) + __('mm');
},
```

Example: "Beams 120x40mm"

---

## 4. CANVAS DRAWING SYSTEM

### Plotter Base Class
**Location:** Lines 5713-6000+

Core canvas-based drawing utility with 2D context operations:

```javascript
Plotter = function(canvas, opts){
    this._$canvas = $(canvas);
    this._context = this._$canvas[0].getContext('2d');  // HTML5 Canvas 2D context
    this._width = this._$canvas.width() - (opts.milkRight || 0);
    this._height = this._$canvas.height();
    
    // Canvas style settings
    this._context.lineCap = 'round';
    this._context.lineJoin = 'bevel';
    this._context.miterLimit = 10;
    this._context.globalAlpha = 0.9;
    
    // Predefined styles
    this._styles = {
        solid: { strokeStyle: "black", lineWidth: 2 },
        backside: { strokeStyle: "gray", lineWidth: 2 },
        division: { strokeStyle: "rgba(141,141,141,.5)", lineWidth: 1 },
        white: { strokeStyle: "white", lineWidth: 2 },
        fillWhite: { fillStyle: 'white' }
    };
    
    // Frame calculations (input data space vs output canvas space)
    this._frameIn = { l: 0, t: 0, w: width, h: height };
    this._frameOut = { l: margin, t: margin, w: width - 2*margin, h: height - 2*margin };
    
    // Scale ratios
    this.ratio = { x: frameOut.w / frameIn.w, y: frameOut.h / frameIn.h, l: sqrt(x*y) };
}
```

### Key Plotter Methods

#### line() - Draw a line segment
**Location:** Lines 5879-5906

```javascript
line: function(p1, p2, style, outputXY){
    var ctx = this._context;
    ctx.save();
    this._setStyle('line', style);
    ctx.beginPath();
    
    if (this._dashedLine) {
        // Dashed line algorithm
        var s = outputXY ? p1 : this._plane(p1);
        var f = outputXY ? p2 : this._plane(p2);
        var length = Math.sqrt((s.x - f.x) * (s.x - f.x) + (s.y - f.y) * (s.y - f.y));
        var step = this._dashedStep;
        var v = { x: (f.x - s.x) * step / length, y: (f.y - s.y) * step / length };
        var p = { x: s.x + v.x / 2, y: s.y + v.y / 2 };
        for (var i = 0, l = 0; l < length; i++) {
            this[(i % 2) ? '_lineTo' : '_moveTo'](p);
            l += step;
            p.x += l < length-1 ? v.x : v.x / 2;
            p.y += l < length-1 ? v.y : v.y / 2;
        }
    } else {
        this._moveTo(outputXY ? p1 : this._plane(p1));
        this._lineTo(outputXY ? p2 : this._plane(p2));
    }
    
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    return this;
}
```

#### textByLine() - Position and rotate text along a line
**Location:** Lines 5950-5966

```javascript
textByLine: function(text, A, B, opts) {
    opts = opts || {};
    var pos = this.average(A, B, opts.q || 1/2);  // Position along line (q=0.5 = midpoint)
    var length = Math.sqrt((A.x - B.x)*(A.x - B.x) + (A.y - B.y)*(A.y - B.y));
    var normal = { x: (A.y - B.y) / length, y: (B.x - A.x) / length };  // Perpendicular vector
    
    var rev = (opts.sup && normal.y) ^ opts.otherSide > 0 ? -1 : 1;
    pos.x += rev * normal.x * 10 / this.ratio.x;
    pos.y += rev * normal.y * 10 / this.ratio.y;
    
    var angle = Math.atan2(A.y - B.y, A.x - B.x);
    this.text(pos, text, $.extend({
        rotate: angle < Math.PI/2 ? angle > -Math.PI/2 ? angle : angle + Math.PI : angle - Math.PI,
        fontSize: 0.6
    }, opts));
}
```

**Parameters:**
- **text**: Measurement or label to display
- **A, B**: Start and end points of the line
- **opts.q**: Position ratio (0=start, 0.5=middle, 1=end)
- **opts.sup**: Superscript flag
- **opts.otherSide**: Which side of the line to place text
- **opts.fillStyle, opts.fontSize**: Text styling

#### vertexLabel() - Display vertex index and rib labels
**Location:** Lines 6056-6100

```javascript
vertexLabel: function(index, pos, ribs) {
    this.circle(pos, 3);
    this.text(pos, index);
    // Additional rib labeling logic
}
```

#### circle() - Draw a circle
**Location:** Lines 5909-5925

```javascript
circle: function(pos, r, style){
    pos = this._plane(pos);
    r *= this.ratio.l;
    
    var ctx = this._context;
    ctx.save();
    this._setStyle('circle', style);
    
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
    return this;
}
```

---

## 5. SPECIALIZED BEAM PLOTTER (Plotter.Beam)

**Location:** Lines 6162-6298

Specialized plotter for detailed beam technical drawings:

```javascript
Plotter.Beam = function(canvas, opts){
    Plotter.apply(this, arguments);
    this._frameIn.xmax = opts.length || opts.width;
}
.inherits(Plotter)
.override({
    start: function(product, tail) {
        // Initialize offset based on bevel configuration
        this._offset = { x: calculatedOffset, y: 0 };
        this._left = [null, null];
        this._right = [null, null];
        return this;
    },
    
    tail: function(tail, turnMe, whichSide, product) {
        // Draws beam endpoint with all bevels, angles, and dimensions
        var outerCenter = { x: -TURN * tail.bevelInner, y: this._frameIn.h / 2 };
        var innerCenter = { x: TURN * tail.bevelInner, y: this._frameIn.h / 2 };
        
        // Draw bevel lines with proper angle calculations
        for (var i = 0; i < 2; i++){
            var outerBevel = { x: outerCenter.x + TURN * tail.bevelSides[i], y: TOP ? 0 : this._frameIn.h };
            var innerBevel = { x: innerCenter.x + TURN * tail.bevelSides[i], y: TOP ? 0 : this._frameIn.h };
            
            this.line(outerCenter, outerBevel, 'solid');
            this.line(innerCenter, innerBevel, 'dashed');
            
            // Calculate and display angles between cutting planes
            var byOuter = new Vector(outerBevel.x - outerCenter.x, ...);
            var toInner = new Vector(innerCenter.x - outerCenter.x, ..., this.depth);
            var normalCut = Vector.crossProduct(byOuter, toInner);
            
            var angleToOuter = normalCut.angleWith(normalOuter) * 180 / Math.PI;
            this.textByLine('∟' + angleToOuter + '°', pp[0], pp[1], {...});
        }
        
        // Vertex label with connected ribs count
        this.vertexLabel(tail.vertex.index, outerCenter, tail.vertex.$super.line);
        
        return this;
    },
    
    end: function(){
        // Draw top and bottom edges
        this.line({ x: this._left[1], y: 0 }, { x: this._right[1], y: 0 }, 'solid');
        this.line({ x: this._left[0], y: this._frameIn.h }, { x: this._right[0], y: this._frameIn.h }, 'solid');
        return this;
    }
});
```

**Plotter.Beam Parameters:**
- **depth**: Thickness (displayed as height/vertical dimension)
- **width**: Total length of drawing
- **height**: Beam width (displayed as horizontal dimension)
- **length**: Maximum extended length with connectors

**Rendering Output:**
- Technical schematic drawing of beam cross-section
- Bevel angles with degree measurements
- Vertex index labels
- Dashed lines for hidden edges
- Angle annotations at connector interfaces

---

## 6. TRIANGLE PLOTTER (Plotter.Triangle)

**Location:** Lines 6304-6395

Renders face/panel technical drawings:

```javascript
Plotter.Triangle = function(canvas, opts){
    var angles = this.angles = opts.angles;
    var radiuses = this.radiuses = opts.radiuses;
    this.$lines = opts.$lines;  // Array of line objects with order/index
    
    // Calculate triangle vertices using circumradii
    var ABC = [];
    for (var i = 0; i < 3; i++) {
        ABC[i] = {
            x: radiuses[i] * Math.cos(angle),
            y: radiuses[i] * Math.sin(angle)
        }
        angle -= 2 * angles[(i + 2) % 3];
    }
    
    // Calculate height bases
    var ABCh = [];
    for (var a = 0; a < 3; a++) {
        ABCh[a] = Vector.project(...).add(ABC[c]);  // Perpendicular foot
    }
}
.override({
    triangle: function(){
        for (var i = 0; i < 3; i++) {
            var A = this.ABC[i], B = this.ABC[(i + 1) % 3], C = this.ABC[(i + 2) % 3];
            var Ah = this.ABCh[i];
            
            // Draw edges with color by line order
            this.line(B, C, {
                strokeStyle: productPalette.line[this.$lines[i].order].css,
                lineWidth: 3
            });
            
            // Draw height construction line
            this.line(A, Ah, { strokeStyle: '#bbb' });
            
            // Label edge segments with measurements
            this.textByLine(Product.lengthUnify(this.distance(B, Ah)), B, Ah, { q:.38 });
            this.textByLine(Product.lengthUnify(this.distance(Ah, C)), Ah, C, { q:.62 });
            
            // Label edge with index and angle
            var edge = Math.round(this.abcEdges[i] * 180 * 10 / Math.PI) / 10;
            this.textByLine(this.$lines[i].index + '  ∟' + edge + '°', B, C, {
                fontSize: 0.9,
                fillStyle: productPalette.line[this.$lines[i].order].css
            });
        }
        return this;
    },
    
    vertexes: function(){
        // Label vertices with index and number of ribs
        for (var i = 0; i < 3; i++) {
            var n = 2 - i;  // Account for array direction mismatch
            plotter.vertexLabel(plotter.$vertexes[n].index, this, plotter.$vertexes[n].$super.line);
        }
    }
});
```

**Triangle Rendering Shows:**
- Edge lengths (divided into segments)
- Edge indices (A, B, C, ...)
- Edge angles (degrees)
- Vertex labels with connector information
- Height construction lines

---

## 7. BEAM INDEXING AND LABELING

### Index Assignment
**Location:** Product.ts lines 3479-3484

```javascript
index: function(type, order) {
    if (type == 'line')
        return (order >= 26 ? Product.index(type, Math.floor(order / 26) - 1) : '') + 
               Product.characters[order % 26];
    else
        return order + 1;
},

characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')  // For lines: A, B, C, ..., Z, AA, AB, ...
```

**Indexing System:**
- Single letters (A-Z) for beams 0-25
- Double letters (AA-AZ, BA-BZ) for beams 26+
- Numeric indices (1, 2, 3...) for faces and vertices

### Measurement Labels on Drawing

Each beam drawing includes:
1. **Beam Index**: Letter designation (A, B, C, etc.)
2. **Measurements**:
   - Segment lengths in mm
   - Bevel angles in degrees
   - Height/width dimensions
3. **Vertex Labels**: Connected vertex indices and rib counts
4. **Connector Angles**: Joint cutting plane angles

Example label on drawing:
```
A  ∟15.2°        (edge A with dihedral angle 15.2°)
    450          (distance segment 450mm)
     V0          (vertex 0)
```

---

## 8. LENGTH PRECISION AND UNIFICATION

### Length Unification System
**Location:** Lines 3588-3590

```javascript
LENGTH_PRECISION: 0.001,  // 1 mm precision

lengthUnify: function(length){
    return Math.round(length / Product.LENGTH_PRECISION);
}
```

### Number Formatting
**Location:** Lines 6528-6539

```javascript
Meter.numberFormat = function(val){
    if (!val) return '';
    var val100 = Math.round(val / 0.01);
    return Math.floor(val100 / 100) + (
        ((val100 % 100) ? 
            '.' + (((val100 % 100) < 10 ? '0' : '')) + (val100 % 100)
        : '')
    );
}
```

Formats: 1.25, 1.50, 2.00, etc. with proper decimal places

---

## 9. MODERN TYPESCRIPT IMPLEMENTATION

**Product.ts** (Lines 38-66) - Beam Generation:

```typescript
/**
 * Generate physical components from figure geometry
 */
private generateFromFigure(): void {
    this.panels = []
    this.beams = []
    this.connectors = []

    // Create beams from edges
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

    // Create connectors from vertices
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
```

---

## 10. KEY MEASUREMENT PROPERTIES

### Beam Properties Extracted:

| Property | Source | Calculation |
|----------|--------|-------------|
| **length** | Edge endpoints | `distance(start, end)` |
| **width** | Material spec | User parameter in mm |
| **thickness** | Material spec | User parameter in mm |
| **midLength** | Tail calculation | Distance between tail midpoints |
| **maxLength** | getTails() | midLength + bevels (extended) |
| **minLength** | getTails() | midLength - bevels (shortest) |
| **bevelInner** | Tail calculation | Inner cutting angle |
| **bevelSides[0,1]** | Tail calculation | Left and right side bevels |
| **volume** | Formula | midLength × width × thickness × R³ |
| **material** | materialName() | "Beams XxYmm" format |

### Reference Dimensions Displayed:

1. **On Edge (Beam Drawing):**
   - Outer bevel angle (degrees)
   - Inner bevel offset
   - Side bevel angles
   - Vertex indices
   - Rib counts

2. **On Face (Triangle Drawing):**
   - Edge index letter
   - Edge length segments
   - Dihedral angle
   - Vertex indices
   - Edge measurement points

3. **In Meter Report:**
   - Total beam length (m)
   - Total volume (m³)
   - Beam length range (mm)
   - Face angle (degrees)
   - Base area (m²)

---

## 11. COORDINATE SYSTEMS

### Data Space to Canvas Space Mapping
**Location:** Lines 5843-5861

```javascript
_plane: function(p, offset){
    var plotter = this;
    var xGapDelta = 0;
    // Handle x-gaps for breaks in drawing
    $(this.xGaps).each(function(){
        if (plotter._offset.x + p.x > this.x + this.from)
            xGapDelta += this.to - this.from;
    });
    return {
        x: Math.round(
            this._frameOut.l +
            ((this._offset.x + p.x + xGapDelta) - this._frameIn.l) * 
            this._frameOut.w / this._frameIn.w +
            (offset && offset.x || 0)
        ),
        y: Math.round(
            this._frameOut.t +
            ((this._offset.y + p.y) - this._frameIn.t) * 
            this._frameOut.h / this._frameIn.h +
            (offset && offset.y || 0)
        )
    };
}
```

Maps from:
- **Input frame**: Geometric data coordinates
- **Output frame**: Canvas pixel coordinates
- **Ratio**: Scale factors (x and y independently, plus uniform `l`)

---

## SUMMARY

The ACIDOME line/beam drawing system works through:

1. **Geometry**: Figure extracts edges as potential beam locations
2. **Product**: Creates Beam objects with position (start/end), dimension (width/thickness), and length
3. **Calculation**: Computes beam properties including bevels, connector offsets, and total lengths
4. **Measurement**: Meter class accumulates statistics and formats numbers
5. **Rendering**: Plotter classes draw technical schematics with:
   - Lines for beam edges and construction
   - Text labels for measurements and indices
   - Circles for vertices
   - Angle annotations
6. **Output**: Generates technical drawings showing all dimensions, angles, and specifications needed for manufacturing

Each beam is indexed (A, B, C, ..., AA, AB, ...) and labeled with complete measurement information for accurate fabrication.

