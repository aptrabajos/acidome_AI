# 🚀 ACIDOME Instrumentation - Quick Start Guide

Esta guía te llevará de 0 a instrumentación completa en **menos de 5 minutos**.

---

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Verificar Archivos Generados ✅

El sistema ya está configurado y listo. Verifica que existan estos archivos:

```bash
ls -la
```

Deberías ver:
- ✅ `ACIDOME_INSTRUMENTED.html` (archivo instrumentado generado)
- ✅ `instrumentation/` (directorio con herramientas)
  - `logger.js`
  - `profiler.js`
  - `data-capturer.js`
  - `auto-instrumenter.js`
  - `README.md`

---

### Paso 2: Abrir Archivo Instrumentado 🌐

**Opción A: Directamente en navegador** (más simple)

```bash
# En tu navegador, abre:
file:///mnt/hostshare/manajaro2/acidome_AI/ACIDOME_INSTRUMENTED.html
```

**Opción B: Con servidor HTTP** (recomendado para evitar CORS)

```bash
# Opción B1: Python
python3 -m http.server 8000

# Opción B2: Node.js
npx http-server -p 8000

# Luego abrir en navegador:
# http://localhost:8000/ACIDOME_INSTRUMENTED.html
```

---

### Paso 3: Verificar que Funciona 🔍

1. **Abrir Consola del Navegador** (presiona F12)

2. **Verificar que la instrumentación está activa:**

```javascript
// Ejecuta esto en la consola
console.log('✅ Logger:', window.acidomeLogger);
console.log('✅ Profiler:', window.acidomeProfiler);
console.log('✅ Capturer:', window.acidomeDataCapturer);
```

**Deberías ver:**
```
[ACIDOME Logger] Initialized with session: acidome_...
[Profiler] Initialized
[Data Capturer] Initialized
[ACIDOME] Instrumentation ready
✅ Logger: AcidomeLogger { ... }
✅ Profiler: AcidomeProfiler { ... }
✅ Capturer: AcidomeDataCapturer { ... }
```

---

### Paso 4: Usar la Aplicación Normalmente 🎨

Interactúa con ACIDOME como siempre:

- Cambia el **nivel de detalle** (2V, 3V, 4V, etc.)
- Cambia el **método de subdivisión** (Chords, Arcs, Kruschke)
- Cambia el **radio de la esfera**
- Cambia entre **modos de visualización** (Carcass, Cover, Tent)
- Genera **exportaciones OBJ**

**TODO será capturado automáticamente en segundo plano** 🎯

---

### Paso 5: Ver Estadísticas en Vivo 📊

En la consola del navegador, ejecuta:

```javascript
// Ver estadísticas generales
acidomeLogger.getStats();

// Ver funciones más llamadas
acidomeLogger.getStats().topFunctions;

// Ver reporte de performance
acidomeProfiler.generateReport();

// Ver funciones más lentas
acidomeProfiler.generateReport().topSlowest;

// Ver cuántos datos capturó
acidomeDataCapturer.getStats();
```

---

### Paso 6: Exportar Datos 💾

Después de usar la aplicación por un rato (5-10 minutos), exporta los datos:

```javascript
// Exportar TODOS los datos de una vez
acidomeLogger.download('json');           // Logs completos
acidomeProfiler.download('markdown');     // Reporte de performance
acidomeDataCapturer.downloadFixtures();   // Datos para tests
acidomeDataCapturer.downloadTestSuites('single'); // Tests auto-generados
```

**Esto descargará 4 archivos:**
1. `acidome_log_XXXXX.json` - Historial completo de llamadas
2. `acidome_profile_XXXXX.md` - Reporte de performance
3. `acidome_fixtures_XXXXX.json` - Datos capturados para tests
4. `acidome_tests_XXXXX.spec.ts` - Tests unitarios auto-generados

---

## 🎯 Qué Hacer con los Datos Exportados

### 1. **Logs (JSON)**
- Revisar qué funciones se llaman y cuándo
- Identificar flujo de ejecución
- Detectar errores o comportamientos inesperados

### 2. **Reporte de Performance (Markdown)**
- Abrir en cualquier editor de Markdown
- Identificar funciones más lentas
- Priorizar optimizaciones en la migración

### 3. **Fixtures (JSON)**
- Copiar a `migration/tests/fixtures/`
- Usar como datos de prueba reales
- Garantizar que la migración funciona igual

### 4. **Test Suites (TypeScript)**
- Copiar a `migration/tests/unit/`
- Ejecutar con `npm test`
- Validar que código migrado produce mismos resultados

---

## 📈 Ejemplo Completo de Sesión

```javascript
// ============================================
// SESIÓN DE CAPTURA COMPLETA (30 minutos)
// ============================================

// 1. Verificar que está instrumentado
console.log('[Session Start]', new Date().toISOString());
console.log('Logger:', acidomeLogger);
console.log('Profiler:', acidomeProfiler);
console.log('Capturer:', acidomeDataCapturer);

// 2. USAR LA APLICACIÓN NORMALMENTE
//    - Cambiar parámetros
//    - Explorar visualizaciones
//    - Generar exportaciones
//    ... (usar por 30 minutos) ...

// 3. Ver estadísticas intermedias
console.log('[Midpoint Check]');
console.log('Total calls:', acidomeLogger.getStats().totalCalls);
console.log('Functions captured:', acidomeDataCapturer.getStats().totalFunctions);

// 4. Continuar usando...
//    ... (otros 30 minutos) ...

// 5. Al final, exportar TODO
console.log('[Session End]', new Date().toISOString());

acidomeLogger.download('json');
acidomeLogger.download('markdown');
acidomeProfiler.download('markdown');
acidomeDataCapturer.downloadFixtures();
acidomeDataCapturer.downloadTestSuites('single');

console.log('[Session Complete] All data exported!');

// 6. Ver resumen final
console.table(acidomeLogger.getStats().topFunctions);
console.table(acidomeProfiler.generateReport().topSlowest);
console.log('Total captures:', acidomeDataCapturer.getStats().totalCaptures);
```

