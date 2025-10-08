# ACIDOME - Calculadora de Domos Geodésicos

**Versión Desestructurada** - Octubre 2025

Aplicación web interactiva para el diseño y construcción de domos geodésicos basados en subdivisión de poliedros regulares (icosaedros y octaedros).

---

## 📁 Estructura del Proyecto

```
acidome_IA/
├── index.html                          # Página principal (37 KB)
├── README.md                           # Este archivo
├── ANALISIS_CODIGO.md                  # Documentación técnica completa
│
├── css/                                # Estilos
│   └── acidome.css                     # Estilos personalizados (18 KB)
│
├── lib/                                # Bibliotecas de terceros (995 KB total)
│   ├── jquery.min.js                   # jQuery v1.11.0 (95 KB)
│   ├── underscore.min.js               # Underscore.js 1.8.3 (17 KB)
│   ├── backbone-events.min.js          # Backbone.Events (20 KB)
│   ├── knockout.min.js                 # Knockout.js 3.1.0 (47 KB)
│   ├── three.min.js                    # Three.js r57 (395 KB)
│   └── google-analytics.js             # Google Analytics (421 KB)
│
└── src/                                # Código personalizado
    └── acidome.js                      # Lógica principal de ACIDOME (345 KB)
```

---

## 🚀 Cómo Usar

### Opción 1: Abrir Localmente

1. **Descargar el proyecto**
2. **Abrir `index.html` en un navegador moderno**
   - Chrome, Firefox, Edge, Safari
   - Requiere JavaScript habilitado

### Opción 2: Servidor Local (Recomendado)

Para evitar problemas de CORS con archivos locales:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abrir: `http://localhost:8000`

---

## ⚙️ Funcionalidades

### 🔧 Generación de Geometría
- **Formas base:** Icosaedro (12 vértices, 20 caras) y Octaedro (6 vértices, 8 caras)
- **Frecuencias geodésicas:** 1V, 2V, 3V, 4V, 5V, 6V...
- **Subdivisión Class I** con proyección esférica
- **Truncamiento parcial:** Cortar el domo a fracciones específicas (ej: 7/12, 5/8)

### 📐 Cálculos Constructivos
- **Longitudes de vigas** con precisión milimétrica
- **Ángulos de corte** basados en ángulos diedros
- **Clasificación automática** de vigas por tipo (A, B, C...)
- **Áreas de paneles** (fórmula de L'Huilier para triángulos esféricos)
- **Conectores** con grados y ángulos de convergencia

### 🎨 Visualización
- **Renderizado 3D interactivo** con Three.js
- **Modos de vista:**
  - Carcasa (solo estructura de vigas)
  - Tela (paneles de cobertura)
  - Patrón 2D (para corte de tela)

### 📊 Resultados
- **Tablas de materiales:** Vigas, paneles, conectores
- **Listas de corte** para fabricación
- **Patrones de tela 2D** exportables
- **Estimación de costos**

---

## 💻 Tecnologías Utilizadas

### Bibliotecas de Terceros

| Biblioteca | Versión | Propósito |
|-----------|---------|-----------|
| **jQuery** | 1.11.0 | Manipulación DOM y eventos |
| **Underscore.js** | 1.8.3 | Programación funcional |
| **Backbone.Events** | - | Sistema de eventos (Observer pattern) |
| **Knockout.js** | 3.1.0 | Data binding MVVM bidireccional |
| **Three.js** | r57 | Renderizado 3D con CanvasRenderer |
| **Google Analytics** | - | Seguimiento de uso |

### Código Personalizado

- **Arquitectura:** MVVM (Model-View-ViewModel)
- **Clases principales:**
  - `Vector` - Matemáticas vectoriales 3D
  - `Figure` - Geometría geodésica
  - `Figure.Icosahedron` - Poliedro base
  - `Product` - Componentes constructivos (vigas, paneles, conectores)
  - `Viewer` - Renderizado y visualización

---

## 🧮 Algoritmos Implementados

1. **Generación de icosaedro** (coordenadas basadas en el número áureo φ = 1.618...)
2. **Subdivisión geodésica** con interpolación baricéntrica
3. **Proyección esférica** (normalización vectorial)
4. **Detección de convexidad** de polígonos
5. **Fusión de caras** en bordes
6. **Cálculo de ángulos diedros**
7. **Aplanamiento 2D** para patrones de tela

---

## 📖 Documentación Completa

Para documentación técnica detallada, consultar:

**[ANALISIS_CODIGO.md](ANALISIS_CODIGO.md)**

Incluye:
- Arquitectura completa del sistema
- Descripción detallada de clases y métodos
- Algoritmos geodésicos paso a paso
- Fórmulas matemáticas
- Flujo de ejecución completo
- Estructura de datos

---

## 🎯 Casos de Uso

### 🏗️ Construcción
- Cálculo preciso de materiales para domos
- Generación de listas de corte para fabricación
- Estimación de costos

### 🎓 Educación
- Enseñanza interactiva de geometría esférica
- Visualización de conceptos matemáticos
- Exploración del número áureo

### 🔬 Investigación
- Optimización de estructuras geodésicas
- Análisis de propiedades geométricas
- Simulación de diseños

### 🎨 Arte y Diseño
- Instalaciones artísticas geodésicas
- Estructuras temporales para eventos
- Arquitectura experimental

---

## 📈 Historial de Cambios

### v2.0 - Octubre 2025 (Desestructuración)
- ✅ Separación de bibliotecas de terceros en `lib/`
- ✅ Extracción de CSS a archivo externo `css/acidome.css`
- ✅ Código personalizado separado en `src/acidome.js`
- ✅ Creación de `index.html` limpio y modular
- ✅ Documentación técnica completa en `ANALISIS_CODIGO.md`
- ✅ Mejora significativa en mantenibilidad

### v1.0 - Original
- Archivo HTML monolítico de 15,889 líneas
- Todas las bibliotecas y código embebidos
- Difícil de mantener y modificar

---

## 🤝 Créditos

**Origen:** [Acidome.ru](https://acidome.ru/lab/calc/)
**Autor original:** Popitch
**Desestructuración y documentación:** 2025

---

## 📝 Licencia

Consultar el archivo original para información de licencia.

---

## 🔗 Enlaces Útiles

- **Sitio web:** https://acidome.ru/
- **Grupo de Facebook:** [Acidome Calculator](https://www.facebook.com/groups/acidome.calc/)
- **Documentación de Three.js r57:** https://github.com/mrdoob/three.js/
- **Knockout.js:** https://knockoutjs.com/

---

## 🛠️ Desarrollo Futuro

### Mejoras Sugeridas
1. Actualizar Three.js a versión moderna (WebGL en lugar de CanvasRenderer)
2. Migrar de jQuery a vanilla JavaScript moderno
3. Implementar tests unitarios
4. Refactorizar a módulos ES6
5. Agregar TypeScript para type safety
6. Optimizar performance con Web Workers
7. Implementar exportación a formatos CAD (DXF, STL, OBJ)
8. Añadir cálculos estructurales (resistencia, cargas)

### Bugs Conocidos
- Ninguno reportado en esta versión

---

**Última actualización:** Octubre 7, 2025
