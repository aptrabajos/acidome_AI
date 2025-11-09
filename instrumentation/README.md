# 🔬 ACIDOME Instrumentation System

Sistema profesional de instrumentación, profiling y captura de datos para facilitar la migración de ACIDOME a tecnologías modernas.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Componentes del Sistema](#componentes-del-sistema)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Uso del Sistema](#uso-del-sistema)
5. [Flujo de Trabajo](#flujo-de-trabajo)
6. [API Reference](#api-reference)
7. [Exportación de Datos](#exportación-de-datos)
8. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 📖 Descripción General

El sistema de instrumentación de ACIDOME permite:

✅ **Logging centralizado** de todas las llamadas a funciones
✅ **Profiling de performance** para identificar cuellos de botella
✅ **Captura de datos reales** para generar test fixtures automáticamente
✅ **Auto-instrumentación** del código original sin modificar el archivo fuente
✅ **Generación automática** de tests unitarios basados en ejecución real

### 🎯 Objetivo Principal

Facilitar la migración de ACIDOME (jQuery + Knockout) a tecnologías modernas (Vue 3 + TypeScript) garantizando que el comportamiento se mantenga idéntico.

---

## 🧩 Componentes del Sistema

### 1. **Logger Centralizado** (`logger.js`)

Sistema enterprise-grade de logging que captura:
- Inputs y outputs de cada función
- Stack traces completos
- Métricas de performance por función
- Conteo de llamadas y errores
- Historial completo de ejecución

**Ubicación:** `instrumentation/logger.js`
**Instancia global:** `window.acidomeLogger`

---

### 2. **Performance Profiler** (`profiler.js`)

Profiler avanzado que mide:
- Tiempo de ejecución de cada función
- Uso de memoria (heap size)
- Timeline de ejecución
- Identificación de funciones lentas
- Reportes detallados de performance

**Ubicación:** `instrumentation/profiler.js`
**Instancia global:** `window.acidomeProfiler`

---

### 3. **Data Capturer** (`data-capturer.js`)

Captura datos reales para testing:
- Argumentos de entrada de funciones
- Resultados de salida
- Generación automática de test suites
- Exportación de fixtures en JSON
- Almacenamiento en IndexedDB/localStorage

**Ubicación:** `instrumentation/data-capturer.js`
**Instancia global:** `window.acidomeDataCapturer`

---

### 4. **Auto-Instrumenter** (`auto-instrumenter.js`)

Script Node.js que:
- Procesa el archivo HTML monolítico original
- Inyecta código de instrumentación automáticamente
- Mantiene el archivo original intacto
- Genera versión instrumentada lista para usar

**Ubicación:** `instrumentation/auto-instrumenter.js`
**Tipo:** Script CLI de Node.js

---

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js v14+ (para auto-instrumentador)
- Navegador moderno (Chrome, Firefox, Edge)

### Paso 1: Generar Archivo Instrumentado

```bash
cd /mnt/hostshare/manajaro2/acidome_AI

# Ejecutar auto-instrumentador
node instrumentation/auto-instrumenter.js \
  "ACIDOME_CALC_251007\$7_12_Kruschke_GoodKarma_3V_R2.20_beams_120x40.html" \
  "ACIDOME_INSTRUMENTED.html"
```

**Resultado:**
```
✅ Total functions found: 527
✅ Instrumented: 527
✅ Skipped: 6 (minified libraries)
```

### Paso 2: Abrir Archivo Instrumentado

```bash
# Opción A: Directamente en navegador
file:///mnt/hostshare/manajaro2/acidome_AI/ACIDOME_INSTRUMENTED.html

# Opción B: Con servidor HTTP (recomendado)
python3 -m http.server 8000
# Luego abrir: http://localhost:8000/ACIDOME_INSTRUMENTED.html
```

### Paso 3: Verificar Instrumentación

Abrir consola del navegador (F12) y verificar:

```javascript
// Verificar que los sistemas están cargados
console.log(window.acidomeLogger);       // Logger centralizado
console.log(window.acidomeProfiler);     // Profiler de performance
console.log(window.acidomeDataCapturer); // Capturador de datos
```

Deberías ver:
```
[ACIDOME Logger] Initialized with session: acidome_1730000000000_abc123
[Profiler] Initialized
[Data Capturer] Initialized
[ACIDOME] Instrumentation ready
```

---

## 💻 Uso del Sistema

### Uso Básico

Una vez que abras `ACIDOME_INSTRUMENTED.html` en el navegador, el sistema comenzará a capturar automáticamente **todas las llamadas a funciones**.

#### 1. Interactuar con la Aplicación

Usa la aplicación ACIDOME normalmente:
- Cambia parámetros del domo (frecuencia, radio, método, etc.)
- Cambia modos de visualización (carcass, cover, tent, etc.)
- Genera cálculos de vigas, conectores y paneles
- Exporta archivos OBJ

**Todo será capturado automáticamente en segundo plano.**

#### 2. Ver Estadísticas en Tiempo Real

En la consola del navegador:

```javascript
// Ver estadísticas del logger
acidomeLogger.getStats();

// Ver estadísticas del profiler
acidomeProfiler.generateReport();

// Ver estadísticas de captura de datos
acidomeDataCapturer.getStats();
```

#### 3. Exportar Datos

```javascript
// Exportar logs
acidomeLogger.download('json');      // Descargar como JSON
acidomeLogger.download('markdown');  // Descargar como Markdown

// Exportar reporte de performance
acidomeProfiler.download('markdown');

// Exportar fixtures para tests
acidomeDataCapturer.downloadFixtures();

// Exportar test suites auto-generados
acidomeDataCapturer.downloadTestSuites('single');
```

---

## 🔄 Flujo de Trabajo Completo

### Fase 1: Captura de Datos (1-2 días)

1. **Abrir `ACIDOME_INSTRUMENTED.html`**
2. **Usar la aplicación exhaustivamente:**
   - Probar todas las combinaciones de parámetros
   - Explorar todos los modos de visualización
   - Generar múltiples configuraciones de domos
   - Exportar archivos
3. **Dejar correr durante sesiones largas** (varias horas)
4. **Exportar datos capturados:**
   ```javascript
   // Al final de la sesión
   acidomeDataCapturer.downloadFixtures();
   acidomeDataCapturer.downloadTestSuites('single');
   acidomeProfiler.download('markdown');
   acidomeLogger.download('json');
   ```

### Fase 2: Análisis de Datos (1 día)

1. **Revisar reportes de performance:**
   - Identificar funciones más lentas
   - Encontrar cuellos de botella
   - Analizar uso de memoria

2. **Analizar fixtures capturados:**
   - Ver qué funciones se llaman más
   - Identificar casos edge
   - Detectar patrones de uso

3. **Priorizar migración:**
   - Funciones más críticas primero
   - Funciones más lentas para optimización
   - Funciones independientes para TDD

### Fase 3: Migración Incremental (4-6 semanas)

1. **Migrar función por función:**
   ```bash
   # Ejemplo: Migrar Vector.add
   # 1. Crear test desde fixture capturado
   cp migration/tests/fixtures/Vector.add.json migration/tests/unit/

   # 2. Crear implementación TypeScript
   # migration/src/core/metrics/Vector.ts

   # 3. Ejecutar tests
   npm test
   ```

2. **Validar con datos reales:**
   - Los tests usan datos capturados del original
   - Garantiza comportamiento idéntico
   - Detecta regresiones automáticamente

3. **Iterar hasta completar módulo**

### Fase 4: Validación Final (1 semana)

1. **Ejecutar suite completa de tests**
2. **Comparar visual con original**
3. **Medir mejoras de performance**
4. **Documentar cambios**

---

## 📚 API Reference

### Logger API

```javascript
// Inicializar
const logger = new AcidomeLogger({
    enabled: true,
    logLevel: 'ALL',        // ALL, DEBUG, INFO, WARN, ERROR
    captureStackTraces: true,
    capturePerformance: true,
    maxHistorySize: 10000
});

// Instrumentar función manualmente
const originalFn = (a, b) => a + b;
const instrumented = logger.instrument(originalFn, 'add', 'Math');

// Obtener estadísticas
const stats = logger.getStats();
// { totalLogs, totalFunctions, totalCalls, totalErrors, topFunctions }

// Exportar
logger.exportJSON();      // Retorna string JSON
logger.exportMarkdown();  // Retorna string Markdown
logger.download('json');  // Descarga archivo

// Limpiar
logger.clear();
```

### Profiler API

```javascript
// Inicializar
const profiler = new AcidomeProfiler({
    enabled: true,
    captureMemory: true,
    captureCallStack: true
});

// Profiling manual
const profileId = profiler.start('MyFunction');
// ... ejecutar función ...
const profile = profiler.end(profileId);

// Marcar puntos
profiler.mark(profileId, 'checkpoint1');
profiler.mark(profileId, 'checkpoint2');
profiler.measure(profileId, 'duration', 'checkpoint1', 'checkpoint2');

// Generar reporte
const report = profiler.generateReport();
// { summary, functionStats, topSlowest, topMostCalled, topMemory, timeline }

// Exportar
profiler.download('markdown');

// Limpiar
profiler.clear();
```

### Data Capturer API

```javascript
// Inicializar
const capturer = new AcidomeDataCapturer({
    enabled: true,
    maxCapturesPerFunction: 100,
    storageBackend: 'indexedDB'
});

// Capturar manualmente
capturer.capture('Vector.add', [vectorA, vectorB], result, {
    note: 'Test case 1'
});

// Generar test suite
const testCode = capturer.generateTestSuite('Vector.add', 'vitest');
console.log(testCode);

// Exportar fixtures
const fixtures = capturer.exportFixtures();
capturer.downloadFixtures();

// Exportar test suites
capturer.downloadTestSuites('single');

// Estadísticas
const stats = capturer.getStats();
// { sessionId, totalFunctions, totalCaptures, functions }

// Limpiar
capturer.clear();
```

---

## 📤 Exportación de Datos

### Formatos Disponibles

#### 1. JSON (Logs, Fixtures, Performance)

```json
{
  "sessionId": "acidome_1730000000000_abc123",
  "timestamp": 1730000000000,
  "logs": [ ... ],
  "metrics": {
    "Vector.add": {
      "totalCalls": 1523,
      "avgDuration": 0.012,
      "minDuration": 0.008,
      "maxDuration": 0.045,
      "errors": 0
    }
  }
}
```

#### 2. Markdown (Reportes)

```markdown
# ACIDOME Performance Report

## Summary
- **Total Profiles:** 15234
- **Unique Functions:** 527
- **Session Duration:** 3542.34s

## Top 20 Slowest Functions

| Rank | Function | Calls | Avg Time | Total Time |
|------|----------|-------|----------|------------|
| 1    | Figure.splitFaces | 45 | 234.56ms | 10555ms |
| 2    | Product.generate | 120 | 45.23ms | 5428ms |
...
```

#### 3. Test Suites (TypeScript/JavaScript)

```typescript
import { describe, it, expect } from 'vitest';
import { add } from '../src/metrics/Vector';

describe('Vector.add - Real Data Tests', () => {
  it('should match real execution #1', () => {
    // Captured at: 2025-10-26T01:23:45.678Z
    const inputs = [
      { x: 1, y: 2, z: 3 },
      { x: 4, y: 5, z: 6 }
    ];

    const expected = { x: 5, y: 7, z: 9 };

    const result = add(inputs[0], inputs[1]);

    expect(result).toEqual(expected);
  });
});
```

---

## 🎓 Ejemplos Prácticos

### Ejemplo 1: Capturar Datos de Vector.add

```javascript
// 1. Abrir ACIDOME_INSTRUMENTED.html
// 2. En consola del navegador:

// Crear dos vectores y sumarlos
const v1 = new Metrics.Vector(1, 2, 3);
const v2 = new Metrics.Vector(4, 5, 6);
const result = Metrics.Vector.add(v1, v2);

// 3. Ver captura
acidomeDataCapturer.captures.get('Metrics.Vector.add');

// 4. Generar test
const testCode = acidomeDataCapturer.generateTestSuite('Metrics.Vector.add');
console.log(testCode);

// 5. Descargar
acidomeDataCapturer.downloadTestSuites('single');
```

### Ejemplo 2: Analizar Performance de Cálculo de Domo

```javascript
// 1. Cambiar parámetros del domo a 6V (frecuencia alta)
form.detail(6);

// 2. Esperar que calcule...

// 3. Ver funciones más lentas
const report = acidomeProfiler.generateReport();
console.table(report.topSlowest);

// 4. Descargar reporte
acidomeProfiler.download('markdown');
```

### Ejemplo 3: Capturar Sesión Completa

```javascript
// Al inicio de sesión
console.log('Starting capture session...');

// Usar aplicación normalmente durante 30 minutos
// ...

// Al final
console.log('Exporting all data...');

acidomeLogger.download('json');
acidomeProfiler.download('markdown');
acidomeDataCapturer.downloadFixtures();
acidomeDataCapturer.downloadTestSuites('single');

console.log('Session complete!');
```

---

## 🔧 Configuración Avanzada

### Personalizar Auto-Instrumentador

Editar `instrumentation/auto-instrumenter.js`:

```javascript
const instrumenter = new AutoInstrumenter({
    instrumentFunctions: true,      // Instrumentar funciones
    instrumentMethods: true,        // Instrumentar métodos
    instrumentConstructors: true,   // Instrumentar constructores
    skipMinified: true,             // Skip código minificado
    verbose: true                   // Modo verbose
});
```

### Filtrar Funciones a Capturar

```javascript
// En data-capturer.js, modificar método capture:
capture(functionId, inputs, output, metadata = {}) {
    // Solo capturar funciones de Metrics y Figure
    if (!functionId.startsWith('Metrics.') && !functionId.startsWith('Figure.')) {
        return;
    }

    // Resto del código...
}
```

---

## 📊 Métricas de Éxito

### Objetivos de Captura

- ✅ **Cobertura:** > 90% de funciones con al menos 1 captura
- ✅ **Casos de prueba:** > 1000 fixtures capturados
- ✅ **Funciones críticas:** > 10 capturas cada una
- ✅ **Sesiones:** Mínimo 5 sesiones completas de uso

### Indicadores de Calidad

- **Completitud:** Todas las rutas de código ejecutadas
- **Diversidad:** Variedad de casos edge capturados
- **Realismo:** Datos representativos de uso real
- **Validez:** 100% de tests generados pasan

---

## 🐛 Troubleshooting

### Problema: "ACIDOME_INSTRUMENTATION is undefined"

**Solución:** Verificar que los scripts de instrumentación se cargaron correctamente:

```javascript
// En consola
console.log(window.acidomeLogger);
console.log(window.ACIDOME_INSTRUMENTATION);
```

### Problema: "IndexedDB quota exceeded"

**Solución:** Cambiar a localStorage o memory:

```javascript
acidomeDataCapturer.config.storageBackend = 'memory';
```

### Problema: "Too many captures, slowing down"

**Solución:** Reducir límite de captures:

```javascript
acidomeDataCapturer.config.maxCapturesPerFunction = 50;
```

---

## 📝 Notas Importantes

⚠️ **NUNCA** modificar el archivo original (`ACIDOME_CALC_251007$7_12_Kruschke_GoodKarma_3V_R2.20_beams_120x40.html`)

✅ **SIEMPRE** usar `ACIDOME_INSTRUMENTED.html` para captura

✅ **EXPORTAR** datos regularmente para no perderlos

✅ **VERSIONAR** fixtures y tests en Git

---

## 🚀 Próximos Pasos

1. **Ejecutar sesiones de captura** (1-2 días)
2. **Analizar reportes de performance** (1 día)
3. **Priorizar componentes a migrar** (1 día)
4. **Comenzar migración incremental** (4-6 semanas)
5. **Validar con tests auto-generados** (continuo)

---

## 📞 Soporte

Para preguntas o problemas:
- Revisar logs en consola del navegador (F12)
- Verificar que Node.js esté instalado (para auto-instrumentador)
- Asegurar que el navegador soporta IndexedDB

---

**Versión:** 1.0.0
**Última actualización:** 2025-10-26
**Autor:** ACIDOME Migration Team
