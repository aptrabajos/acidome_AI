/**
 * ACIDOME Data Capturer
 *
 * Captura datos reales de ejecución para usar como test fixtures
 * Genera casos de prueba automáticamente basados en uso real
 *
 * @version 1.0.0
 */

(function(window) {
    'use strict';

    class AcidomeDataCapturer {
        constructor(config = {}) {
            this.config = {
                enabled: true,
                captureMode: 'auto', // auto, manual, selective
                maxCapturesPerFunction: 100,
                storageBackend: 'indexedDB', // indexedDB, localStorage, memory
                autoExport: false,
                ...config
            };

            this.captures = new Map(); // Map<functionId, Array<Capture>>
            this.testSuites = new Map(); // Test suites generados
            this.sessionId = `capture_${Date.now()}`;

            this._initStorage();
            console.log('[Data Capturer] Initialized');
        }

        /**
         * Inicializa storage backend
         */
        _initStorage() {
            if (this.config.storageBackend === 'indexedDB') {
                this._initIndexedDB();
            }
        }

        /**
         * Inicializa IndexedDB
         */
        _initIndexedDB() {
            const request = indexedDB.open('AcidomeCaptures', 1);

            request.onerror = () => {
                console.error('[Data Capturer] IndexedDB error:', request.error);
                this.config.storageBackend = 'memory'; // Fallback
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('[Data Capturer] IndexedDB ready');
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Object store para captures
                if (!db.objectStoreNames.contains('captures')) {
                    const objectStore = db.createObjectStore('captures', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('functionId', 'functionId', { unique: false });
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        }

        /**
         * Captura datos de una llamada a función
         *
         * @param {string} functionId - ID de la función
         * @param {Array} inputs - Argumentos de entrada
         * @param {*} output - Resultado de la función
         * @param {Object} metadata - Metadata adicional
         */
        capture(functionId, inputs, output, metadata = {}) {
            if (!this.config.enabled) return;

            const capture = {
                id: `${functionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                functionId,
                timestamp: Date.now(),
                inputs: this._deepClone(inputs),
                output: this._deepClone(output),
                metadata: {
                    ...metadata,
                    sessionId: this.sessionId
                }
            };

            // Almacenar en memoria
            if (!this.captures.has(functionId)) {
                this.captures.set(functionId, []);
            }

            const functionCaptures = this.captures.get(functionId);

            // Limitar número de captures
            if (functionCaptures.length >= this.config.maxCapturesPerFunction) {
                functionCaptures.shift(); // FIFO
            }

            functionCaptures.push(capture);

            // Persistir en storage backend
            this._persistCapture(capture);

            return capture;
        }

        /**
         * Deep clone de objetos (maneja casos especiales)
         */
        _deepClone(obj) {
            if (obj === null || obj === undefined) return obj;

            // Tipos primitivos
            if (typeof obj !== 'object') return obj;

            // Fechas
            if (obj instanceof Date) return new Date(obj.getTime());

            // Arrays
            if (Array.isArray(obj)) {
                return obj.map(item => this._deepClone(item));
            }

            // Objetos especiales (Vector, Plane, etc.)
            if (obj.constructor && obj.constructor.name) {
                const cloned = {
                    __className: obj.constructor.name,
                    __isSpecialObject: true
                };

                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        try {
                            cloned[key] = this._deepClone(obj[key]);
                        } catch (e) {
                            cloned[key] = `[Clone Error: ${e.message}]`;
                        }
                    }
                }

                return cloned;
            }

            // Objetos genéricos
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    try {
                        cloned[key] = this._deepClone(obj[key]);
                    } catch (e) {
                        cloned[key] = `[Clone Error: ${e.message}]`;
                    }
                }
            }

            return cloned;
        }

        /**
         * Persiste capture en storage backend
         */
        _persistCapture(capture) {
            if (this.config.storageBackend === 'indexedDB' && this.db) {
                const transaction = this.db.transaction(['captures'], 'readwrite');
                const objectStore = transaction.objectStore('captures');
                objectStore.add(capture);
            } else if (this.config.storageBackend === 'localStorage') {
                const key = `acidome_capture_${capture.id}`;
                try {
                    localStorage.setItem(key, JSON.stringify(capture));
                } catch (e) {
                    console.warn('[Data Capturer] localStorage full, falling back to memory');
                }
            }
            // 'memory' mode: ya está en this.captures
        }

        /**
         * Genera test suite para una función
         *
         * @param {string} functionId - ID de la función
         * @param {string} framework - Framework de tests (vitest, jest, mocha)
         * @returns {string} Código del test suite
         */
        generateTestSuite(functionId, framework = 'vitest') {
            const captures = this.captures.get(functionId);
            if (!captures || captures.length === 0) {
                return `// No captures found for ${functionId}`;
            }

            const [module, fnName] = functionId.split('.');

            let code = '';

            // Header
            if (framework === 'vitest') {
                code += `import { describe, it, expect } from 'vitest';\n`;
                code += `import { ${fnName} } from '../src/${module.toLowerCase()}/${fnName}';\n\n`;
            }

            code += `/**\n`;
            code += ` * Auto-generated test suite for ${functionId}\n`;
            code += ` * Generated from ${captures.length} real execution captures\n`;
            code += ` * Session: ${this.sessionId}\n`;
            code += ` */\n\n`;

            code += `describe('${functionId} - Real Data Tests', () => {\n`;

            // Generar tests individuales
            captures.forEach((capture, index) => {
                code += this._generateTestCase(capture, index, framework);
            });

            code += `});\n`;

            this.testSuites.set(functionId, code);
            return code;
        }

        /**
         * Genera un caso de test individual
         */
        _generateTestCase(capture, index, framework) {
            let code = '';

            code += `\n  it('should match real execution #${index + 1}', () => {\n`;
            code += `    // Captured at: ${new Date(capture.timestamp).toISOString()}\n`;

            // Inputs
            code += `    const inputs = ${JSON.stringify(capture.inputs, null, 6).replace(/^/gm, '    ')};\n\n`;

            // Expected output
            code += `    const expected = ${JSON.stringify(capture.output, null, 6).replace(/^/gm, '    ')};\n\n`;

            // Ejecución
            if (Array.isArray(capture.inputs)) {
                code += `    const result = ${this._getFunctionCall(capture.functionId, capture.inputs)};\n\n`;
            }

            // Assertion
            if (framework === 'vitest') {
                code += `    expect(result).toEqual(expected);\n`;
            }

            code += `  });\n`;

            return code;
        }

        /**
         * Genera llamada a función
         */
        _getFunctionCall(functionId, inputs) {
            const [, fnName] = functionId.split('.');

            if (inputs.length === 0) {
                return `${fnName}()`;
            }

            const args = inputs.map((_, i) => `inputs[${i}]`).join(', ');
            return `${fnName}(${args})`;
        }

        /**
         * Exporta todos los test suites generados
         */
        exportAllTestSuites() {
            const suites = {};

            for (const [functionId] of this.captures) {
                suites[functionId] = this.generateTestSuite(functionId);
            }

            return suites;
        }

        /**
         * Exporta fixtures en formato JSON
         */
        exportFixtures() {
            const fixtures = {};

            for (const [functionId, captures] of this.captures) {
                fixtures[functionId] = captures.map(capture => ({
                    id: capture.id,
                    timestamp: capture.timestamp,
                    input: capture.inputs,
                    output: capture.output,
                    metadata: capture.metadata
                }));
            }

            return JSON.stringify(fixtures, null, 2);
        }

        /**
         * Descarga fixtures como archivo
         */
        downloadFixtures() {
            const content = this.exportFixtures();
            const blob = new Blob([content], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `acidome_fixtures_${this.sessionId}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        /**
         * Descarga test suites
         */
        downloadTestSuites(format = 'zip') {
            const suites = this.exportAllTestSuites();

            if (format === 'single') {
                // Un solo archivo con todos los tests
                let allTests = '// ACIDOME Auto-Generated Test Suites\n\n';
                for (const [functionId, code] of Object.entries(suites)) {
                    allTests += `// ============================================\n`;
                    allTests += `// ${functionId}\n`;
                    allTests += `// ============================================\n\n`;
                    allTests += code + '\n\n';
                }

                const blob = new Blob([allTests], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `acidome_tests_${this.sessionId}.spec.ts`;
                a.click();
                URL.revokeObjectURL(url);
            } else {
                console.warn('[Data Capturer] ZIP export not implemented yet');
            }
        }

        /**
         * Obtiene estadísticas de captures
         */
        getStats() {
            let totalCaptures = 0;
            const functionStats = {};

            for (const [functionId, captures] of this.captures) {
                totalCaptures += captures.length;
                functionStats[functionId] = {
                    totalCaptures: captures.length,
                    firstCapture: captures[0]?.timestamp,
                    lastCapture: captures[captures.length - 1]?.timestamp
                };
            }

            return {
                sessionId: this.sessionId,
                totalFunctions: this.captures.size,
                totalCaptures,
                functions: functionStats
            };
        }

        /**
         * Limpia captures
         */
        clear() {
            this.captures.clear();
            this.testSuites.clear();
            console.log('[Data Capturer] Cleared all captures');
        }
    }

    // Exponer globalmente
    window.AcidomeDataCapturer = AcidomeDataCapturer;

    // Crear instancia global
    window.acidomeDataCapturer = new AcidomeDataCapturer();

    console.log('[Data Capturer] Global instance created: window.acidomeDataCapturer');

})(window);