---

## 🎓 Casos de Uso Específicos

### Caso 1: Quiero Capturar Datos de Vector.add

```javascript
// 1. Ejecutar operaciones con vectores
const v1 = new Metrics.Vector(1, 2, 3);
const v2 = new Metrics.Vector(4, 5, 6);
const result = Metrics.Vector.add(v1, v2);

// 2. Ver capturas
acidomeDataCapturer.captures.get('Metrics.Vector.add');

// 3. Generar test
const testCode = acidomeDataCapturer.generateTestSuite('Metrics.Vector.add');
console.log(testCode);
```

### Caso 2: Quiero Saber Qué Funciones Son Más Lentas

```javascript
// 1. Usar aplicación normalmente
// 2. Ver reporte
const report = acidomeProfiler.generateReport();

// 3. Ver top 10 más lentas
console.table(report.topSlowest.slice(0, 10));

// 4. Exportar para análisis detallado
acidomeProfiler.download('markdown');
```

### Caso 3: Quiero Generar Tests para Todo el Módulo Metrics

```javascript
// 1. Usar funciones de Metrics extensivamente
const v = new Metrics.Vector(1, 2, 3);
v.normalize();
v.add(new Metrics.Vector(4, 5, 6));
const angle = v.angleWith(new Metrics.Vector(0, 1, 0));
// ... etc.

// 2. Ver qué funciones se capturaron
acidomeDataCapturer.getStats();

// 3. Generar tests
acidomeDataCapturer.downloadTestSuites('single');

// 4. Copiar archivo descargado a tests/unit/
```

---

## ⚠️ Troubleshooting

### Problema: No veo mensajes de instrumentación en consola

**Solución:**
1. Verifica que abriste `ACIDOME_INSTRUMENTED.html` (NO el original)
2. Abre consola del navegador (F12)
3. Recarga página (Ctrl+R)
4. Deberías ver: `[ACIDOME] Instrumentation ready`

### Problema: "Cannot read property 'acidomeLogger' of undefined"

**Solución:**
Los scripts de instrumentación no se cargaron. Verifica:
```javascript
// Debe existir el directorio
ls -la instrumentation/

// Los archivos deben estar ahí
ls instrumentation/*.js
```

### Problema: Aplicación va muy lenta

**Solución:**
Reducir nivel de captura:
```javascript
// Deshabilitar captura de stack traces
acidomeLogger.config.captureStackTraces = false;

// Reducir capturas por función
acidomeDataCapturer.config.maxCapturesPerFunction = 50;

// Recargar página
location.reload();
```

---

## 📚 Documentación Completa

Para más detalles, revisa:

📖 **[instrumentation/README.md](instrumentation/README.md)** - Documentación completa del sistema
📖 **[PLAN_MIGRACION.md](PLAN_MIGRACION.md)** - Plan de migración a Vue 3
📖 **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura del sistema

---

## ✅ Checklist de Sesión Exitosa

Antes de terminar tu sesión, verifica:

- [ ] ✅ Archivo instrumentado abierto correctamente
- [ ] ✅ Consola muestra "Instrumentation ready"
- [ ] ✅ Usé la aplicación por al menos 30 minutos
- [ ] ✅ Probé múltiples configuraciones (2V, 3V, 4V, etc.)
- [ ] ✅ Probé todos los modos de visualización
- [ ] ✅ Exporté logs (`acidomeLogger.download('json')`)
- [ ] ✅ Exporté reporte de performance (`acidomeProfiler.download('markdown')`)
- [ ] ✅ Exporté fixtures (`acidomeDataCapturer.downloadFixtures()`)
- [ ] ✅ Exporté test suites (`acidomeDataCapturer.downloadTestSuites('single')`)
- [ ] ✅ Guardé archivos en ubicación segura
- [ ] ✅ Revisé que los archivos se descargaron correctamente

---

## 🎯 Objetivos de Captura

Para tener suficientes datos para la migración, intenta lograr:

**Mínimo:**
- ✅ 1000+ llamadas a funciones capturadas
- ✅ 100+ funciones únicas con al menos 1 captura
- ✅ Al menos 1 sesión completa de 30+ minutos

**Ideal:**
- 🌟 5000+ llamadas capturadas
- 🌟 200+ funciones únicas
- 🌟 5+ sesiones de 30+ minutos cada una
- 🌟 Cobertura de todos los módulos (Metrics, Figure, Product, Viewer)

---

## 🚀 Próximos Pasos

Una vez que tengas datos capturados:

1. **Analizar reportes de performance** → Identificar funciones lentas
2. **Revisar fixtures capturados** → Verificar cobertura
3. **Priorizar migración** → Comenzar por funciones críticas
4. **Ejecutar tests auto-generados** → Validar que funcionan
5. **Iniciar migración incremental** → Función por función

---

**¿Listo para empezar?** 🎉

Abre `ACIDOME_INSTRUMENTED.html` en tu navegador y comienza a capturar datos!

---

**Versión:** 1.0.0
**Última actualización:** 2025-10-26
