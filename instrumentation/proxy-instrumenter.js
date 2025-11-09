/**
 * ACIDOME Proxy-Based Instrumenter
 *
 * Instrumenta funciones sin modificar el código fuente
 * Usa JavaScript Proxies para interceptar llamadas
 *
 * @version 2.0.0
 */

(function(window) {
    'use strict';

    class ProxyInstrumenter {
        constructor() {
            this.instrumentedFunctions = new Set();
            this.logger = window.acidomeLogger;
            this.profiler = window.acidomeProfiler;
            this.capturer = window.acidomeDataCapturer;
        }

        /**
         * Instrumenta un objeto completo (sus métodos)
         *
         * @param {Object} obj - Objeto a instrumentar
         * @param {string} objectName - Nombre del objeto
         */
        instrumentObject(obj, objectName) {
            if (!obj || typeof obj !== 'object') return obj;

            for (const key in obj) {
                if (typeof obj[key] === 'function') {
                    this.instrumentFunction(obj, key, `${objectName}.${key}`);
                }
            }

            return obj;
        }

        /**
         * Instrumenta una función específica
         *
         * @param {Object} context - Contexto del objeto
         * @param {string} methodName - Nombre del método
         * @param {string} fullName - Nombre completo para logging
         */
        instrumentFunction(context, methodName, fullName) {
            const original = context[methodName];

            if (typeof original !== 'function') return;
            if (this.instrumentedFunctions.has(fullName)) return;

            const logger = this.logger;
            const profiler = this.profiler;
            const capturer = this.capturer;

            context[methodName] = function(...args) {
                const functionId = fullName;
                let profileId = null;

                // Iniciar profiling
                if (profiler) {
                    profileId = profiler.start(functionId);
                }

                let result, error;

                try {
                    // Ejecutar función original
                    result = original.apply(this, args);

                    // Capturar datos
                    if (capturer) {
                        capturer.capture(functionId, args, result);
                    }

                    return result;

                } catch (err) {
                    error = err;
                    throw err;

                } finally {
                    // Finalizar profiling
                    if (profileId && profiler) {
                        profiler.end(profileId);
                    }

                    // Log
                    if (logger) {
                        logger._log(error ? 'ERROR' : 'DEBUG', {
                            functionId,
                            event: error ? 'ERROR' : 'CALL',
                            inputs: args,
                            output: result,
                            error: error ? { message: error.message, stack: error.stack } : undefined,
                            timestamp: Date.now()
                        });
                    }
                }
            };

            // Preservar nombre original
            Object.defineProperty(context[methodName], 'name', {
                value: methodName,
                writable: false
            });

            this.instrumentedFunctions.add(fullName);
        }

        /**
         * Instrumenta prototype de una clase
         */
        instrumentPrototype(constructor, className) {
            if (!constructor || !constructor.prototype) return;

            const proto = constructor.prototype;
            for (const key in proto) {
                if (typeof proto[key] === 'function' && key !== 'constructor') {
                    this.instrumentFunction(proto, key, `${className}.prototype.${key}`);
                }
            }
        }

        /**
         * Auto-detecta y instrumenta objetos globales comunes
         */
        autoInstrument() {
            console.log('[Proxy Instrumenter] Auto-instrumenting global objects...');

            // Lista de objetos a instrumentar
            const targets = [
                { obj: window.Metrics, name: 'Metrics' },
                { obj: window.Vector, name: 'Vector' },
                { obj: window.Plane, name: 'Plane' },
                { obj: window.Quat, name: 'Quat' },
                { obj: window.Figure, name: 'Figure' },
                { obj: window.Product, name: 'Product' },
                { obj: window.Viewer, name: 'Viewer' },
                { obj: window.Plotter, name: 'Plotter' }
            ];

            targets.forEach(({ obj, name }) => {
                if (obj) {
                    this.instrumentObject(obj, name);

                    // Instrumentar prototype si existe
                    if (typeof obj === 'function') {
                        this.instrumentPrototype(obj, name);
                    }
                }
            });

            console.log(`[Proxy Instrumenter] Instrumented ${this.instrumentedFunctions.size} functions`);

            return this.instrumentedFunctions.size;
        }

        /**
         * Obtiene estadísticas
         */
        getStats() {
            return {
                totalInstrumented: this.instrumentedFunctions.size,
                functions: Array.from(this.instrumentedFunctions)
            };
        }
    }

    // Exponer globalmente
    window.ProxyInstrumenter = ProxyInstrumenter;

    // Crear instancia global
    window.proxyInstrumenter = new ProxyInstrumenter();

    console.log('[Proxy Instrumenter] Ready. Call proxyInstrumenter.autoInstrument() to start');

})(window);
