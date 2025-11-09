<template>
  <div class="results-container">
    <h2>Calculation Results</h2>

    <div class="results-grid">
      <!-- Geometry Section -->
      <div class="result-card">
        <h3>Geometry</h3>
        <div class="result-item">
          <span class="label">Vertices:</span>
          <span class="value">{{ results.geometry.vertices }}</span>
        </div>
        <div class="result-item">
          <span class="label">Faces (Panels):</span>
          <span class="value">{{ results.geometry.faces }}</span>
        </div>
        <div class="result-item">
          <span class="label">Edges (Beams):</span>
          <span class="value">{{ results.geometry.edges }}</span>
        </div>
      </div>

      <!-- Dimensions Section -->
      <div class="result-card">
        <h3>Dimensions</h3>
        <div class="result-item">
          <span class="label">Height from Base:</span>
          <span class="value">{{ results.dimensions.heightFromBase.toFixed(2) }} m</span>
        </div>
        <div class="result-item">
          <span class="label">Base Radius:</span>
          <span class="value">{{ results.dimensions.baseRadius.toFixed(2) }} m</span>
        </div>
        <div class="result-item">
          <span class="label">Base Area:</span>
          <span class="value">{{ results.dimensions.baseArea.toFixed(2) }} m²</span>
        </div>
        <div class="result-item">
          <span class="label">Coverage Area:</span>
          <span class="value">{{ results.dimensions.coverageArea.toFixed(2) }} m²</span>
        </div>
      </div>

      <!-- Beams Section -->
      <div class="result-card">
        <h3>Beams/Struts</h3>
        <div class="result-item">
          <span class="label">Beam Length:</span>
          <span class="value">{{ results.beams.length }} mm</span>
        </div>
        <div class="result-item">
          <span class="label">Count:</span>
          <span class="value">{{ results.beams.count }}</span>
        </div>
        <div class="result-item">
          <span class="label">Total Length:</span>
          <span class="value">{{ results.beams.totalLength.toFixed(2) }} m</span>
        </div>
        <div class="result-item">
          <span class="label">Total Volume:</span>
          <span class="value">{{ results.beams.totalVolume.toFixed(3) }} m³</span>
        </div>
        <div class="result-item">
          <span class="label">Dihedral Angle:</span>
          <span class="value">{{ results.beams.angleBeweenFaces.toFixed(2) }}°</span>
        </div>
      </div>

      <!-- Panels Section -->
      <div class="result-card">
        <h3>Panels</h3>
        <div class="result-item">
          <span class="label">Panel Count:</span>
          <span class="value">{{ results.panels.count }}</span>
        </div>
        <div class="result-item">
          <span class="label">Side Length:</span>
          <span class="value">{{ results.panels.sideLength }} mm</span>
        </div>
        <div class="result-item">
          <span class="label">Panel Height:</span>
          <span class="value">{{ results.panels.height }} mm</span>
        </div>
        <div class="result-item">
          <span class="label">Area per Panel:</span>
          <span class="value">{{ results.panels.areaPerPanel.toFixed(4) }} m²</span>
        </div>
        <div class="result-item">
          <span class="label">Total Area:</span>
          <span class="value">{{ results.panels.totalArea.toFixed(2) }} m²</span>
        </div>
      </div>

      <!-- Connectors Section -->
      <div class="result-card">
        <h3>Connectors</h3>
        <div class="result-item">
          <span class="label">Connector Count:</span>
          <span class="value">{{ results.connectors.count }}</span>
        </div>
        <div class="result-item">
          <span class="label">Type:</span>
          <span class="value">{{ results.connectors.type }}</span>
        </div>
        <div class="result-item">
          <span class="label">Convergences:</span>
          <span class="value">{{ results.connectors.convergences }}-way</span>
        </div>
      </div>

      <!-- Metadata Section -->
      <div class="result-card">
        <h3>Information</h3>
        <div class="result-item">
          <span class="label">Calculated at:</span>
          <span class="value">{{ formatDate(results.metadata.calculatedAt) }}</span>
        </div>
        <div class="result-item">
          <span class="label">API Version:</span>
          <span class="value">{{ results.metadata.version }}</span>
        </div>
      </div>
    </div>

    <!-- Material Estimation -->
    <div class="material-estimation">
      <h3>Material Estimation</h3>
      <div class="estimation-grid">
        <div class="estimation-item">
          <strong>Total Beam Length:</strong>
          <p>{{ (results.beams.totalLength * 1000).toFixed(0) }} mm = {{ results.beams.totalLength.toFixed(2) }} m</p>
          <small>Wood @ 600 kg/m³: ~{{ (results.beams.totalVolume * 600).toFixed(0) }} kg</small>
        </div>
        <div class="estimation-item">
          <strong>Total Panel Count:</strong>
          <p>{{ results.panels.count }} panels</p>
          <small>Total area: {{ results.panels.totalArea.toFixed(2) }} m²</small>
        </div>
        <div class="estimation-item">
          <strong>Connector Nodes:</strong>
          <p>{{ results.connectors.count }} nodes</p>
          <small>Type: {{ results.connectors.type }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DomeResults } from '@/api/calculator'

defineProps<{
  results: DomeResults
}>()

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleString()
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.results-container {
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

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.result-card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.result-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #0066cc;
}

.result-card h3 {
  color: #0066cc;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  border-bottom: 2px solid #0066cc;
  padding-bottom: 0.5rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
}

.result-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.value {
  color: #2c3e50;
  font-weight: 700;
  font-size: 1rem;
  text-align: right;
}

.material-estimation {
  background: #f0f4ff;
  border: 2px solid #0066cc;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.material-estimation h3 {
  color: #0066cc;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.estimation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.estimation-item {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #0066cc;
}

.estimation-item strong {
  display: block;
  color: #0066cc;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.estimation-item p {
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.estimation-item small {
  display: block;
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .results-container {
    padding: 1rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .estimation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
