<template>
  <div v-if="plots" class="plots-container">
    <h2>Technical Drawings</h2>

    <div class="plots-grid">
      <!-- Beam Plot -->
      <div class="plot-card">
        <h3>Beam/Strut Drawing</h3>
        <div class="plot-viewer" v-html="plots.beam?.svg"></div>
        <div class="plot-info">
          <p><strong>{{ plots.beam?.title }}</strong></p>
          <button @click="toggleJson('beam')" class="btn-json">
            {{ showJson.beam ? 'Hide' : 'Show' }} JSON Data
          </button>
          <pre v-if="showJson.beam" class="json-data">{{ JSON.stringify(plots.beam?.json, null, 2) }}</pre>
        </div>
      </div>

      <!-- Panel Plot -->
      <div class="plot-card">
        <h3>Panel Drawing</h3>
        <div class="plot-viewer" v-html="plots.panel?.svg"></div>
        <div class="plot-info">
          <p><strong>{{ plots.panel?.title }}</strong></p>
          <ul v-if="plots.panel?.json" class="plot-details">
            <li>Height: {{ plots.panel.json.height }} mm</li>
            <li>Area: {{ plots.panel.json.area }} mm²</li>
            <li>Unit: {{ plots.panel.json.unit }}</li>
          </ul>
          <button @click="toggleJson('panel')" class="btn-json">
            {{ showJson.panel ? 'Hide' : 'Show' }} JSON Data
          </button>
          <pre v-if="showJson.panel" class="json-data">{{ JSON.stringify(plots.panel?.json, null, 2) }}</pre>
        </div>
      </div>

      <!-- Connector Plot -->
      <div class="plot-card">
        <h3>Connector Node</h3>
        <div class="plot-viewer" v-html="plots.connector?.svg"></div>
        <div class="plot-info">
          <p><strong>{{ plots.connector?.title }}</strong></p>
          <ul v-if="plots.connector?.json" class="plot-details">
            <li>Type: {{ plots.connector.json.connectorType }}</li>
            <li>Convergences: {{ plots.connector.json.convergences }}-way</li>
            <li>Angles: {{ plots.connector.json.angles.join(', ') }}°</li>
          </ul>
          <button @click="toggleJson('connector')" class="btn-json">
            {{ showJson.connector ? 'Hide' : 'Show' }} JSON Data
          </button>
          <pre v-if="showJson.connector" class="json-data">{{ JSON.stringify(plots.connector?.json, null, 2) }}</pre>
        </div>
      </div>

      <!-- Assembly Plot -->
      <div class="plot-card full-width">
        <h3>Assembly Overview</h3>
        <div class="plot-viewer" v-html="plots.assembly?.svg"></div>
        <div class="plot-info">
          <p><strong>{{ plots.assembly?.title }}</strong></p>
          <ul v-if="plots.assembly?.json" class="plot-details assembly-details">
            <li>Beams: {{ plots.assembly.json.components?.beams }}</li>
            <li>Panels: {{ plots.assembly.json.components?.panels }}</li>
            <li>Connectors: {{ plots.assembly.json.components?.connectors }}</li>
            <li>Layout: {{ plots.assembly.json.layout?.columns }} × {{ plots.assembly.json.layout?.rows }}</li>
          </ul>
          <button @click="toggleJson('assembly')" class="btn-json">
            {{ showJson.assembly ? 'Hide' : 'Show' }} JSON Data
          </button>
          <pre v-if="showJson.assembly" class="json-data">{{ JSON.stringify(plots.assembly?.json, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- Export Options -->
    <div class="export-section">
      <h3>Export Options</h3>
      <div class="export-buttons">
        <button @click="downloadSvg('beam')" class="btn-export">
          Download Beam SVG
        </button>
        <button @click="downloadSvg('panel')" class="btn-export">
          Download Panel SVG
        </button>
        <button @click="downloadSvg('connector')" class="btn-export">
          Download Connector SVG
        </button>
        <button @click="downloadSvg('assembly')" class="btn-export">
          Download Assembly SVG
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DomeResults } from '@/api/calculator'
import type { PlotData } from '@/api/plots'

interface ResultsWithPlots extends DomeResults {
  plots?: Record<string, PlotData>
}

const props = defineProps<{
  results: ResultsWithPlots
}>()

const showJson = ref({
  beam: false,
  panel: false,
  connector: false,
  assembly: false,
})

const plots = computed(() => props.results?.plots)

function toggleJson(plotType: keyof typeof showJson) {
  showJson.value[plotType] = !showJson.value[plotType]
}

function downloadSvg(plotType: string) {
  const plot = plots.value?.[plotType]
  if (!plot) return

  const svg = plot.svg
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${plot.type}-${Date.now()}.svg`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.plots-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.plots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.plot-card {
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.plot-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: #0066cc;
}

.plot-card.full-width {
  grid-column: 1 / -1;
}

.plot-card h3 {
  background: #0066cc;
  color: white;
  padding: 1rem;
  margin: 0;
  font-size: 1.1rem;
}

.plot-viewer {
  background: white;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
}

.plot-viewer :deep(svg) {
  border: 1px solid #ddd;
  border-radius: 4px;
  max-width: 100%;
  height: auto;
}

.plot-info {
  padding: 1.5rem;
}

.plot-info p {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-weight: 600;
}

.plot-details {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 1rem 0;
}

.plot-details li {
  color: #555;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.plot-details li:last-child {
  border-bottom: none;
}

.assembly-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.assembly-details li {
  border: none;
  background: #f0f4ff;
  padding: 0.75rem;
  border-radius: 4px;
}

.btn-json {
  background: #f0f0f0;
  color: #0066cc;
  border: 1px solid #0066cc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.btn-json:hover {
  background: #0066cc;
  color: white;
}

.json-data {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0.5rem 0 0 0;
}

.export-section {
  background: #f0f4ff;
  border: 2px solid #0066cc;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.export-section h3 {
  color: #0066cc;
  margin-top: 0;
  margin-bottom: 1rem;
}

.export-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.btn-export {
  background: #0066cc;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-export:hover {
  background: #0052a3;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
}

@media (max-width: 768px) {
  .plots-container {
    padding: 1rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  .plots-grid {
    grid-template-columns: 1fr;
  }

  .plot-card.full-width {
    grid-column: 1;
  }

  .export-buttons {
    grid-template-columns: 1fr;
  }

  .assembly-details {
    grid-template-columns: 1fr;
  }
}
</style>
