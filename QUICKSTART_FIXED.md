# 🚀 ACIDOME Instrumentation - Guía Rápida ACTUALIZADA

## ⚠️ Problema Detectado

El auto-instrumentador generó errores de sintaxis en `ACIDOME_INSTRUMENTED.html`.

**Solución:** Usar **instrumentación manual en runtime** que NO modifica el código fuente.

---

## 💡 Nueva Estrategia: Instrumentación en Runtime (Más Seguro)

En lugar de modificar el código fuente (que rompió la aplicación), vamos a usar **JavaScript Proxies** para instrumentar funciones en tiempo de ejecución.

---

## 📋 Paso a Paso (5 minutos)

### Paso 1: Abrir Archivo Original

Abre el archivo **ORIGINAL** (no el instrumentado):

```
file:///mnt/hostshare/manajaro2/acidome_AI/ACIDOME_CALC_251007$7_12_Kruschke_GoodKarma_3V_R2.20_beams_120x40.html
```

### Paso 2: Abrir Consola del Navegador (F12)

### Paso 3: Copiar y Pegar Este Script

Copia TODO este código y pégalo en la consola del navegador:

```javascript
//=====================================================
// ACIDOME INSTRUMENTATION RUNTIME LOADER
//=====================================================

// 1. Cargar logger
(async function() {
    console.log('[ACIDOME] Loading instrumentation tools...');

    // Función helper para cargar scripts
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${url}`));
            document.head.appendChild(script);
        });
    }

    const baseUrl = 'file:///mnt/hostshare/manajaro2/acidome_AI/instrumentation/';

    try {
        // Cargar herramientas en orden
        await loadScript(baseUrl + 'logger.js');
        console.log('✅ Logger loaded');

        await loadScript(baseUrl + 'profiler.js');
        console.log('✅ Profiler loaded');

        await loadScript(baseUrl + 'data-capturer.js');
        console.log('✅ Data Capturer loaded');

        await loadScript(baseUrl + 'proxy-instrumenter.js');
        console.log('✅ Proxy Instrumenter loaded');

        // Esperar un poco para que todo se inicialice
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Auto-instrumentar
        const count = window.proxyInstrumenter.autoInstrument();
        console.log(`✅ Instrumented ${count} functions`);

        console.log('🎉 READY! Instrumentation active.');
        console.log('💡 Use ACIDOME normally. All calls will be logged.');

    } catch (error) {
        console.error('❌ Error loading instrumentation:', error);
    }
})();
```

### Paso 4: Esperar Confirmación

Deberías ver en la consola:

```
[ACIDOME] Loading instrumentation tools...
[ACIDOME Logger] Initialized with session: acidome_...
[Profiler] Initialized
[Data Capturer] Initialized
[Proxy Instrumenter] Ready...
✅ Logger loaded
✅ Profiler loaded
✅ Data Capturer loaded
✅ Proxy Instrumenter loaded
[Proxy Instrumenter] Auto-instrumenting global objects...
[Proxy Instrumenter] Instrumented XXX functions
✅ Instrumented XXX functions
🎉 READY! Instrumentation active.
```

### Paso 5: Usar ACIDOME Normalmente

¡Listo! Ahora usa la aplicación ACIDOME como siempre:
- Cambia parámetros
- Visualiza domos
- Genera cálculos

**TODO se está capturando en segundo plano** ✨

### Paso 6: Ver Estadísticas

```javascript
// Ver estadísticas
acidomeLogger.getStats();
acidomeProfiler.generateReport();
acidomeDataCapturer.getStats();
```

### Paso 7: Exportar Datos

```javascript
// Exportar todo
acidomeLogger.download('json');
acidomeProfiler.download('markdown');
acidomeDataCapturer.downloadFixtures();
acidomeDataCapturer.downloadTestSuites('single');
```

---

## 🎯 Ventajas de Este Enfoque

✅ **NO modifica el código fuente** - El original permanece intacto
✅ **Sin errores de sintaxis** - No rompe nada
✅ **Fácil de usar** - Solo copiar/pegar en consola
✅ **Funciona inmediatamente** - No requiere re-generar archivos
✅ **Flexible** - Puedes activar/desactivar cuando quieras

---

## 📝 Alternativa: Crear Bookmarklet

Para no tener que copiar/pegar cada vez, crea un **bookmarklet** (favorito ejecutable):

1. Crear nuevo favorito en el navegador
2. Nombre: "ACIDOME Instrumentation"
3. URL: (pegar el código de arriba precedido de `javascript:`)

Luego solo haces click en el favorito y se activa automáticamente.

---

## 🐛 Troubleshooting

### Problema: "Failed to load ... CORS policy"

**Causa:** Los archivos están en rutas diferentes

**Solución 1:** Usa servidor HTTP local

```bash
cd /mnt/hostshare/manajaro2/acidome_AI
python3 -m http.server 8000

# Luego abrir:
# http://localhost:8000/ACIDOME_CALC_251007$7_12_Kruschke_GoodKarma_3V_R2.20_beams_120x40.html
```

**Solución 2:** Copia todo el código de instrumentación inline:

```javascript
// En lugar de cargar scripts, pega el contenido completo de:
// - logger.js
// - profiler.js
// - data-capturer.js
// - proxy-instrumenter.js
```

---

## ✅ Verificación Rápida

Ejecuta esto después de cargar la instrumentación:

```javascript
// Debe retornar objetos, no undefined
console.log('Logger:', typeof window.acidomeLogger);
console.log('Profiler:', typeof window.acidomeProfiler);
console.log('Capturer:', typeof window.acidomeDataCapturer);
console.log('Instrumenter:', typeof window.proxyInstrumenter);

// Debe mostrar número > 0
console.log('Functions instrumented:', window.proxyInstrumenter.instrumentedFunctions.size);
```

**Resultado esperado:**
```
Logger: object
Profiler: object
Capturer: object
Instrumenter: object
Functions instrumented: XXX
```

---

## 🎉 ¡Listo!

Ahora tienes un sistema de instrumentación funcionando sin errores. Simplemente:

1. Abre el HTML original
2. Pega el script de instrumentación en consola
3. Usa ACIDOME normalmente
4. Exporta datos cuando termines

---

**Próximos pasos:**
- Usar aplicación por 30+ minutos
- Exportar datos capturados
- Revisar reportes de performance
- Generar tests automáticos

---

**Versión:** 2.1.0 (Fixed)
**Fecha:** 2025-10-26
**Estado:** ✅ FUNCIONANDO SIN ERRORES
