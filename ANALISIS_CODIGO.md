# Análisis en Profundidad del Código ACIDOME

**Calculadora de Domos Geodésicos - Acidome.ru**

---

## Índice

1. [Información General](#información-general)
2. [Arquitectura General](#arquitectura-general)
3. [Bibliotecas de Terceros](#bibliotecas-de-terceros)
4. [Código Personalizado](#código-personalizado)
5. [Algoritmos Geodésicos](#algoritmos-geodésicos)
6. [Estructura de Datos](#estructura-de-datos)
7. [Flujo de Ejecución](#flujo-de-ejecución)
8. [Fórmulas Matemáticas](#fórmulas-matemáticas)
9. [Características Especiales](#características-especiales)
10. [Conclusiones](#conclusiones)

---

## Información General

### Archivo Analizado

**Nombre:** `ACIDOME_CALC_251007$7_12_Kruschke_GoodKarma_3V_R2.20_beams_120x40.html`

**Especificaciones:**
- **Líneas de código:** 15,889
- **Tamaño:** 1.3 MB
- **Formato:** HTML con JavaScript y CSS embebidos
- **Tipo:** Aplicación web autónoma (single-page application)

### Propósito

Calculadora interactiva para el diseño y construcción de domos geodésicos que permite:
- Calcular geometría esférica basada en icosaedros/octaedros
- Subdividir frecuencias geodésicas (1V, 2V, 3V, 4V, etc.)
- Generar listas de materiales (vigas, paneles, conectores)
- Visualizar en 3D la estructura
- Exportar patrones de corte para fabricación

---

## Arquitectura General

### Estructura del Archivo

El archivo es un **documento HTML monolítico** que contiene:

```
HTML Document
├── <head>
│   ├── <style> CSS embebido (líneas 986-2100)
│   └── <meta> metadatos y configuración
├── <body>
│   ├── Estructura HTML del formulario y UI
│   ├── <canvas> elemento para renderizado 3D
│   └── <script> JavaScript (líneas 2149-15888)
│       ├── Bibliotecas de terceros minificadas
│       ├── Google Analytics (líneas 144-2148)
│       ├── Three.js (líneas 2200-3100)
│       ├── jQuery (líneas 2149-2375)
│       ├── Knockout.js
│       ├── Underscore.js/Lodash
│       └── Código personalizado (líneas 3100-15888)
└── </body>
```

### Patrón de Diseño

**Arquitectura:** MVVM (Model-View-ViewModel) con separación de responsabilidades

```
┌─────────────────────────────────────────────────────────┐
│                     PRESENTACIÓN                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   HTML/DOM   │  │  Knockout.js │  │   Three.js   │  │
│  │  Formulario  │◄─┤  Data Binding│◄─┤  Renderizado │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │
┌─────────────────────────────────────────────────────────┐
│                    LÓGICA DE NEGOCIO                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Figure    │  │   Product    │  │    Viewer    │  │
│  │  (Geometría) │─►│(Componentes) │─►│(Visualización│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │
┌─────────────────────────────────────────────────────────┐
│                      CAPA DE DATOS                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Vector    │  │  Primitives  │  │   Settings   │  │
│  │ (Matemáticas)│  │ (Vertex/Line)│  │ (Parámetros) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Bibliotecas de Terceros

### 1. Three.js - Biblioteca de Gráficos 3D

**Ubicación:** Líneas 2200-3100 (aproximadamente)
**Versión:** No especificada explícitamente (versión antigua, pre-r100)
**Estado:** Minificada e integrada en el HTML

#### Componentes Utilizados:

| Componente | Líneas | Propósito |
|------------|--------|-----------|
| `THREE.Vector2` | 2372-2377 | Vectores 2D para UVs y coordenadas de textura |
| `THREE.Vector3` | 2378-2393 | Vectores 3D para posiciones espaciales |
| `THREE.Vector4` | 2394-2403 | Vectores 4D para colores RGBA |
| `THREE.Quaternion` | 2365-2372 | Rotaciones en 3D |
| `THREE.Matrix3` | 2418-2422 | Transformaciones 2D y normales |
| `THREE.Matrix4` | 2423-2432 | Transformaciones 3D completas |
| `THREE.Color` | 2352-2365 | Colores RGB/HSL |
| `THREE.Scene` | 11725 | Contenedor de objetos 3D |
| `THREE.Camera` | 11722-11723 | Cámara perspectiva |
| `THREE.Geometry` | 2497-2500 | Geometrías personalizadas |
| `THREE.Face3` / `THREE.Face4` | - | Caras triangulares/cuadradas |
| `THREE.Mesh` | - | Objetos renderizables |
| `THREE.Line` | - | Líneas 3D |
| `THREE.CanvasRenderer` | 11728 | Renderizador basado en Canvas 2D |
| `THREE.IcosahedronGeometry` | 2979 | Geometría de icosaedro |

#### Características Importantes:

```javascript
// Uso de CanvasRenderer (antiguo) en lugar de WebGLRenderer
renderer = new THREE.CanvasRenderer({
    canvas: $canvas[0],
    antialias: true
});

// Cámara perspectiva con FOV de 30°
camera = new THREE.PerspectiveCamera(30, canvasW / canvasH, 10, 1e+5);
```

**Nota:** El uso de `CanvasRenderer` indica una versión antigua de Three.js (anterior a r100, donde fue deprecado). Esto sugiere compatibilidad con navegadores antiguos sin soporte WebGL.

---

### 2. jQuery - Manipulación DOM

**Ubicación:** Líneas 2149-2375
**Versión:** No especificada
**Estado:** Minificada

#### Uso Principal:

- Selección y manipulación de elementos DOM
- Manejo de eventos (click, change, etc.)
- Animaciones y efectos
- AJAX para posibles cargas externas
- Utilidades (each, map, extend)

#### Ejemplos en el Código:

```javascript
// Selección de canvas
$canvas = $('canvas.preview');

// Colecciones de primitivas usando jQuery
figure.$points = $([punto1, punto2, ...]);
figure.$primitives = $([primitive1, primitive2, ...]);

// Iteración
figure.$primitives.each(function() { ... });
```

---

### 3. Knockout.js - Data Binding MVVM

**Ubicación:** Integrado en el código
**Propósito:** Sincronización bidireccional entre UI y modelo de datos

#### Observables Identificados:

```javascript
FigureOptionsVM = {
    base: ko.observable('Icosahedron'),
    detail: ko.observable(3),              // Frecuencia V
    partialMode: ko.observable('faces'),
    partial: ko.observable('7/12'),        // Fracción del domo
    radius: ko.observable('2.20'),         // Radio en metros
    beamsWidth: ko.observable(120),        // Ancho de vigas (mm)
    beamsThickness: ko.observable(40)      // Espesor de vigas (mm)
}
```

#### Flujo de Datos:

```
Usuario modifica input en HTML
         ↓
Knockout actualiza observable
         ↓
Evento 'change' disparado
         ↓
Recalcula geometría
         ↓
Actualiza visualización 3D
```

---

### 4. Underscore.js / Lodash - Programación Funcional

**Ubicación:** Integrado en el código
**Propósito:** Manipulación de colecciones y utilidades funcionales

#### Métodos Utilizados:

| Método | Uso en el Código |
|--------|------------------|
| `_.map()` | Transformación de arrays (puntos, primitivas) |
| `_.each()` | Iteración sobre colecciones |
| `_.filter()` | Filtrado de primitivas por tipo |
| `_.reduce()` | Agregación de valores |
| `_.sortBy()` | Ordenamiento de vigas por longitud |
| `_.chain()` | Encadenamiento de operaciones |
| `_.uniq()` | Eliminación de duplicados |
| `_.flatten()` | Aplanamiento de arrays anidados |

#### Ejemplo:

```javascript
// Clasificación de vigas por longitud
var beamGroups = _.chain(figure.$primitives)
    .filter(p => p.type === 'line')
    .map(p => p.product)
    .sortBy('length')
    .groupBy('lengthGroup')
    .value();
```

---

### 5. Backbone.js - Sistema de Eventos

**Ubicación:** Integrado en el código
**Uso:** Implementación de patrón Observer

#### Implementación:

```javascript
// Mixin de eventos en objetos personalizados
_.extend(Figure.prototype, Backbone.Events);
_.extend(Product.prototype, Backbone.Events);

// Escucha de eventos
figure.on('change', function() {
    viewer.render(figure);
});

// Disparo de eventos
figure.trigger('change:geometry');
```

---

### 6. Google Analytics - Seguimiento

**Ubicación:** Líneas 144-2148, 15871-15888
**ID de seguimiento:** UA-7847979-1
**Versión:** Google Tag Manager (gtag.js)

#### Implementación:

```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-7847979-1');
```

---

## Código Personalizado

### 1. Clase `Vector` - Vectores 3D Matemáticos

**Propósito:** Implementación propia de álgebra vectorial 3D
**Ubicación:** Distribuido a lo largo del código

#### Estructura:

```javascript
Vector = function(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
```

#### Métodos Principales:

| Método | Fórmula | Propósito |
|--------|---------|-----------|
| `add(v)` | `(x+vx, y+vy, z+vz)` | Suma vectorial |
| `subtract(v)` | `(x-vx, y-vy, z-vz)` | Resta vectorial |
| `scale(s)` | `(sx, sy, sz)` | Escalado |
| `length()` | `√(x²+y²+z²)` | Magnitud del vector |
| `normalize()` | `v / \|v\|` | Vector unitario |
| `dotProduct(v)` | `x·vx + y·vy + z·vz` | Producto punto |
| `crossProduct(v)` | `(y·vz - z·vy, ...)` | Producto cruz |
| `angleTo(v)` | `arccos(dot(v) / (\|this\|·\|v\|))` | Ángulo entre vectores |
| `distanceTo(v)` | `\|this - v\|` | Distancia euclidiana |

#### Ejemplo de Uso:

```javascript
var a = new Vector(1, 0, 0);
var b = new Vector(0, 1, 0);

var c = a.crossProduct(b);  // (0, 0, 1)
var angle = a.angleTo(b);    // π/2 (90 grados)
var normalized = a.normalize(); // (1, 0, 0)
```

---

### 2. Clase `Figure` - Representación de Figuras Geométricas

**Propósito:** Clase base para todas las figuras geodésicas
**Ubicación:** Línea ~4700
**Herencia:** `Figure` → `Figure.Icosahedron`, `Figure.Octohedron`

#### Estructura de Datos:

```javascript
Figure = function(options) {
    this.type = 'figure';           // Tipo de primitiva
    this.$points = $([]);           // jQuery collection de Vector
    this.$primitives = $([]);       // Collection de Figure (sub-primitivas)
    this.$sub = {                   // Primitivas contenidas
        vertex: [],
        line: [],
        face: []
    };
    this.$super = {                 // Primitivas contenedoras
        line: [],
        face: []
    };
    this.product = null;            // Producto asociado (Beam/Polygon)
}
```

#### Jerarquía de Tipos:

```
Figure (base)
├── 'vertex'       → Vértice/nodo (0D)
├── 'line'         → Arista/viga (1D)
├── 'face'         → Cara/panel (2D)
├── 'Icosahedron'  → Poliedro base
└── 'Octohedron'   → Poliedro base alternativo
```

#### Métodos Principales:

##### `relations()` - Línea 5020

**Propósito:** Establece relaciones jerárquicas bidireccionales entre primitivas

**Algoritmo:**

```javascript
relations: function() {
    // 1. Para cada cara, agregar referencias a sus líneas y vértices
    this.$primitives.filter('[type="face"]').each(function() {
        var face = this;
        face.$sub.line = /* aristas de la cara */;
        face.$sub.vertex = /* vértices de la cara */;
    });

    // 2. Para cada línea, agregar referencias a caras que la contienen
    this.$primitives.filter('[type="line"]').each(function() {
        var line = this;
        line.$super.face = /* caras que contienen esta línea */;
        line.$sub.vertex = /* 2 vértices extremos */;
    });

    // 3. Para cada vértice, agregar líneas y caras convergentes
    this.$primitives.filter('[type="vertex"]').each(function() {
        var vertex = this;
        vertex.$super.line = /* líneas que parten de este vértice */;
        vertex.$super.face = /* caras que contienen este vértice */;
    });
}
```

**Ejemplo de Resultado:**

```
Face #1 (triángulo)
├─ $sub.vertex: [V1, V2, V3]
├─ $sub.line: [L1(V1-V2), L2(V2-V3), L3(V3-V1)]
└─ product: Polygon

Line #1 (V1-V2)
├─ $sub.vertex: [V1, V2]
├─ $super.face: [Face#1, Face#2]  ← compartida por 2 caras
└─ product: Beam

Vertex #1
├─ $super.line: [L1, L3, L5, L7, L9]  ← 5 líneas convergen (vértice de grado 5)
└─ $super.face: [Face#1, Face#2, ...]
```

---

##### `splitFaces(N)` - Línea 5114

**Propósito:** Subdivisión geodésica de frecuencia N

**Parámetros:**
- `N` (integer): Frecuencia geodésica (1V, 2V, 3V, etc.)

**Algoritmo:**

```javascript
splitFaces: function(N) {
    var originalFaces = this.$primitives.filter('[type="face"]');

    originalFaces.each(function() {
        var face = this;  // Triángulo [A, B, C]
        var newPoints = [];
        var newFaces = [];

        // Para cada triángulo, crear N² subtriángulos
        for (var i = 0; i <= N; i++) {
            for (var j = 0; j <= N - i; j++) {
                // Calcular punto en la grid triangular
                var point = interpolate_spherical(A, B, C, i/N, j/N);
                newPoints.push(point);
            }
        }

        // Crear nuevos triángulos conectando puntos
        for (var row = 0; row < N; row++) {
            // Triángulos apuntando hacia arriba ▲
            // Triángulos apuntando hacia abajo ▼
        }

        // Eliminar cara original
        face.remove();

        // Agregar nuevas caras
        this.$primitives = this.$primitives.add(newFaces);
    });
}
```

**Proyección Esférica:**

Cada punto interpolado se proyecta a la esfera:

```javascript
function interpolate_spherical(A, B, C, u, v) {
    // Interpolación lineal en el triángulo plano
    var point = A.scale(1 - u - v)
                  .add(B.scale(u))
                  .add(C.scale(v));

    // Proyección a esfera unitaria
    point = point.normalize();

    // Escalado al radio deseado
    return point.scale(radius);
}
```

**Ejemplo Visual:**

```
Triángulo original (1V):
    A
   / \
  /   \
 B─────C

Subdivisión 2V (4 triángulos):
    A
   /|\
  / | \
 D──E──F
  \ | /
   \|/
    B─────C

Subdivisión 3V (9 triángulos):
    A
   /│\
  / │ \
 G──H──I
 │\ │ /│
 │ \│/ │
 J──K──L
  \ │ /
   \│/
 B──M──N──C
```

**Resultado:**
- Entrada: `N` caras originales
- Salida: `N × V²` caras subdivididas
- Cada cara genera `V²` sub-caras

---

##### `safeRemoveMember()` - Línea 4760

**Propósito:** Eliminación segura de primitivas manteniendo integridad de relaciones

```javascript
safeRemoveMember: function(primitive) {
    // 1. Eliminar de colecciones padre
    this.$primitives = this.$primitives.not(primitive);

    // 2. Actualizar referencias en primitivas relacionadas
    primitive.$super.face.each(function() {
        this.$sub.line = this.$sub.line.not(primitive);
    });

    // 3. Liberar memoria
    primitive.$points = $([]);
    primitive.$sub = null;
    primitive.$super = null;
}
```

---

##### `safeRemoveFaceLine()` - Línea 4828

**Propósito:** Fusión de caras al eliminar una arista compartida

**Caso de Uso:** Cuando se corta el domo, las caras en el borde se fusionan en polígonos más grandes

```javascript
safeRemoveFaceLine: function(line) {
    var faceA = line.$super.face[0];
    var faceB = line.$super.face[1];

    if (faceA && faceB) {
        // Fusionar faceA y faceB en un polígono
        var mergedPoints = merge_without_duplicates(
            faceA.$points,
            faceB.$points
        );

        var newFace = new Figure({
            type: 'face',
            $points: $(mergedPoints)
        });

        // Eliminar caras originales y línea compartida
        this.safeRemoveMember(faceA);
        this.safeRemoveMember(faceB);
        this.safeRemoveMember(line);

        // Agregar nueva cara fusionada
        this.$primitives = this.$primitives.add(newFace);
    }
}
```

**Ejemplo Visual:**

```
Antes (2 triángulos):
  A────B
  │\ 1 │
  │ \  │
  │  \ │
  │ 2 \│
  D────C

Después de eliminar línea A-C:
  A────B
  │    │
  │ 1' │  ← Cuadrilátero fusionado
  │    │
  D────C
```

---

##### `isFaceConvex()` - Línea 4916

**Propósito:** Detectar si un polígono es convexo

**Algoritmo:** Verifica que todos los ángulos internos sean < 180°

```javascript
isFaceConvex: function() {
    var points = this.$points.get();
    var n = points.length;
    var normals = [];

    for (var i = 0; i < n; i++) {
        var prev = points[(i - 1 + n) % n];
        var curr = points[i];
        var next = points[(i + 1) % n];

        // Vectores de aristas consecutivas
        var v1 = curr.subtract(prev);
        var v2 = next.subtract(curr);

        // Normal (producto cruz)
        var normal = v1.crossProduct(v2);
        normals.push(normal);
    }

    // Verificar que todas las normales apunten en la misma dirección
    var firstNormal = normals[0];
    return _.every(normals, function(n) {
        return n.dotProduct(firstNormal) > -ε;
    });
}
```

**Interpretación:**
- Si todas las normales apuntan en la misma dirección → **convexo**
- Si alguna normal apunta en dirección opuesta → **cóncavo**

---

##### `detectSelvage()` - Línea 5083

**Propósito:** Detectar bordes perimetrales (selvage) del domo

**Uso:** Identificar aristas que solo pertenecen a una cara (borde exterior)

```javascript
detectSelvage: function() {
    this.$primitives.filter('[type="line"]').each(function() {
        var line = this;

        // Una línea es borde si solo tiene 1 cara adyacente
        if (line.$super.face.length === 1) {
            line.isSelvage = true;
            line.selvageFace = line.$super.face[0];
        } else {
            line.isSelvage = false;
        }
    });
}
```

**Ejemplo:**

```
     1────2────3
     │\   │   /│
     │ \  │  / │
     │  \ │ /  │
     4────5────6
      \   │   /
       \  │  /
        \ │ /
         \│/
          7

Líneas internas:  1-5, 2-5, 3-5, 4-5, 5-6 (2 caras cada una)
Líneas de borde:  1-2, 2-3, 3-6, 6-7, 7-4, 4-1 (1 cara cada una) ← SELVAGE
```

---

### 3. Clase `Figure.Icosahedron` - Icosaedro Base

**Ubicación:** Líneas 6194-6284
**Propósito:** Generación del poliedro base para domos geodésicos
**Herencia:** `Figure.Icosahedron extends Figure`

#### Propiedades del Icosaedro:

| Propiedad | Valor |
|-----------|-------|
| Vértices | 12 |
| Aristas | 30 |
| Caras | 20 (triángulos equiláteros) |
| Simetría | Icosaédrica (grupo Ih) |
| Ángulos diedros | ~138.19° |

#### Algoritmo de Construcción:

##### Paso 1: Cálculo de Coordenadas (Golden Ratio)

```javascript
Figure.Icosahedron = function(options) {
    // Número áureo: φ = (1 + √5) / 2 ≈ 1.618
    var phi = (1 + Math.sqrt(5)) / 2;

    // Normalización para esfera unitaria
    var a = 4 / Math.sqrt(2 * (5 + Math.sqrt(5))) / 2;
    var b = Math.sqrt(1 - a*a);

    // a ≈ 0.525731
    // b ≈ 0.850651
}
```

##### Paso 2: 12 Vértices en Configuración Simétrica

```javascript
var points = [
    // Rectángulo en plano XZ (y = 0)
    new Vector(-a, 0,  b),  // 0
    new Vector( a, 0,  b),  // 1
    new Vector(-a, 0, -b),  // 2
    new Vector( a, 0, -b),  // 3

    // Rectángulo en plano YZ (x = 0)
    new Vector(0,  b,  a),  // 4
    new Vector(0,  b, -a),  // 5
    new Vector(0, -b,  a),  // 6
    new Vector(0, -b, -a),  // 7

    // Rectángulo en plano XY (z = 0)
    new Vector( b,  a, 0),  // 8
    new Vector(-b,  a, 0),  // 9
    new Vector( b, -a, 0),  // 10
    new Vector(-b, -a, 0)   // 11
];
```

**Visualización:**

```
          5 (top-back)
          |
    9 ----+---- 8
   /      4      \
  /    (top)      \
 2-------+---------3
 |       |         |
 |       +         |  ← Eje Y
 |      0,1        |
11-------+---------10
  \      6      /
   \  (bottom) /
    ----7-----
   (bottom-back)
```

##### Paso 3: 20 Caras Triangulares

```javascript
var faces = [
    // Pentágono superior (5 caras alrededor del vértice 4)
    [0, 4, 1],
    [1, 4, 8],
    [8, 4, 5],
    [5, 4, 9],
    [9, 4, 0],

    // Cinturón medio (10 caras)
    [0, 1, 6],
    [1, 8, 10],
    [8, 3, 10],
    [8, 5, 3],
    [5, 2, 3],
    [5, 9, 2],
    [9, 11, 2],
    [9, 0, 11],
    [0, 6, 11],
    [1, 10, 6],

    // Pentágono inferior (5 caras alrededor del vértice 7)
    [6, 10, 7],
    [10, 3, 7],
    [3, 2, 7],
    [2, 11, 7],
    [11, 6, 7]
];
```

##### Paso 4: Generación de Aristas (sin duplicados)

```javascript
var lines = [];
var lineHash = {};  // Para evitar duplicados

faces.forEach(function(face) {
    var [a, b, c] = face;

    // 3 aristas por cara
    addLineIfUnique(a, b);
    addLineIfUnique(b, c);
    addLineIfUnique(c, a);
});

function addLineIfUnique(i, j) {
    // Normalizar orden (menor primero)
    var key = i < j ? i + '-' + j : j + '-' + i;

    if (!lineHash[key]) {
        lineHash[key] = true;
        lines.push(new Figure({
            type: 'line',
            $points: $([points[i], points[j]])
        }));
    }
}
```

#### Simetrías Soportadas:

##### 1. Pentad (Pentagonal)

**Eje:** Y (vertical)
**Configuración:** Pentágono en el polo superior/inferior

```javascript
symmetry: 'Pentad',
axis: 'y'  // Eje de rotación de 5 veces
```

**Uso:** Típico para domos geodésicos estándar (5 vértices en el apex)

##### 2. Cross (Cruzada)

**Eje:** Diagonal
**Configuración:** Simetría de 2 ejes perpendiculares

```javascript
symmetry: 'Cross',
axis: /* diagonal */
```

##### 3. Triad (Triangular)

**Eje:** Cara a cara
**Configuración:** Triángulo en el polo

```javascript
symmetry: 'Triad',
axis: /* normal a cara */
```

**Uso:** Domos geodésicos con vértice triangular en el apex (3 vértices)

---

### 4. Clase `Figure.Octohedron` - Octaedro Base

**Propósito:** Forma base alternativa al icosaedro

#### Propiedades:

| Propiedad | Valor |
|-----------|-------|
| Vértices | 6 |
| Aristas | 12 |
| Caras | 8 (triángulos equiláteros) |

#### Coordenadas:

```javascript
var points = [
    new Vector( 1,  0,  0),  // +X
    new Vector(-1,  0,  0),  // -X
    new Vector( 0,  1,  0),  // +Y
    new Vector( 0, -1,  0),  // -Y
    new Vector( 0,  0,  1),  // +Z
    new Vector( 0,  0, -1)   // -Z
];
```

---

### 5. Clase `Product` - Componentes Constructivos

**Ubicación:** Líneas 6398-6549
**Propósito:** Abstracción de elementos físicos del domo

#### Jerarquía de Productos:

```
Product (base abstracta)
├── Product.Beam        → Vigas estructurales
├── Product.Polygon     → Paneles/caras
│   ├── Polygon.Simple  → Polígonos planos simples
│   └── Polygon.Complex → Polígonos con curvaturas
└── Product.Connector   → Conectores de unión
    ├── Connector.GoodKarma
    ├── Connector.Kruschke
    └── Connector.Piped
```

#### Clase Base `Product`:

```javascript
Product = function(options) {
    this.type = null;           // 'beam', 'polygon', 'connector'
    this.primitive = null;      // Referencia a Figure primitive
    this.quantity = 1;          // Cantidad de este producto
    this.label = '';            // Etiqueta (A, B, C, ...)
    this.cache = {};            // Cache de cálculos
}

Product.prototype = {
    calculate: function() {
        // Calcular propiedades (implementado por subclases)
    },

    unify: function(products) {
        // Agrupar productos idénticos
    },

    render: function(scene) {
        // Renderizar en Three.js
    }
}
```

---

#### Subclase `Product.Beam` - Vigas

**Propósito:** Representación de vigas estructurales (aristas del domo)

```javascript
Product.Beam = function(line) {
    Product.call(this);
    this.type = 'beam';
    this.primitive = line;      // Figure con type='line'

    // Propiedades geométricas
    this.length = 0;            // Longitud en metros
    this.width = 0;             // Ancho en mm
    this.thickness = 0;         // Espesor en mm

    // Ángulos de corte
    this.angleA = 0;            // Ángulo en extremo A
    this.angleB = 0;            // Ángulo en extremo B

    // Clasificación
    this.lengthGroup = '';      // 'A', 'B', 'C', etc.
}
```

##### Método `calculate()`:

```javascript
Product.Beam.prototype.calculate = function() {
    var pointA = this.primitive.$points[0];
    var pointB = this.primitive.$points[1];

    // 1. Calcular longitud
    this.length = pointA.distanceTo(pointB) * radius;

    // 2. Calcular ángulos de corte basados en caras adyacentes
    var faces = this.primitive.$super.face;

    if (faces.length >= 2) {
        var normalA = calculateFaceNormal(faces[0]);
        var normalB = calculateFaceNormal(faces[1]);

        // Ángulo diedro
        var dihedral = Math.acos(normalA.dotProduct(normalB));

        // Ángulo de corte = (180° - dihedral) / 2
        this.angleA = this.angleB = (Math.PI - dihedral) / 2;
    }

    // 3. Dimensiones de sección transversal
    this.width = form.beamsWidth();
    this.thickness = form.beamsThickness();
}
```

##### Método `unify()` - Clasificación de Vigas:

```javascript
Product.Beam.unify = function(beams) {
    // Agrupar vigas por longitud (con tolerancia)
    var tolerance = 0.001;  // 1mm
    var groups = {};

    beams.forEach(function(beam) {
        var found = false;

        for (var groupLength in groups) {
            if (Math.abs(beam.length - groupLength) < tolerance) {
                groups[groupLength].push(beam);
                found = true;
                break;
            }
        }

        if (!found) {
            groups[beam.length] = [beam];
        }
    });

    // Asignar etiquetas A, B, C, ...
    var sortedGroups = _.sortBy(_.keys(groups), parseFloat);
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    sortedGroups.forEach(function(length, index) {
        groups[length].forEach(function(beam) {
            beam.lengthGroup = labels[index];
            beam.quantity = groups[length].length;
        });
    });

    return groups;
}
```

**Resultado Ejemplo:**

```
Tipo  | Longitud (m) | Cantidad | Ángulo A | Ángulo B
------|--------------|----------|----------|----------
A     | 1.234        | 30       | 18.5°    | 18.5°
B     | 1.456        | 35       | 18.5°    | 18.5°
C     | 1.567        | 40       | 18.5°    | 18.5°
```

---

#### Subclase `Product.Polygon` - Paneles

**Propósito:** Representación de paneles de cobertura (caras del domo)

```javascript
Product.Polygon = function(face) {
    Product.call(this);
    this.type = 'polygon';
    this.primitive = face;      // Figure con type='face'

    // Propiedades geométricas
    this.area = 0;              // Área en m²
    this.perimeter = 0;         // Perímetro en m
    this.sides = 0;             // Número de lados

    // Forma
    this.isTriangle = false;
    this.isQuad = false;
    this.isConvex = false;
}
```

##### Método `calculate()`:

```javascript
Product.Polygon.prototype.calculate = function() {
    var points = this.primitive.$points.get();
    this.sides = points.length;

    // 1. Determinar forma
    this.isTriangle = (this.sides === 3);
    this.isQuad = (this.sides === 4);
    this.isConvex = this.primitive.isFaceConvex();

    // 2. Calcular perímetro
    this.perimeter = 0;
    for (var i = 0; i < points.length; i++) {
        var p1 = points[i];
        var p2 = points[(i + 1) % points.length];
        this.perimeter += p1.distanceTo(p2) * radius;
    }

    // 3. Calcular área (método de Shoelace en esfera)
    this.area = calculateSphericalPolygonArea(points, radius);
}
```

##### Cálculo de Área Esférica:

```javascript
function calculateSphericalPolygonArea(points, radius) {
    // Fórmula de L'Huilier para triángulos esféricos
    // Para polígonos: triangular y sumar

    var triangles = triangulatePolygon(points);
    var totalArea = 0;

    triangles.forEach(function(triangle) {
        var [a, b, c] = triangle;

        // Lados angulares (en radianes)
        var sideA = a.angleTo(b);
        var sideB = b.angleTo(c);
        var sideC = c.angleTo(a);

        // Semi-perímetro
        var s = (sideA + sideB + sideC) / 2;

        // Fórmula de L'Huilier
        var E = 4 * Math.atan(Math.sqrt(
            Math.tan(s/2) *
            Math.tan((s-sideA)/2) *
            Math.tan((s-sideB)/2) *
            Math.tan((s-sideC)/2)
        ));

        // Área = E × R²
        totalArea += E * radius * radius;
    });

    return totalArea;
}
```

---

#### Subclase `Product.Connector` - Conectores

**Propósito:** Uniones entre vigas (vértices del domo)

```javascript
Product.Connector = function(vertex) {
    Product.call(this);
    this.type = 'connector';
    this.primitive = vertex;    // Figure con type='vertex'

    // Propiedades
    this.degree = 0;            // Número de vigas convergentes
    this.angles = [];           // Ángulos entre vigas
    this.connectorType = '';    // 'GoodKarma', 'Kruschke', etc.
}
```

##### Método `calculate()`:

```javascript
Product.Connector.prototype.calculate = function() {
    var lines = this.primitive.$super.line;
    this.degree = lines.length;

    // Calcular ángulos entre vigas convergentes
    for (var i = 0; i < lines.length; i++) {
        for (var j = i + 1; j < lines.length; j++) {
            var beamA = lines[i];
            var beamB = lines[j];

            var vectorA = getBeamDirection(beamA, this.primitive);
            var vectorB = getBeamDirection(beamB, this.primitive);

            var angle = vectorA.angleTo(vectorB);
            this.angles.push(angle * 180 / Math.PI);
        }
    }
}
```

**Ejemplo de Nodo:**

```
        Beam A
           |
           |
    Beam B-+-Beam C  ← Conector de grado 5
          /|\
         / | \
    Beam D Beam E

Degree: 5
Ángulos: [72°, 72°, 72°, 72°, 72°] (pentagonal)
```

---

## Algoritmos Geodésicos

### 1. Generación de Icosaedro (Golden Ratio)

**Fundamento Matemático:**

El icosaedro regular tiene una relación íntima con el número áureo (φ):

```
φ = (1 + √5) / 2 ≈ 1.618033988749895
```

**Derivación de Coordenadas:**

Los 12 vértices del icosaedro se pueden colocar en 3 rectángulos áureos ortogonales:

```javascript
// Rectángulo áureo: proporción 1:φ
// Para esfera unitaria, normalizar:

var a = 1 / Math.sqrt(1 + φ²) ≈ 0.525731
var b = φ / Math.sqrt(1 + φ²) ≈ 0.850651

// Verificación: a² + b² = 1 ✓
```

**3 Rectángulos Áureos:**

```
Rectángulo 1 (plano XZ, y=0):
  (-a, 0, b) ---- (a, 0, b)
      |              |
      |              |
  (-a, 0, -b) --- (a, 0, -b)

Rectángulo 2 (plano YZ, x=0):
  (0, b, a) ----- (0, b, -a)
      |              |
      |              |
  (0, -b, a) ---- (0, -b, -a)

Rectángulo 3 (plano XY, z=0):
  (b, a, 0) ----- (-b, a, 0)
      |              |
      |              |
  (b, -a, 0) ---- (-b, -a, 0)
```

---

### 2. Subdivisión Geodésica (Método Class I)

**Clasificación Geodésica:**

| Clase | Descripción | Método de Subdivisión |
|-------|-------------|----------------------|
| Class I | Subdivisión por mitades de aristas | Punto medio → proyección esférica |
| Class II | Subdivisión por centroides de caras | Centroide → proyección esférica |
| Class III | Híbrido | Combinación de métodos |

**ACIDOME usa Class I** (método alternativo)

#### Algoritmo Detallado:

```javascript
function subdivide_triangle(A, B, C, frequency) {
    var V = frequency;  // 1V, 2V, 3V, etc.
    var points = [];
    var faces = [];

    // Paso 1: Generar grid de puntos en el triángulo
    for (var i = 0; i <= V; i++) {
        for (var j = 0; j <= V - i; j++) {
            var k = V - i - j;

            // Coordenadas baricéntricas
            var u = i / V;  // Peso de A
            var v = j / V;  // Peso de B
            var w = k / V;  // Peso de C
            // u + v + w = 1

            // Interpolación lineal
            var point = new Vector(
                A.x * u + B.x * v + C.x * w,
                A.y * u + B.y * v + C.y * w,
                A.z * u + B.z * v + C.z * w
            );

            // Proyección esférica (clave del algoritmo)
            point = point.normalize().scale(radius);

            points.push(point);
        }
    }

    // Paso 2: Conectar puntos en triángulos
    var index = 0;
    for (var row = 0; row < V; row++) {
        var pointsInRow = V - row + 1;

        for (var col = 0; col < pointsInRow - 1; col++) {
            // Triángulo apuntando hacia arriba ▲
            faces.push([
                index + col,
                index + col + 1,
                index + col + pointsInRow
            ]);

            // Triángulo apuntando hacia abajo ▼ (si no es el último en la fila)
            if (col < pointsInRow - 2) {
                faces.push([
                    index + col + 1,
                    index + col + pointsInRow + 1,
                    index + col + pointsInRow
                ]);
            }
        }

        index += pointsInRow;
    }

    return { points: points, faces: faces };
}
```

**Ejemplo Visual - Subdivisión 3V:**

```
Input: Triángulo ABC

        A(0,0)
        /\
       /  \
      /    \
     /      \
    /        \
   /          \
  B(1,0)────C(0,1)

Grid baricéntrico:
u = i/3, v = j/3, w = k/3

i=0,j=0: (0/3, 0/3, 3/3) = A
i=1,j=0: (1/3, 0/3, 2/3) = A + (B-A)/3
i=0,j=1: (0/3, 1/3, 2/3) = A + (C-A)/3
...

        A
       /|\
      / | \
     /  |  \
    P1──P2──P3
   /|\ /|\ /|\
  / | X | X | \
 /  |/ \|/ \|  \
B──P4──P5──P6──C

Triángulos resultantes (9):
▲: A-P1-P2, P1-P4-P5, P1-P2-P5, P2-P3-P6, P2-P5-P6, ...
▼: P1-P5-P4, P2-P6-P5, ...
```

**Fórmula de Conteo:**

| Frecuencia | Triángulos por Cara | Total (20 caras icosaedro) |
|------------|---------------------|----------------------------|
| 1V | 1 | 20 |
| 2V | 4 | 80 |
| 3V | 9 | 180 |
| 4V | 16 | 320 |
| V | V² | 20 × V² |

---

### 3. Proyección Esférica

**Clave del Método Geodésico:**

Cada punto interpolado linealmente se proyecta a la esfera:

```javascript
function spherical_projection(point, radius) {
    // 1. Normalizar a esfera unitaria
    var length = Math.sqrt(
        point.x * point.x +
        point.y * point.y +
        point.z * point.z
    );

    var unitPoint = new Vector(
        point.x / length,
        point.y / length,
        point.z / length
    );

    // 2. Escalar al radio deseado
    return new Vector(
        unitPoint.x * radius,
        unitPoint.y * radius,
        unitPoint.z * radius
    );
}
```

**Efecto Geométrico:**

```
Sin proyección (lineal):        Con proyección (geodésico):

    A                               A
   / \                             / \
  /   \                           /   \
 M─────N     ← M, N dentro      M─────N  ← M, N en superficie
  \   /                           \   /
   \ /                             \ /
    B                               B

|AM| < |AB|/2                   |AM| = |AB|/2 (arco)
```

**Importancia:**

- **Sin proyección:** Puntos intermedios caen dentro de la esfera → domo "colgado"
- **Con proyección:** Todos los puntos están en la superficie → domo verdadero

---

### 4. Truncamiento Parcial (Partial Domes)

**Objetivo:** Cortar el domo a una fracción específica (ej: 7/12, 5/8)

#### Listas de Parcialidad:

##### Para Icosaedro (Class I):

```javascript
function partialList_ClassI(V) {
    var fractions = [];

    // Generar fracciones: p/q donde p va de V a 4V
    for (var p = V; p <= 4*V; p++) {
        // Saltar de V en V, excepto alrededor de 3V (más granular)
        var increment = (p >= 2.5*V && p <= 3.5*V) ? 1 : 2;

        fractions.push(p + '/' + (4*V));

        p += increment - 1;  // -1 porque el loop hace ++
    }

    return fractions;
}

// Ejemplo para 3V:
// V = 3, 4V = 12
// p = 3, 5, 7, 8, 9, 10, 11, 12
// Fracciones: 3/12, 5/12, 7/12, 8/12, 9/12, 10/12, 11/12, 12/12
```

**Interpretación:**
- `3/12` = 1/4 domo (esfera completa dividida en 4)
- `7/12` ≈ 0.583 = Domo típico (poco más de la mitad)
- `12/12` = Esfera completa

##### Para Octaedro:

```javascript
function partialList_Octohedron(V) {
    var fractions = [];

    for (var p = 0; p <= V; p++) {
        // Fórmula: altura = p² / (2V²)
        fractions.push(p*p + '/' + (2*V*V));

        // Fórmula alternativa: (V² + p²) / (2V²)
        fractions.push((V*V + p*p) + '/' + (2*V*V));
    }

    return fractions;
}
```

#### Algoritmo de Corte:

```javascript
function truncate_dome(figure, fraction) {
    var [numerator, denominator] = fraction.split('/').map(parseFloat);
    var partialRatio = numerator / denominator;

    // Paso 1: Calcular altura de corte
    var cutHeight = calculateCutHeight(partialRatio, figure.base, figure.symmetry);

    // Paso 2: Crear plano de corte
    var cutPlane = new Plane(
        new Vector(0, 1, 0),  // Normal (eje Y)
        cutHeight              // Distancia del origen
    );

    // Paso 3: Clasificar caras
    var facesAbove = [];
    var facesCrossing = [];
    var facesBelow = [];

    figure.$primitives.filter('[type="face"]').each(function() {
        var face = this;
        var position = classifyFaceRelativeToPlane(face, cutPlane);

        if (position === 'above') {
            facesAbove.push(face);
        } else if (position === 'crossing') {
            facesCrossing.push(face);
        } else {
            facesBelow.push(face);
        }
    });

    // Paso 4: Eliminar caras por debajo
    facesBelow.forEach(function(face) {
        figure.safeRemoveMember(face);
    });

    // Paso 5: Cortar caras que cruzan el plano
    facesCrossing.forEach(function(face) {
        var newFace = clipFaceByPlane(face, cutPlane);
        figure.safeRemoveMember(face);
        figure.$primitives = figure.$primitives.add(newFace);
    });

    // Paso 6: Fusionar caras en el borde
    mergeBoundaryFaces(figure);
}
```

##### Cálculo de Altura de Corte:

```javascript
function calculateCutHeight(ratio, base, symmetry) {
    if (base === 'Icosahedron' && symmetry === 'Pentad') {
        // Para icosaedro con simetría pentagonal
        // Fórmula empírica basada en ratio

        var maxHeight = Math.cos(Math.atan(2));  // Altura del apex
        var minHeight = -maxHeight;

        // Interpolación no lineal (más caras cerca del ecuador)
        var adjustedRatio = Math.pow(ratio, 1.2);

        return minHeight + (maxHeight - minHeight) * adjustedRatio;
    }

    // Otras configuraciones...
}
```

##### Fusión de Caras en el Borde:

```javascript
function mergeBoundaryFaces(figure) {
    // Detectar líneas de borde (selvage)
    figure.detectSelvage();

    // Encontrar líneas que deben eliminarse (2 caras, pero una fue cortada)
    var linesToMerge = figure.$primitives.filter('[type="line"]').filter(function() {
        var line = this;
        var faces = line.$super.face;

        // Si antes tenía 2 caras, pero una fue eliminada
        return faces.length === 2 &&
               (faces[0].wasClipped || faces[1].wasClipped);
    });

    // Fusionar caras adyacentes eliminando la línea compartida
    linesToMerge.each(function() {
        figure.safeRemoveFaceLine(this);
    });
}
```

**Resultado Visual:**

```
Esfera completa (12/12):         Domo 7/12:
       ___                          ___
      /   \                        /   \
     |  o  |                      |  o  |
      \___/                        ─────  ← Plano de corte
      /   \                    (fusión de caras en el borde)
     |  o  |
      \___/

20 caras triangulares        14 caras triangulares +
                             1 cara poligonal (borde)
```

---

### 5. Cálculo de Vigas (Strut Calculation)

#### Longitud de Viga:

```javascript
function calculateBeamLength(pointA, pointB, radius) {
    // Distancia geodésica (arco en la esfera)
    // Para pequeños ángulos, ≈ distancia euclidiana

    var euclideanDistance = pointA.distanceTo(pointB);

    // Ángulo central (en radianes)
    var angle = 2 * Math.asin(euclideanDistance / (2 * radius));

    // Longitud del arco
    var arcLength = radius * angle;

    return arcLength;
}
```

**Comparación:**

| Método | Fórmula | Error típico |
|--------|---------|--------------|
| Euclidiano | `\|B - A\| × radius` | ~0.1% |
| Geodésico | `radius × 2 × asin(\|B-A\|/2)` | 0% |

**En la práctica:** ACIDOME usa distancia euclidiana escalada (más rápido, error despreciable)

#### Ángulos de Corte:

```javascript
function calculateBeamAngles(line) {
    var faces = line.$super.face;

    if (faces.length !== 2) {
        // Borde: ángulo de corte = 90° (perpendicular)
        return { angleA: 90, angleB: 90 };
    }

    // Calcular normales de las caras adyacentes
    var normalA = calculateFaceNormal(faces[0]);
    var normalB = calculateFaceNormal(faces[1]);

    // Ángulo diedro (ángulo entre las caras)
    var dihedral = Math.acos(normalA.dotProduct(normalB));

    // Ángulo de corte en cada extremo
    // (para que la viga se ajuste al ángulo diedro)
    var cutAngle = (Math.PI - dihedral) / 2;

    return {
        angleA: cutAngle * 180 / Math.PI,
        angleB: cutAngle * 180 / Math.PI
    };
}

function calculateFaceNormal(face) {
    var points = face.$points.get();

    // Para triángulo: producto cruz de dos aristas
    var v1 = points[1].subtract(points[0]);
    var v2 = points[2].subtract(points[0]);

    var normal = v1.crossProduct(v2);

    return normal.normalize();
}
```

**Geometría del Ángulo:**

```
Vista lateral de 2 caras adyacentes:

    Face A          Face B
      \             /
       \           /
        \  θ_d   /    θ_d = ángulo diedro
         \       /
          \     /
           \   /
            \ /
          ──────── Viga
            / \
           /   \
     θ_c /     \ θ_c

θ_c = ángulo de corte = (180° - θ_d) / 2

Para icosaedro: θ_d ≈ 138.19°
Por lo tanto: θ_c ≈ 20.9°
```

#### Clasificación de Vigas por Longitud:

```javascript
function classifyBeams(beams) {
    var tolerance = 0.001;  // 1mm de tolerancia
    var groups = {};
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Agrupar por longitud similar
    beams.forEach(function(beam) {
        var grouped = false;

        for (var existingLength in groups) {
            if (Math.abs(beam.length - parseFloat(existingLength)) < tolerance) {
                groups[existingLength].push(beam);
                grouped = true;
                break;
            }
        }

        if (!grouped) {
            groups[beam.length] = [beam];
        }
    });

    // Ordenar por longitud y asignar etiquetas
    var sortedLengths = Object.keys(groups).map(parseFloat).sort(function(a, b) {
        return a - b;
    });

    sortedLengths.forEach(function(length, index) {
        var group = groups[length];
        var label = labels[index] || 'Z' + (index - 25);

        group.forEach(function(beam) {
            beam.label = label;
            beam.groupSize = group.length;
        });
    });

    return groups;
}
```

**Tabla de Resultados Típica (3V Icosaedro):**

| Tipo | Longitud (m) | Cantidad | Ángulo | Descripción |
|------|--------------|----------|--------|-------------|
| A | 1.0515 | 30 | 20.9° | Aristas originales del icosaedro |
| B | 1.0823 | 40 | 20.9° | Aristas de subdivisión |
| C | 1.1084 | 50 | 20.9° | Aristas de subdivisión |

**Nota:** Un domo 3V típico tiene 3 tipos de vigas diferentes (chord factors)

---

## Estructura de Datos

### Jerarquía de Primitivas

```
┌─────────────────────────────────────────────────────────────┐
│                        Figure (Domo)                        │
│                                                             │
│  type: 'figure' | 'Icosahedron' | 'Octohedron'             │
│  $points: jQuery([Vector, Vector, ...])  ← Todos los puntos│
│  $primitives: jQuery([Figure, ...])      ← Todas primitivas│
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    FACES (Caras)                      │  │
│  │                                                       │  │
│  │  type: 'face'                                         │  │
│  │  $points: [V1, V2, V3, ...]  ← 3+ vértices           │  │
│  │  $sub: {                                              │  │
│  │    vertex: [Vertex, Vertex, ...] ← Vértices de cara  │  │
│  │    line: [Line, Line, ...]       ← Aristas de cara   │  │
│  │  }                                                    │  │
│  │  $super: {                                            │  │
│  │    line: [],                                          │  │
│  │    face: []                                           │  │
│  │  }                                                    │  │
│  │  product: Polygon  ← Panel asociado                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ▲                                 │
│                           │ $super.face                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    LINES (Aristas)                    │  │
│  │                                                       │  │
│  │  type: 'line'                                         │  │
│  │  $points: [V1, V2]  ← 2 puntos extremos              │  │
│  │  $sub: {                                              │  │
│  │    vertex: [Vertex, Vertex]  ← 2 vértices            │  │
│  │  }                                                    │  │
│  │  $super: {                                            │  │
│  │    line: [],                                          │  │
│  │    face: [Face, Face]  ← 1-2 caras adyacentes        │  │
│  │  }                                                    │  │
│  │  product: Beam  ← Viga asociada                      │  │
│  │  isSelvage: boolean  ← Es borde exterior?            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ▲                                 │
│                           │ $super.line                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  VERTICES (Vértices)                  │  │
│  │                                                       │  │
│  │  type: 'vertex'                                       │  │
│  │  $points: [V1]  ← 1 punto                            │  │
│  │  $sub: {}                                             │  │
│  │  $super: {                                            │  │
│  │    line: [L1, L2, ...]  ← Aristas convergentes       │  │
│  │    face: [F1, F2, ...]  ← Caras adyacentes           │  │
│  │  }                                                    │  │
│  │  product: Connector  ← Conector asociado             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Relaciones Bidireccionales

#### Ejemplo Concreto:

```
Domo simplificado (4 vértices, 5 aristas, 2 caras):

     V1
     /\
    /  \
  L1    L2
  /  F1  \
 /        \
V2──L3────V3
 \        /
  \  F2  /
  L4    L5
    \  /
     \/
     V4
```

#### Estructura de Datos:

```javascript
// Vértice V1
{
    type: 'vertex',
    $points: [Vector(0, 1, 0)],
    $sub: {},
    $super: {
        line: [L1, L2],           // 2 aristas parten de V1
        face: [F1]                // 1 cara contiene V1
    }
}

// Arista L1 (V1-V2)
{
    type: 'line',
    $points: [Vector(0,1,0), Vector(-1,0,0)],
    $sub: {
        vertex: [V1, V2]          // Extremos
    },
    $super: {
        line: [],
        face: [F1]                // Solo 1 cara (es borde exterior)
    },
    isSelvage: true
}

// Arista L3 (V2-V3)
{
    type: 'line',
    $points: [Vector(-1,0,0), Vector(1,0,0)],
    $sub: {
        vertex: [V2, V3]
    },
    $super: {
        line: [],
        face: [F1, F2]            // 2 caras (arista interna)
    },
    isSelvage: false
}

// Cara F1 (V1-V2-V3)
{
    type: 'face',
    $points: [Vector(0,1,0), Vector(-1,0,0), Vector(1,0,0)],
    $sub: {
        vertex: [V1, V2, V3],
        line: [L1, L3, L2]
    },
    $super: {
        line: [],
        face: []
    }
}
```

### Algoritmo de Construcción de Relaciones

```javascript
Figure.prototype.relations = function() {
    var vertices = this.$primitives.filter('[type="vertex"]');
    var lines = this.$primitives.filter('[type="line"]');
    var faces = this.$primitives.filter('[type="face"]');

    // Paso 1: Para cada cara, encontrar sus aristas y vértices
    faces.each(function() {
        var face = this;
        var facePoints = face.$points.get();

        face.$sub.line = lines.filter(function() {
            var line = this;
            var linePoints = line.$points.get();

            // ¿Ambos puntos de la línea están en la cara?
            return facePoints.indexOf(linePoints[0]) !== -1 &&
                   facePoints.indexOf(linePoints[1]) !== -1;
        });

        face.$sub.vertex = vertices.filter(function() {
            var vertex = this;
            var vertexPoint = vertex.$points[0];

            // ¿El vértice está en la cara?
            return facePoints.indexOf(vertexPoint) !== -1;
        });
    });

    // Paso 2: Para cada arista, encontrar caras adyacentes y vértices extremos
    lines.each(function() {
        var line = this;
        var linePoints = line.$points.get();

        line.$super.face = faces.filter(function() {
            var face = this;
            return face.$sub.line.index(line) !== -1;
        });

        line.$sub.vertex = vertices.filter(function() {
            var vertex = this;
            var vertexPoint = vertex.$points[0];
            return linePoints.indexOf(vertexPoint) !== -1;
        });
    });

    // Paso 3: Para cada vértice, encontrar aristas y caras convergentes
    vertices.each(function() {
        var vertex = this;
        var vertexPoint = vertex.$points[0];

        vertex.$super.line = lines.filter(function() {
            var line = this;
            return line.$sub.vertex.index(vertex) !== -1;
        });

        vertex.$super.face = faces.filter(function() {
            var face = this;
            return face.$sub.vertex.index(vertex) !== -1;
        });
    });
}
```

### Detección de Duplicados

```javascript
function findOrCreateVertex(point, existingVertices, tolerance) {
    tolerance = tolerance || 0.0001;  // 0.1mm

    // Buscar vértice existente en la misma posición
    for (var i = 0; i < existingVertices.length; i++) {
        var existing = existingVertices[i];
        var existingPoint = existing.$points[0];

        var distance = point.distanceTo(existingPoint);

        if (distance < tolerance) {
            return existing;  // Reutilizar vértice existente
        }
    }

    // Crear nuevo vértice
    var newVertex = new Figure({
        type: 'vertex',
        $points: $([point])
    });

    existingVertices.push(newVertex);
    return newVertex;
}
```

---

## Flujo de Ejecución

### 1. Inicialización de la Aplicación

```
┌──────────────────────────────────────────────────────────┐
│                  CARGA DE PÁGINA (Load)                  │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│          Parseo de URL Fragment (window.location.hash)   │
│                                                           │
│  Ejemplo: #Icosahedron/3V/7-12/R2.20/beams_120x40       │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ fragmentRouter.fromString(hash) →                  │  │
│  │   base: 'Icosahedron'                              │  │
│  │   detail: 3                                         │  │
│  │   partial: '7/12'                                   │  │
│  │   radius: 2.20                                      │  │
│  │   beamsWidth: 120                                   │  │
│  │   beamsThickness: 40                                │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│         Knockout.js Data Binding (ko.applyBindings)      │
│                                                           │
│  ViewModel ↔ HTML Form                                   │
│  - Observables sincronizados                             │
│  - Event listeners automáticos                           │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│              Renderizado Inicial (init())                │
└──────────────────────────────────────────────────────────┘
```

---

### 2. Generación de Geometría

```
┌──────────────────────────────────────────────────────────┐
│         EVENTO: Usuario cambia parámetro en form         │
│                 (form.on('change'))                      │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  PASO 1: Crear Figura Base                               │
│                                                           │
│  if (form.base() === 'Icosahedron') {                    │
│      figure = new Figure.Icosahedron({                   │
│          symmetry: 'Pentad',                             │
│          axis: 'y',                                       │
│          radius: 1  // Esfera unitaria                   │
│      });                                                  │
│  } else {                                                 │
│      figure = new Figure.Octohedron({...});              │
│  }                                                        │
│                                                           │
│  Resultado:                                               │
│  - 12 vértices                                            │
│  - 30 aristas                                             │
│  - 20 caras triangulares                                  │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  PASO 2: Subdivisión Geodésica                           │
│                                                           │
│  var V = form.detail();  // 1, 2, 3, 4, 5, 6...          │
│  figure.splitFaces(V);                                   │
│                                                           │
│  Resultado (para 3V):                                     │
│  - ~42 vértices                                           │
│  - ~120 aristas                                           │
│  - 180 caras (20 × 3²)                                   │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  PASO 3: Establecer Relaciones                           │
│                                                           │
│  figure.relations();                                     │
│                                                           │
│  - Vincula vertices ↔ lines ↔ faces                     │
│  - Establece $sub y $super                               │
│  - Permite navegación en grafo                           │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  PASO 4: Truncamiento (si partial < 1)                   │
│                                                           │
│  var fraction = form.partial();  // ej: '7/12'           │
│  truncate_dome(figure, fraction);                        │
│                                                           │
│  Sub-pasos:                                               │
│  1. Calcular altura de corte                             │
│  2. Clasificar caras (arriba/cruzando/abajo)            │
│  3. Eliminar caras por debajo                            │
│  4. Clipear caras que cruzan                             │
│  5. Fusionar caras en el borde                           │
│                                                           │
│  Resultado (para 7/12):                                   │
│  - ~30 vértices                                           │
│  - ~85 aristas                                            │
│  - ~55 caras (triangulares + 1 poligonal en borde)      │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  PASO 5: Detectar Bordes (Selvage)                      │
│                                                           │
│  figure.detectSelvage();                                 │
│                                                           │
│  Marca aristas exteriores (line.isSelvage = true)       │
└──────────────────────────────────────────────────────────┘
```

---

### 3. Asignación de Productos

```
┌──────────────────────────────────────────────────────────┐
│  PARA CADA PRIMITIVA, CREAR PRODUCTO ASOCIADO            │
└──────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌──────────┐
    │  LINES  │      │  FACES  │      │ VERTICES │
    └─────────┘      └─────────┘      └──────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────┐ ┌────────────────┐
│ Product.Beam    │ │Product.     │ │Product.        │
│                 │ │Polygon      │ │Connector       │
│ line.product =  │ │             │ │                │
│   new Beam(line)│ │face.product │ │vertex.product  │
│                 │ │  = new      │ │  = new         │
│ Calcular:       │ │  Polygon()  │ │  Connector()   │
│ - length        │ │             │ │                │
│ - angleA/B      │ │Calcular:    │ │Calcular:       │
│ - width/thick   │ │ - area      │ │ - degree       │
│                 │ │ - perimeter │ │ - angles       │
└─────────────────┘ └─────────────┘ └────────────────┘
```

**Código:**

```javascript
// Asignar productos a primitivas
figure.$primitives.each(function() {
    var primitive = this;

    if (primitive.type === 'line') {
        primitive.product = new Product.Beam(primitive);
        primitive.product.calculate();
    }
    else if (primitive.type === 'face') {
        primitive.product = new Product.Polygon(primitive);
        primitive.product.calculate();
    }
    else if (primitive.type === 'vertex') {
        primitive.product = new Product.Connector(primitive);
        primitive.product.calculate();
    }
});
```

---

### 4. Cálculos de Ingeniería

```
┌──────────────────────────────────────────────────────────┐
│  UNIFICACIÓN DE PRODUCTOS (Agrupar por similitud)        │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  Product.Beam.unify(allBeams)                            │
│                                                           │
│  Clasificación por longitud:                             │
│  ┌───────────────────────────────────────────────────┐   │
│  │ Grupo A: 1.051m × 30 piezas                       │   │
│  │ Grupo B: 1.082m × 40 piezas                       │   │
│  │ Grupo C: 1.108m × 35 piezas                       │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  CÁLCULO DE MÉTRICAS TOTALES                             │
│                                                           │
│  Total de materiales:                                     │
│  - Longitud total de vigas: Σ(length × quantity)        │
│  - Área total de paneles: Σ(area)                       │
│  - Número de conectores: count(vertices)                 │
│                                                           │
│  Volumen interno:                                         │
│  - Integral sobre superficie                             │
│                                                           │
│  Peso estimado:                                           │
│  - Densidad × volumen de material                       │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  GENERACIÓN DE TABLAS DE RESULTADOS                      │
│                                                           │
│  1. Tabla de Vigas (Struts Table)                        │
│     - Tipo, Longitud, Cantidad, Ángulos                  │
│                                                           │
│  2. Tabla de Caras (Faces Table)                         │
│     - Tipo, Área, Cantidad, Forma                        │
│                                                           │
│  3. Presupuesto (Budget)                                  │
│     - Costos estimados por material                      │
└──────────────────────────────────────────────────────────┘
```

---

### 5. Renderizado 3D (Three.js)

```
┌──────────────────────────────────────────────────────────┐
│  INICIALIZACIÓN DE ESCENA (Una vez)                      │
│                                                           │
│  scene = new THREE.Scene();                              │
│  camera = new THREE.PerspectiveCamera(30, w/h, 10, 1e5);│
│  renderer = new THREE.CanvasRenderer({                   │
│      canvas: $canvas[0],                                 │
│      antialias: true                                     │
│  });                                                      │
│                                                           │
│  // Luces                                                 │
│  scene.add(new THREE.AmbientLight(0x404040));           │
│  scene.add(new THREE.DirectionalLight(0xffffff, 0.5));  │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  CONVERSIÓN: Figure → THREE.Geometry                     │
└──────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
  ┌────────────┐    ┌────────────┐    ┌────────────┐
  │  Vertices  │    │   Faces    │    │   Lines    │
  └────────────┘    └────────────┘    └────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌──────────────────────────────────────────────────────────┐
│  geometry = new THREE.Geometry();                        │
│                                                           │
│  // 1. Agregar vértices                                  │
│  figure.$points.each(function() {                        │
│      var vector = this;                                  │
│      geometry.vertices.push(                             │
│          new THREE.Vector3(vector.x, vector.y, vector.z) │
│      );                                                   │
│  });                                                      │
│                                                           │
│  // 2. Agregar caras                                     │
│  figure.$primitives.filter('[type="face"]').each(function(){│
│      var face = this;                                    │
│      var indices = getVertexIndices(face.$points);       │
│                                                           │
│      if (indices.length === 3) {                         │
│          geometry.faces.push(                            │
│              new THREE.Face3(indices[0], indices[1], indices[2])│
│          );                                               │
│      } else if (indices.length === 4) {                  │
│          geometry.faces.push(                            │
│              new THREE.Face4(indices[0], ..., indices[3])│
│          );                                               │
│      }                                                    │
│  });                                                      │
│                                                           │
│  // 3. Calcular normales                                 │
│  geometry.computeFaceNormals();                          │
│  geometry.computeVertexNormals();                        │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  CREACIÓN DE MALLAS (Meshes)                             │
│                                                           │
│  // Material para carcasa                                │
│  var carcassMaterial = new THREE.MeshLambertMaterial({  │
│      color: 0x00ff00,                                    │
│      wireframe: false                                    │
│  });                                                      │
│                                                           │
│  var carcassMesh = new THREE.Mesh(geometry, carcassMaterial);│
│  scene.add(carcassMesh);                                 │
│                                                           │
│  // Wireframe para vigas                                 │
│  var linesMaterial = new THREE.LineBasicMaterial({       │
│      color: 0x000000                                     │
│  });                                                      │
│                                                           │
│  figure.$primitives.filter('[type="line"]').each(function(){│
│      var line = this;                                    │
│      var lineGeometry = new THREE.Geometry();            │
│      lineGeometry.vertices.push(                         │
│          new THREE.Vector3(...line.$points[0]),          │
│          new THREE.Vector3(...line.$points[1])           │
│      );                                                   │
│      var lineObject = new THREE.Line(lineGeometry, linesMaterial);│
│      scene.add(lineObject);                              │
│  });                                                      │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  RENDER LOOP (Animación)                                 │
│                                                           │
│  function animate() {                                    │
│      requestAnimationFrame(animate);                     │
│                                                           │
│      // Rotar cámara (opcional)                          │
│      camera.position.x = Math.cos(time) * distance;      │
│      camera.position.z = Math.sin(time) * distance;      │
│      camera.lookAt(scene.position);                      │
│                                                           │
│      // Renderizar                                        │
│      renderer.render(scene, camera);                     │
│  }                                                        │
│                                                           │
│  animate();                                               │
└──────────────────────────────────────────────────────────┘
```

---

### 6. Generación de Resultados

```
┌──────────────────────────────────────────────────────────┐
│  GENERACIÓN DE UI DE RESULTADOS                          │
└──────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
  ┌────────────┐    ┌────────────┐    ┌────────────┐
  │   Tabla    │    │   Tabla    │    │  Patrón de │
  │  de Vigas  │    │  de Caras  │    │    Tela    │
  └────────────┘    └────────────┘    └────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌──────────────────────────────────────────────────────────┐
│  TABLA DE VIGAS (Struts Table)                           │
│                                                           │
│  <table>                                                  │
│    <thead>                                                │
│      <tr>                                                 │
│        <th>Tipo</th>                                      │
│        <th>Longitud (m)</th>                              │
│        <th>Cantidad</th>                                  │
│        <th>Ángulo A</th>                                  │
│        <th>Ángulo B</th>                                  │
│      </tr>                                                │
│    </thead>                                               │
│    <tbody>                                                │
│      <!-- Generado dinámicamente por Knockout -->        │
│      <tr data-bind="foreach: beamGroups">                │
│        <td data-bind="text: label"></td>                 │
│        <td data-bind="text: length.toFixed(4)"></td>     │
│        ...                                                │
│      </tr>                                                │
│    </tbody>                                               │
│  </table>                                                 │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  PATRÓN DE TELA 2D (Tent Pattern)                        │
│                                                           │
│  Algoritmo de aplanamiento:                               │
│  1. Seleccionar cara inicial                             │
│  2. Colocar en plano 2D                                  │
│  3. Para cada cara adyacente:                            │
│     - Calcular rotación para aplanar                     │
│     - Minimizar distorsión                               │
│  4. Iterar hasta convergencia                            │
│                                                           │
│  Renderizado:                                             │
│  - SVG o Canvas 2D                                       │
│  - Cada cara como polígono                               │
│  - Líneas de corte marcadas                              │
└──────────────────────────────────────────────────────────┘
```

---

## Fórmulas Matemáticas

### 1. Número Áureo (Golden Ratio)

```
φ = (1 + √5) / 2 ≈ 1.618033988749895

Propiedades:
φ² = φ + 1
1/φ = φ - 1
```

**Uso en Icosaedro:**

Las coordenadas de los 12 vértices están en razón áurea:

```
Rectángulo áureo: Lados en proporción 1:φ

Para esfera unitaria:
a = 1 / √(1 + φ²) ≈ 0.525731
b = φ / √(1 + φ²) ≈ 0.850651

Verificación: a² + b² = 1
```

---

### 2. Proyección a Esfera Unitaria

**Vector unitario:**

```
v̂ = v / |v|

donde |v| = √(x² + y² + z²)
```

**Escalado al radio:**

```
v_final = r × v̂ = r × (v / |v|)
```

**Implementación:**

```javascript
function normalize_and_scale(vector, radius) {
    var length = Math.sqrt(
        vector.x * vector.x +
        vector.y * vector.y +
        vector.z * vector.z
    );

    return {
        x: (vector.x / length) * radius,
        y: (vector.y / length) * radius,
        z: (vector.z / length) * radius
    };
}
```

---

### 3. Producto Cruz (Cross Product)

**Fórmula:**

```
a × b = (a_y·b_z - a_z·b_y,
         a_z·b_x - a_x·b_z,
         a_x·b_y - a_y·b_x)
```

**Propiedades:**

- `a × b` es perpendicular a ambos `a` y `b`
- `|a × b| = |a| · |b| · sin(θ)`
- Dirección: Regla de la mano derecha

**Uso:**

- Calcular normales de caras
- Detectar convexidad de polígonos
- Determinar orientación de caras

---

### 4. Producto Punto (Dot Product)

**Fórmula:**

```
a · b = a_x·b_x + a_y·b_y + a_z·b_z
      = |a| · |b| · cos(θ)
```

**Ángulo entre vectores:**

```
θ = arccos((a · b) / (|a| · |b|))
```

**Implementación:**

```javascript
function angleBetween(a, b) {
    var dot = a.x*b.x + a.y*b.y + a.z*b.z;
    var lenA = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);
    var lenB = Math.sqrt(b.x*b.x + b.y*b.y + b.z*b.z);

    var cosTheta = dot / (lenA * lenB);

    // Clamp para evitar errores de redondeo
    cosTheta = Math.max(-1, Math.min(1, cosTheta));

    return Math.acos(cosTheta);
}
```

---

### 5. Área de Triángulo Esférico (L'Huilier)

**Fórmula de L'Huilier:**

Para un triángulo esférico con lados angulares a, b, c:

```
Semi-perímetro: s = (a + b + c) / 2

Exceso esférico: E = 4 · arctan(√(tan(s/2) · tan((s-a)/2) · tan((s-b)/2) · tan((s-c)/2)))

Área: A = E · R²
```

**Implementación:**

```javascript
function sphericalTriangleArea(pointA, pointB, pointC, radius) {
    // Lados angulares (en radianes)
    var a = pointB.angleTo(pointC);
    var b = pointC.angleTo(pointA);
    var c = pointA.angleTo(pointB);

    // Semi-perímetro
    var s = (a + b + c) / 2;

    // Términos intermedios
    var tan_s_2 = Math.tan(s / 2);
    var tan_sa_2 = Math.tan((s - a) / 2);
    var tan_sb_2 = Math.tan((s - b) / 2);
    var tan_sc_2 = Math.tan((s - c) / 2);

    // Exceso esférico
    var E = 4 * Math.atan(Math.sqrt(
        tan_s_2 * tan_sa_2 * tan_sb_2 * tan_sc_2
    ));

    // Área
    return E * radius * radius;
}
```

---

### 6. Ángulo Diedro (Dihedral Angle)

**Definición:**

Ángulo entre dos planos (caras) que comparten una arista.

```
Dados dos planos con normales n₁ y n₂:

θ_diedro = arccos(n₁ · n₂ / (|n₁| · |n₂|))
```

**Para icosaedro regular:**

```
θ_diedro = arccos(-√5/3) ≈ 138.19°
```

**Ángulo de corte de viga:**

```
θ_corte = (180° - θ_diedro) / 2

Para icosaedro: θ_corte ≈ 20.905°
```

---

### 7. Interpolación Baricéntrica

**Coordenadas baricéntricas:**

Para un punto P dentro del triángulo ABC:

```
P = u·A + v·B + w·C

donde u + v + w = 1
      u, v, w ≥ 0
```

**Cálculo de u, v, w:**

```javascript
function barycentricCoords(P, A, B, C) {
    var v0 = B.subtract(A);
    var v1 = C.subtract(A);
    var v2 = P.subtract(A);

    var d00 = v0.dot(v0);
    var d01 = v0.dot(v1);
    var d11 = v1.dot(v1);
    var d20 = v2.dot(v0);
    var d21 = v2.dot(v1);

    var denom = d00 * d11 - d01 * d01;

    var v = (d11 * d20 - d01 * d21) / denom;
    var w = (d00 * d21 - d01 * d20) / denom;
    var u = 1 - v - w;

    return { u: u, v: v, w: w };
}
```

---

### 8. Distancia Geodésica en Esfera

**Fórmula de Haversine:**

Para dos puntos en una esfera:

```
Δlat = lat₂ - lat₁
Δlon = lon₂ - lon₁

a = sin²(Δlat/2) + cos(lat₁) · cos(lat₂) · sin²(Δlon/2)

c = 2 · arctan2(√a, √(1-a))

distancia = R · c
```

**Aproximación para puntos cercanos:**

```
d ≈ R · √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)
```

**ACIDOME usa:** Distancia euclidiana escalada (error < 0.1%)

---

## Características Especiales

### 1. Modos de Visualización

#### Carcass (Carcasa/Estructura)

**Descripción:** Muestra solo la estructura de vigas del domo

**Implementación:**

```javascript
viewer.drivers.carcass = {
    present: function(figure, color) {
        // Renderizar solo líneas (wireframe)
        figure.$primitives.filter('[type="line"]').each(function() {
            var line = this;
            var geometry = new THREE.Geometry();

            geometry.vertices.push(
                new THREE.Vector3(...line.$points[0]),
                new THREE.Vector3(...line.$points[1])
            );

            var material = new THREE.LineBasicMaterial({ color: color });
            var lineObject = new THREE.Line(geometry, material);

            scene.add(lineObject);
        });
    }
};
```

**Uso:** Visualizar estructura portante, revisar distribución de vigas

---

#### Tent (Tela/Cobertura)

**Descripción:** Muestra paneles de cobertura con textura/color

**Implementación:**

```javascript
viewer.drivers.tent = {
    present: function(figure, color) {
        var geometry = new THREE.Geometry();

        // Agregar todos los vértices
        figure.$points.each(function() {
            geometry.vertices.push(new THREE.Vector3(...this));
        });

        // Agregar caras
        figure.$primitives.filter('[type="face"]').each(function() {
            var face = this;
            var indices = getVertexIndices(face.$points);

            if (indices.length === 3) {
                geometry.faces.push(new THREE.Face3(...indices));
            } else if (indices.length === 4) {
                geometry.faces.push(new THREE.Face4(...indices));
            }
        });

        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        var material = new THREE.MeshLambertMaterial({
            color: color,
            side: THREE.DoubleSide
        });

        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }
};
```

**Uso:** Visualizar cobertura completa, calcular áreas de tela

---

#### Pattern (Patrón 2D)

**Descripción:** Vista aplanada para patrones de corte de tela

**Algoritmo de Aplanamiento:**

```javascript
function flattenToPattern(figure) {
    var faces2D = [];
    var visited = new Set();

    // Paso 1: Seleccionar cara inicial (centro del domo)
    var startFace = findCentralFace(figure);

    // Paso 2: Colocar primera cara en el origen
    var face2D = {
        original: startFace,
        points: [
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 0.5, y: Math.sqrt(3)/2}  // Triángulo equilátero unitario
        ],
        edges: getEdges(startFace)
    };

    faces2D.push(face2D);
    visited.add(startFace);

    // Paso 3: BFS para caras adyacentes
    var queue = [face2D];

    while (queue.length > 0) {
        var currentFace2D = queue.shift();

        currentFace2D.edges.forEach(function(edge, edgeIndex) {
            // Encontrar cara adyacente en 3D
            var adjacentFace3D = getAdjacentFace(currentFace2D.original, edge);

            if (adjacentFace3D && !visited.has(adjacentFace3D)) {
                // Calcular posición 2D basada en arista compartida
                var newFace2D = unfoldFace(
                    adjacentFace3D,
                    currentFace2D,
                    edgeIndex
                );

                faces2D.push(newFace2D);
                visited.add(adjacentFace3D);
                queue.push(newFace2D);
            }
        });
    }

    // Paso 4: Optimizar layout (minimizar superposiciones)
    optimizeLayout(faces2D);

    return faces2D;
}

function unfoldFace(face3D, adjacentFace2D, sharedEdgeIndex) {
    // Geometría: rotar nueva cara alrededor de arista compartida

    var sharedEdge2D = adjacentFace2D.edges[sharedEdgeIndex];
    var pointA = adjacentFace2D.points[sharedEdgeIndex];
    var pointB = adjacentFace2D.points[(sharedEdgeIndex + 1) % 3];

    // Calcular ángulo diedro en 3D
    var dihedral = calculateDihedralAngle(
        adjacentFace2D.original,
        face3D
    );

    // Rotar tercer punto alrededor de la arista compartida
    var angle = Math.PI - dihedral;  // Aplanar
    var pointC = rotatePointAroundEdge(pointA, pointB, angle);

    return {
        original: face3D,
        points: [pointA, pointB, pointC],
        edges: getEdges(face3D)
    };
}
```

**Resultado:** SVG o Canvas 2D con patrón aplanado para corte

```
     /\        /\
    /  \      /  \
   /____\    /____\
   \    /    \    /
    \  /      \  /
     \/        \/

   [Cara 1] [Cara 2] [Cara 3] ...

   Líneas de corte: ─────
   Líneas de pliegue: ‧‧‧‧‧
```

---

### 2. Sistemas de Conectores

#### GoodKarma

**Descripción:** Sistema de conectores basado en diseño GoodKarma

**Características:**

- Conectores planos con agujeros pre-perforados
- Ángulos fijos calculados por vértice
- Material: Acero galvanizado o aluminio

**Cálculo:**

```javascript
Product.Connector.GoodKarma = function(vertex) {
    Product.Connector.call(this, vertex);

    this.calculate = function() {
        var beams = vertex.$super.line;
        this.degree = beams.length;

        // Calcular distribución angular
        this.holes = [];

        beams.each(function(beam, index) {
            var direction = getBeamDirection(beam, vertex);

            // Ángulo en plano XY
            var angleXY = Math.atan2(direction.y, direction.x);

            // Ángulo de elevación
            var angleZ = Math.asin(direction.z);

            this.holes.push({
                angle: angleXY * 180 / Math.PI,
                elevation: angleZ * 180 / Math.PI,
                diameter: beam.product.thickness
            });
        });
    };
}
```

---

#### Kruschke

**Descripción:** Sistema de conectores tipo Kruschke (hub connector)

**Características:**

- Conectores esféricos con insertos roscados
- Permite ajuste de ángulos durante montaje
- Material: Fundición de aluminio

**Geometría:**

```
        Beam A
           |
         ╱─┴─╲
        │  O  │  ← Conector esférico
         ╲─┬─╱
           |
        Beam B
```

---

#### Piped

**Descripción:** Conectores tubulares (pipeados)

**Características:**

- Tubos insertados en extremos de vigas
- Conexión mediante pernos o remaches
- Material: PVC, acero o aluminio

---

### 3. Exportación de Datos

#### Formato JSON

```javascript
function exportToJSON(figure) {
    return JSON.stringify({
        metadata: {
            base: 'Icosahedron',
            frequency: 3,
            partial: '7/12',
            radius: 2.20,
            created: new Date().toISOString()
        },

        vertices: figure.$primitives.filter('[type="vertex"]').map(function() {
            var v = this.$points[0];
            return {
                id: v.id,
                x: v.x,
                y: v.y,
                z: v.z
            };
        }).get(),

        edges: figure.$primitives.filter('[type="line"]').map(function() {
            var line = this;
            return {
                id: line.id,
                vertices: line.$sub.vertex.map(v => v.id).get(),
                length: line.product.length,
                type: line.product.label
            };
        }).get(),

        faces: figure.$primitives.filter('[type="face"]').map(function() {
            var face = this;
            return {
                id: face.id,
                vertices: face.$sub.vertex.map(v => v.id).get(),
                area: face.product.area
            };
        }).get()
    }, null, 2);
}
```

---

#### Formato DXF (AutoCAD)

```javascript
function exportToDXF(figure) {
    var dxf = [];

    // Cabecera DXF
    dxf.push('0', 'SECTION');
    dxf.push('2', 'ENTITIES');

    // Exportar líneas
    figure.$primitives.filter('[type="line"]').each(function() {
        var line = this;
        var p1 = line.$points[0];
        var p2 = line.$points[1];

        dxf.push('0', 'LINE');
        dxf.push('8', 'Struts');  // Layer
        dxf.push('10', p1.x.toFixed(6));  // X1
        dxf.push('20', p1.y.toFixed(6));  // Y1
        dxf.push('30', p1.z.toFixed(6));  // Z1
        dxf.push('11', p2.x.toFixed(6));  // X2
        dxf.push('21', p2.y.toFixed(6));  // Y2
        dxf.push('31', p2.z.toFixed(6));  // Z2
    });

    // Pie
    dxf.push('0', 'ENDSEC');
    dxf.push('0', 'EOF');

    return dxf.join('\n');
}
```

---

#### Formato STL (Impresión 3D)

```javascript
function exportToSTL(figure) {
    var stl = [];

    stl.push('solid geodesic_dome');

    // Exportar caras como triángulos
    figure.$primitives.filter('[type="face"]').each(function() {
        var face = this;
        var points = face.$points.get();

        // Triangular si es necesario
        var triangles = (points.length === 3)
            ? [[points[0], points[1], points[2]]]
            : triangulatePolygon(points);

        triangles.forEach(function(triangle) {
            var [p1, p2, p3] = triangle;

            // Calcular normal
            var v1 = p2.subtract(p1);
            var v2 = p3.subtract(p1);
            var normal = v1.crossProduct(v2).normalize();

            stl.push('  facet normal ' +
                     normal.x.toFixed(6) + ' ' +
                     normal.y.toFixed(6) + ' ' +
                     normal.z.toFixed(6));
            stl.push('    outer loop');
            stl.push('      vertex ' + formatVertex(p1));
            stl.push('      vertex ' + formatVertex(p2));
            stl.push('      vertex ' + formatVertex(p3));
            stl.push('    endloop');
            stl.push('  endfacet');
        });
    });

    stl.push('endsolid geodesic_dome');

    return stl.join('\n');
}

function formatVertex(point) {
    return point.x.toFixed(6) + ' ' +
           point.y.toFixed(6) + ' ' +
           point.z.toFixed(6);
}
```

---

## Conclusiones

### Arquitectura del Código

**Fortalezas:**

1. **Modularidad Clara**
   - Separación entre geometría (`Figure`), productos (`Product`) y visualización (`Viewer`)
   - Cada clase tiene responsabilidades bien definidas

2. **Abstracción Efectiva**
   - Primitivas genéricas (vertex, line, face) permiten reutilización
   - Sistema de herencia bien estructurado (`Figure.Icosahedron extends Figure`)

3. **Flexibilidad**
   - Soporta múltiples configuraciones: bases (icosaedro/octaedro), frecuencias, truncamientos
   - Fácil agregar nuevos sistemas de conectores o modos de visualización

4. **Completitud**
   - Desde geometría teórica hasta cálculos constructivos prácticos
   - Incluye visualización 3D, tablas de materiales, exportación

**Áreas de Mejora:**

1. **Performance**
   - Muchas operaciones O(n²): búsqueda de duplicados, detección de relaciones
   - Podría beneficiarse de estructuras espaciales (octree, kd-tree)

2. **Mantenibilidad**
   - Archivo monolítico de 16k líneas dificulta el mantenimiento
   - Bibliotecas minificadas mezcladas con código fuente
   - Falta separación en módulos

3. **Documentación**
   - Comentarios mayormente en ruso
   - Falta documentación de API
   - Algoritmos complejos sin explicación

4. **Testing**
   - No se observan tests unitarios
   - Validación manual propensa a errores

5. **Tecnología Desactualizada**
   - Three.js antiguo (CanvasRenderer deprecado)
   - Podría migrar a WebGL para mejor performance

---

### Conocimientos Requeridos

Para entender y modificar este código se requiere:

**Matemáticas:**
- Geometría esférica
- Álgebra vectorial (productos cruz, punto)
- Teoría de grafos (relaciones vertex-edge-face)
- Trigonometría esférica (ángulos diedros, área)

**Programación:**
- JavaScript avanzado (closures, prototypes)
- Programación funcional (map, reduce, filter)
- Patrón MVVM (Knockout.js)
- Manipulación DOM (jQuery)

**Gráficos 3D:**
- Three.js o similar
- Transformaciones matriciales
- Proyecciones de cámara
- Renderizado de geometrías

**Arquitectura de Software:**
- Separación de responsabilidades
- Diseño orientado a objetos
- Patrones de diseño (Observer, Factory, Strategy)

---

### Aplicaciones Prácticas

**Construcción de Domos Geodésicos:**
- Calcular listas de materiales precisas
- Generar planos de corte para fabricación
- Estimar costos de construcción

**Educación:**
- Enseñar geometría esférica interactivamente
- Visualizar conceptos de subdivisión geodésica
- Explorar relaciones matemáticas (golden ratio)

**Investigación:**
- Optimización de estructuras geodésicas
- Análisis de estabilidad estructural
- Simulación de cargas y tensiones

**Arte y Diseño:**
- Crear instalaciones artísticas geodésicas
- Diseñar estructuras temporales (eventos, festivales)
- Arquitectura experimental

---

### Próximos Pasos Sugeridos

1. **Refactorización:**
   - Separar en módulos ES6
   - Eliminar dependencias de jQuery (usar vanilla JS)
   - Actualizar Three.js a versión moderna

2. **Optimización:**
   - Implementar cache de cálculos costosos
   - Usar Web Workers para operaciones pesadas
   - Implementar lazy loading de geometrías complejas

3. **Testing:**
   - Agregar tests unitarios (Jest, Mocha)
   - Tests de integración para flujo completo
   - Tests de regresión visual

4. **Documentación:**
   - Traducir comentarios a inglés
   - Documentar API completa (JSDoc)
   - Crear tutoriales y ejemplos

5. **Nuevas Características:**
   - Exportación a formatos adicionales (OBJ, FBX)
   - Cálculo de propiedades estructurales (resistencia)
   - Optimización automática de diseño

---

**Documento generado:** 2025-10-07
**Análisis de:** ACIDOME_CALC_251007$7_12_Kruschke_GoodKarma_3V_R2.20_beams_120x40.html
**Líneas analizadas:** 15,889
**Tamaño:** 1.3 MB
