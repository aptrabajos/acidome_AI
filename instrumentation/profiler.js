/**
 * ACIDOME Performance Profiler
 *
 * Sistema de profiling para análisis de performance
 * Identifica cuellos de botella y funciones lentas
 *
 * @version 1.0.0
 */

(function(window) {
    'use strict';

    class AcidomeProfiler {
        constructor(config = {}) {
            this.config = {
                enabled: true,
                sampleInterval: 10, // ms
                captureMemory: true,
                captureCallStack: true,
                maxSamples: 10000,
                ...config
            };

            this.profiles = new Map();
            this.samples = [];
            this.timeline = [];
            this.sessionStart = performance.now();

            console.log('[Profiler] Initialized');
        }

        /**
         * Inicia profiling de una función
         */
        start(functionId) {
            if (!this.config.enabled) return null;

            const profileId = `${functionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const profile = {
                id: profileId,
                functionId,
                startTime: performance.now(),
                startMemory: this.config.captureMemory ? this._getMemoryUsage() : null,
                marks: [],
                measures: []
            };

            this.profiles.set(profileId, profile);

            // Performance mark
            if (window.performance && window.performance.mark) {
                performance.mark(`${profileId}_start`);
            }

            return profileId;
        }

        /**
         * Finaliza profiling
         */
        end(profileId) {
            if (!profileId || !this.profiles.has(profileId)) return null;

            const profile = this.profiles.get(profileId);

            profile.endTime = performance.now();
            profile.duration = profile.endTime - profile.startTime;
            profile.endMemory = this.config.captureMemory ? this._getMemoryUsage() : null;

            if (profile.startMemory && profile.endMemory) {
                profile.memoryDelta = {
                    usedJSHeapSize: profile.endMemory.usedJSHeapSize - profile.startMemory.usedJSHeapSize,
                    totalJSHeapSize: profile.endMemory.totalJSHeapSize - profile.startMemory.totalJSHeapSize
                };
            }

            // Performance measure
            if (window.performance && window.performance.measure) {
                try {
                    performance.measure(
                        `${profileId}_duration`,
                        `${profileId}_start`
                    );
                } catch (e) {
                    // Ignore if mark doesn't exist
                }
            }

            // Agregar a timeline
            this.timeline.push({
                profileId,
                functionId: profile.functionId,
                startTime: profile.startTime,
                endTime: profile.endTime,
                duration: profile.duration
            });

            return profile;
        }

        /**
         * Marca un punto en el tiempo durante profiling
         */
        mark(profileId, label) {
            if (!profileId || !this.profiles.has(profileId)) return;

            const profile = this.profiles.get(profileId);
            const now = performance.now();

            profile.marks.push({
                label,
                timestamp: now,
                relativeTime: now - profile.startTime
            });

            if (window.performance && window.performance.mark) {
                performance.mark(`${profileId}_${label}`);
            }
        }

        /**
         * Mide tiempo entre dos marks
         */
        measure(profileId, name, startMark, endMark) {
            if (!profileId || !this.profiles.has(profileId)) return;

            const profile = this.profiles.get(profileId);

            const start = profile.marks.find(m => m.label === startMark);
            const end = profile.marks.find(m => m.label === endMark);

            if (start && end) {
                profile.measures.push({
                    name,
                    startMark,
                    endMark,
                    duration: end.timestamp - start.timestamp
                });
            }
        }

        /**
         * Obtiene uso de memoria
         */
        _getMemoryUsage() {
            if (window.performance && window.performance.memory) {
                return {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                };
            }
            return null;
        }

        /**
         * Genera reporte de performance
         */
        generateReport() {
            const functionStats = new Map();

            // Agrupar por función
            for (const [, profile] of this.profiles) {
                if (!functionStats.has(profile.functionId)) {
                    functionStats.set(profile.functionId, {
                        functionId: profile.functionId,
                        calls: [],
                        totalTime: 0,
                        avgTime: 0,
                        minTime: Infinity,
                        maxTime: 0,
                        totalMemoryDelta: 0
                    });
                }

                const stats = functionStats.get(profile.functionId);
                stats.calls.push(profile);
                stats.totalTime += profile.duration || 0;
                stats.minTime = Math.min(stats.minTime, profile.duration || Infinity);
                stats.maxTime = Math.max(stats.maxTime, profile.duration || 0);

                if (profile.memoryDelta) {
                    stats.totalMemoryDelta += profile.memoryDelta.usedJSHeapSize;
                }
            }

            // Calcular promedios
            for (const [, stats] of functionStats) {
                stats.avgTime = stats.totalTime / stats.calls.length;
                stats.callCount = stats.calls.length;
                delete stats.calls; // No incluir en reporte para reducir tamaño
            }

            // Top funciones más lentas
            const topSlowest = Array.from(functionStats.values())
                .sort((a, b) => b.avgTime - a.avgTime)
                .slice(0, 20);

            // Top funciones más llamadas
            const topMostCalled = Array.from(functionStats.values())
                .sort((a, b) => b.callCount - a.callCount)
                .slice(0, 20);

            // Top consumidoras de memoria
            const topMemory = Array.from(functionStats.values())
                .filter(s => s.totalMemoryDelta !== 0)
                .sort((a, b) => Math.abs(b.totalMemoryDelta) - Math.abs(a.totalMemoryDelta))
                .slice(0, 20);

            return {
                summary: {
                    totalProfiles: this.profiles.size,
                    totalFunctions: functionStats.size,
                    sessionDuration: performance.now() - this.sessionStart
                },
                functionStats: Array.from(functionStats.values()),
                topSlowest,
                topMostCalled,
                topMemory,
                timeline: this.timeline
            };
        }

        /**
         * Exporta reporte como JSON
         */
        exportJSON() {
            return JSON.stringify(this.generateReport(), null, 2);
        }

        /**
         * Exporta reporte como Markdown
         */
        exportMarkdown() {
            const report = this.generateReport();

            let md = `# ACIDOME Performance Report\n\n`;
            md += `## Summary\n\n`;
            md += `- **Total Profiles:** ${report.summary.totalProfiles}\n`;
            md += `- **Unique Functions:** ${report.summary.totalFunctions}\n`;
            md += `- **Session Duration:** ${(report.summary.sessionDuration / 1000).toFixed(2)}s\n\n`;

            md += `## Top 20 Slowest Functions (by average time)\n\n`;
            md += `| Rank | Function | Calls | Avg Time | Min Time | Max Time | Total Time |\n`;
            md += `|------|----------|-------|----------|----------|----------|------------|\n`;

            report.topSlowest.forEach((stat, index) => {
                md += `| ${index + 1} | ${stat.functionId} | ${stat.callCount} | ${stat.avgTime.toFixed(3)}ms | ${stat.minTime.toFixed(3)}ms | ${stat.maxTime.toFixed(3)}ms | ${stat.totalTime.toFixed(2)}ms |\n`;
            });

            md += `\n## Top 20 Most Called Functions\n\n`;
            md += `| Rank | Function | Calls | Avg Time | Total Time |\n`;
            md += `|------|----------|-------|----------|------------|\n`;

            report.topMostCalled.forEach((stat, index) => {
                md += `| ${index + 1} | ${stat.functionId} | ${stat.callCount} | ${stat.avgTime.toFixed(3)}ms | ${stat.totalTime.toFixed(2)}ms |\n`;
            });

            if (report.topMemory.length > 0) {
                md += `\n## Top 20 Memory Consumers\n\n`;
                md += `| Rank | Function | Calls | Memory Delta | Avg Delta/Call |\n`;
                md += `|------|----------|-------|--------------|----------------|\n`;

                report.topMemory.forEach((stat, index) => {
                    const avgDelta = stat.totalMemoryDelta / stat.callCount;
                    md += `| ${index + 1} | ${stat.functionId} | ${stat.callCount} | ${this._formatBytes(stat.totalMemoryDelta)} | ${this._formatBytes(avgDelta)} |\n`;
                });
            }

            return md;
        }

        /**
         * Formatea bytes a formato legible
         */
        _formatBytes(bytes) {
            if (bytes === 0) return '0 B';

            const sign = bytes < 0 ? '-' : '';
            bytes = Math.abs(bytes);

            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return sign + (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
        }

        /**
         * Descarga reporte
         */
        download(format = 'markdown') {
            const content = format === 'json' ? this.exportJSON() : this.exportMarkdown();
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `acidome_profile_${Date.now()}.${format === 'json' ? 'json' : 'md'}`;
            a.click();
            URL.revokeObjectURL(url);
        }

        /**
         * Limpia perfiles
         */
        clear() {
            this.profiles.clear();
            this.samples = [];
            this.timeline = [];
            this.sessionStart = performance.now();
            console.log('[Profiler] Cleared all profiles');
        }
    }

    // Exponer globalmente
    window.AcidomeProfiler = AcidomeProfiler;

    // Crear instancia global
    window.acidomeProfiler = new AcidomeProfiler();

    console.log('[Profiler] Global instance created: window.acidomeProfiler');

})(window);
