/**
 * ACIDOME Instrumentation Logger - Enterprise Grade
 *
 * Sistema centralizado de logging que captura:
 * - Inputs/outputs de funciones
 * - Stack traces
 * - Performance metrics
 * - Execution flow
 * - Error tracking
 *
 * @version 1.0.0
 * @author ACIDOME Migration Team
 */

(function(window) {
    'use strict';

    /**
     * Logger principal de instrumentación
     */
    class AcidomeLogger {
        constructor(config = {}) {
            this.config = {
                enabled: true,
                logLevel: 'ALL', // ALL, DEBUG, INFO, WARN, ERROR
                captureStackTraces: true,
                capturePerformance: true,
                maxHistorySize: 10000,
                storage: 'memory', // memory, localStorage, indexedDB
                exportFormat: 'json', // json, csv, markdown
                ...config
            };

            this.logs = [];
            this.callGraph = new Map(); // Mapa de llamadas de función
            this.performanceMetrics = new Map();
            this.functionRegistry = new Map(); // Registro de funciones instrumentadas
            this.sessionId = this._generateSessionId();

            console.log('[ACIDOME Logger] Initialized with session:', this.sessionId);
        }

        /**
         * Genera ID único de sesión
         */
        _generateSessionId() {
            return `acidome_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        /**
         * Instrumenta una función para capturar su ejecución
         *
         * @param {Function} fn - Función original
         * @param {string} fnName - Nombre de la función
         * @param {string} module - Módulo al que pertenece (ej: 'Metrics.Vector')
         * @param {Object} metadata - Metadata adicional
         * @returns {Function} Función instrumentada
         */
        instrument(fn, fnName, module = 'Global', metadata = {}) {
            if (!this.config.enabled) return fn;

            const logger = this;
            const functionId = `${module}.${fnName}`;

            // Registrar función
            this.functionRegistry.set(functionId, {
                name: fnName,
                module: module,
                originalFunction: fn,
                metadata: metadata,
                callCount: 0,
                totalTime: 0,
                errors: 0
            });

            // Crear wrapper instrumentado
            return function instrumentedFunction(...args) {
                const callId = logger._generateCallId();
                const startTime = performance.now();
                const stackTrace = logger.config.captureStackTraces ? new Error().stack : null;

                // Registrar entrada
                const logEntry = {
                    callId,
                    functionId,
                    fnName,
                    module,
                    timestamp: Date.now(),
                    event: 'CALL',
                    inputs: logger._serializeArgs(args),
                    stackTrace,
                    context: {
                        thisValue: logger._serializeThis(this)
                    }
                };

                logger._log('DEBUG', logEntry);

                let result, error, hasError = false;

                try {
                    // Ejecutar función original
                    result = fn.apply(this, args);

                    // Capturar resultado
                    const endTime = performance.now();
                    const duration = endTime - startTime;

                    const resultEntry = {
                        callId,
                        functionId,
                        timestamp: Date.now(),
                        event: 'RETURN',
                        output: logger._serializeResult(result),
                        duration,
                        success: true
                    };

                    logger._log('DEBUG', resultEntry);
                    logger._updateMetrics(functionId, duration, false);

                    return result;

                } catch (err) {
                    hasError = true;
                    error = err;

                    const endTime = performance.now();
                    const duration = endTime - startTime;

                    const errorEntry = {
                        callId,
                        functionId,
                        timestamp: Date.now(),
                        event: 'ERROR',
                        error: {
                            message: err.message,
                            stack: err.stack,
                            name: err.name
                        },
                        duration,
                        success: false
                    };

                    logger._log('ERROR', errorEntry);
                    logger._updateMetrics(functionId, duration, true);

                    throw err;
                }
            };
        }

        /**
         * Genera ID único de llamada
         */
        _generateCallId() {
            return `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        /**
         * Serializa argumentos de función
         */
        _serializeArgs(args) {
            return Array.from(args).map((arg, index) => ({
                index,
                type: this._getType(arg),
                value: this._safeStringify(arg)
            }));
        }

        /**
         * Serializa contexto 'this'
         */
        _serializeThis(thisValue) {
            if (!thisValue) return null;
            return {
                type: this._getType(thisValue),
                constructor: thisValue.constructor?.name,
                preview: this._safeStringify(thisValue, 100)
            };
        }

        /**
         * Serializa resultado de función
         */
        _serializeResult(result) {
            return {
                type: this._getType(result),
                value: this._safeStringify(result)
            };
        }

        /**
         * Obtiene tipo detallado de un valor
         */
        _getType(value) {
            if (value === null) return 'null';
            if (value === undefined) return 'undefined';
            if (Array.isArray(value)) return 'Array';
            if (value instanceof Date) return 'Date';
            if (value instanceof RegExp) return 'RegExp';
            if (typeof value === 'object') return value.constructor?.name || 'Object';
            return typeof value;
        }

        /**
         * Stringify seguro (evita errores de circular references)
         */
        _safeStringify(obj, maxLength = 1000) {
            const seen = new WeakSet();

            try {
                const str = JSON.stringify(obj, (key, value) => {
                    if (typeof value === 'object' && value !== null) {
                        if (seen.has(value)) {
                            return '[Circular]';
                        }
                        seen.add(value);
                    }
                    return value;
                });

                return maxLength && str.length > maxLength
                    ? str.substring(0, maxLength) + '...'
                    : str;
            } catch (e) {
                return `[Serialization Error: ${e.message}]`;
            }
        }

        /**
         * Actualiza métricas de performance
         */
        _updateMetrics(functionId, duration, isError) {
            const registry = this.functionRegistry.get(functionId);
            if (registry) {
                registry.callCount++;
                registry.totalTime += duration;
                if (isError) registry.errors++;
            }

            if (!this.performanceMetrics.has(functionId)) {
                this.performanceMetrics.set(functionId, {
                    calls: [],
                    avgDuration: 0,
                    minDuration: Infinity,
                    maxDuration: 0,
                    totalCalls: 0,
                    errors: 0
                });
            }

            const metrics = this.performanceMetrics.get(functionId);
            metrics.calls.push(duration);
            metrics.totalCalls++;
            metrics.minDuration = Math.min(metrics.minDuration, duration);
            metrics.maxDuration = Math.max(metrics.maxDuration, duration);
            metrics.avgDuration = (metrics.avgDuration * (metrics.totalCalls - 1) + duration) / metrics.totalCalls;
            if (isError) metrics.errors++;
        }

        /**
         * Log interno
         */
        _log(level, entry) {
            if (!this._shouldLog(level)) return;

            const logEntry = {
                level,
                sessionId: this.sessionId,
                ...entry
            };

            this.logs.push(logEntry);

            // Limitar tamaño del historial
            if (this.logs.length > this.config.maxHistorySize) {
                this.logs.shift();
            }

            // Log a consola (modo desarrollo)
            if (level === 'ERROR' || this.config.logLevel === 'ALL') {
                console.log(`[${level}] ${entry.functionId}:`, entry);
            }
        }

        /**
         * Verifica si debe loggear según nivel
         */
        _shouldLog(level) {
            const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
            const configLevel = this.config.logLevel;

            if (configLevel === 'ALL') return true;

            const currentIndex = levels.indexOf(level);
            const configIndex = levels.indexOf(configLevel);

            return currentIndex >= configIndex;
        }

        /**
         * Exporta logs en formato JSON
         */
        exportJSON() {
            return JSON.stringify({
                sessionId: this.sessionId,
                timestamp: Date.now(),
                config: this.config,
                logs: this.logs,
                metrics: this._getMetricsSummary(),
                functionRegistry: this._getFunctionRegistrySummary()
            }, null, 2);
        }

        /**
         * Exporta logs en formato Markdown
         */
        exportMarkdown() {
            let md = `# ACIDOME Execution Log\n\n`;
            md += `**Session ID:** ${this.sessionId}\n`;
            md += `**Timestamp:** ${new Date().toISOString()}\n`;
            md += `**Total Logs:** ${this.logs.length}\n\n`;

            md += `## Function Registry\n\n`;
            md += `| Function | Module | Calls | Avg Time | Errors |\n`;
            md += `|----------|--------|-------|----------|--------|\n`;

            for (const [id, info] of this.functionRegistry) {
                const avgTime = info.callCount > 0 ? (info.totalTime / info.callCount).toFixed(2) : '0';
                md += `| ${info.name} | ${info.module} | ${info.callCount} | ${avgTime}ms | ${info.errors} |\n`;
            }

            md += `\n## Performance Metrics\n\n`;
            const metrics = this._getMetricsSummary();
            for (const [funcId, metric] of Object.entries(metrics)) {
                md += `### ${funcId}\n`;
                md += `- **Calls:** ${metric.totalCalls}\n`;
                md += `- **Avg Duration:** ${metric.avgDuration.toFixed(2)}ms\n`;
                md += `- **Min Duration:** ${metric.minDuration.toFixed(2)}ms\n`;
                md += `- **Max Duration:** ${metric.maxDuration.toFixed(2)}ms\n`;
                md += `- **Errors:** ${metric.errors}\n\n`;
            }

            return md;
        }

        /**
         * Resumen de métricas
         */
        _getMetricsSummary() {
            const summary = {};
            for (const [id, metrics] of this.performanceMetrics) {
                summary[id] = {
                    totalCalls: metrics.totalCalls,
                    avgDuration: metrics.avgDuration,
                    minDuration: metrics.minDuration === Infinity ? 0 : metrics.minDuration,
                    maxDuration: metrics.maxDuration,
                    errors: metrics.errors
                };
            }
            return summary;
        }

        /**
         * Resumen de registro de funciones
         */
        _getFunctionRegistrySummary() {
            const summary = {};
            for (const [id, info] of this.functionRegistry) {
                summary[id] = {
                    name: info.name,
                    module: info.module,
                    callCount: info.callCount,
                    totalTime: info.totalTime,
                    errors: info.errors,
                    metadata: info.metadata
                };
            }
            return summary;
        }

        /**
         * Descarga logs como archivo
         */
        download(format = 'json') {
            const content = format === 'json' ? this.exportJSON() : this.exportMarkdown();
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `acidome_log_${this.sessionId}.${format}`;
            a.click();
            URL.revokeObjectURL(url);
        }

        /**
         * Limpia logs
         */
        clear() {
            this.logs = [];
            this.performanceMetrics.clear();
            console.log('[ACIDOME Logger] Logs cleared');
        }

        /**
         * Obtiene estadísticas generales
         */
        getStats() {
            return {
                totalLogs: this.logs.length,
                totalFunctions: this.functionRegistry.size,
                totalCalls: Array.from(this.functionRegistry.values())
                    .reduce((sum, info) => sum + info.callCount, 0),
                totalErrors: Array.from(this.functionRegistry.values())
                    .reduce((sum, info) => sum + info.errors, 0),
                sessionDuration: Date.now() - parseInt(this.sessionId.split('_')[1]),
                topFunctions: this._getTopFunctions(10)
            };
        }

        /**
         * Obtiene funciones más llamadas
         */
        _getTopFunctions(limit = 10) {
            return Array.from(this.functionRegistry.entries())
                .sort((a, b) => b[1].callCount - a[1].callCount)
                .slice(0, limit)
                .map(([id, info]) => ({
                    id,
                    name: info.name,
                    module: info.module,
                    callCount: info.callCount,
                    avgTime: info.callCount > 0 ? (info.totalTime / info.callCount).toFixed(2) : 0
                }));
        }
    }

    // Exponer globalmente
    window.AcidomeLogger = AcidomeLogger;

    // Crear instancia global
    window.acidomeLogger = new AcidomeLogger({
        enabled: true,
        logLevel: 'ALL',
        captureStackTraces: true,
        capturePerformance: true
    });

    console.log('[ACIDOME Logger] Global instance created: window.acidomeLogger');

})(window);
