<template>
  <div class="dome-calculator">
    <div class="calculator-container">
      <h1>ACIDOME Geodesic Dome Calculator</h1>

      <!-- Input Form -->
      <form @submit.prevent="handleCalculate" class="calculator-form">
        <div class="form-grid">
          <!-- Frequency -->
          <div class="form-group">
            <label for="detail">Frequency (V1-V18)</label>
            <input
              id="detail"
              v-model.number="params.detail"
              type="number"
              min="1"
              max="18"
              placeholder="3"
              @change="validateDetail"
            />
            <small>Higher = more faces but slower</small>
          </div>

          <!-- Partial Dome -->
          <div class="form-group">
            <label for="partial">Partial Dome</label>
            <select id="partial" v-model="params.partial">
              <option value="1/8">1/8 Dome</option>
              <option value="1/6">1/6 Dome</option>
              <option value="1/4">1/4 Dome</option>
              <option value="1/3">1/3 Dome</option>
              <option value="5/12">5/12 Dome</option>
              <option value="1/2">1/2 Dome</option>
              <option value="7/12">7/12 Dome</option>
              <option value="2/3">2/3 Dome</option>
              <option value="3/4">3/4 Dome</option>
              <option value="5/6">5/6 Dome</option>
              <option value="1/1">Full Sphere</option>
            </select>
          </div>

          <!-- Radius -->
          <div class="form-group">
            <label for="radius">Radius (meters)</label>
            <input
              id="radius"
              v-model.number="params.radius"
              type="number"
              min="0.1"
              step="0.5"
              placeholder="5"
            />
          </div>

          <!-- Connector Type -->
          <div class="form-group">
            <label for="connType">Connector Type</label>
            <select id="connType" v-model="params.connType">
              <option value="GoodKarma">Good Karma</option>
              <option value="Piped">Piped</option>
              <option value="Semicone">Semicone</option>
              <option value="Cone">Cone</option>
              <option value="Joint">Joint</option>
            </select>
          </div>

          <!-- Beam Width -->
          <div class="form-group">
            <label for="beamsWidth">Beam Width (mm)</label>
            <input
              id="beamsWidth"
              v-model.number="params.beamsWidth"
              type="number"
              min="10"
              step="10"
              placeholder="160"
            />
          </div>

          <!-- Beam Thickness -->
          <div class="form-group">
            <label for="beamsThickness">Beam Thickness (mm)</label>
            <input
              id="beamsThickness"
              v-model.number="params.beamsThickness"
              type="number"
              min="5"
              step="5"
              placeholder="40"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <strong>Error:</strong> {{ error }}
        </div>

        <!-- Loading & Submit -->
        <div class="form-actions">
          <button
            type="submit"
            :disabled="loading"
            class="btn-calculate"
          >
            {{ loading ? 'Calculating...' : 'Calculate Dome' }}
          </button>

          <button
            type="button"
            @click="resetForm"
            class="btn-reset"
          >
            Reset
          </button>

          <div v-if="loading" class="loading-spinner"></div>
        </div>
      </form>
    </div>

    <!-- Results Section -->
    <div v-if="results" class="results-section">
      <DomeResults :results="results" />
      <DomePlots :results="results" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { calculateDome } from '@/api/client'
import type { DomeParams, DomeResults } from '@/api/calculator'
import DomeResults from './DomeResults.vue'
import DomePlots from './DomePlots.vue'

const params = ref<DomeParams>({
  detail: 3,
  partial: '5/12',
  radius: 5,
  connType: 'GoodKarma',
  beamsWidth: 160,
  beamsThickness: 40,
  base: 'Icosahedron',
  subdivClass: 'I',
  subdivMethod: 'Kruschke',
  symmetry: 'Pentad',
  fullerenType: 'none',
  partialMode: 'faces',
})

const results = ref<DomeResults | null>(null)
const loading = ref(false)
const error = ref('')

function validateDetail() {
  if (params.value.detail < 1) params.value.detail = 1
  if (params.value.detail > 18) params.value.detail = 18
}

async function handleCalculate() {
  error.value = ''
  loading.value = true
  results.value = null

  try {
    const response = await calculateDome(params.value)

    if (response.success) {
      results.value = response.data
    } else {
      error.value = 'Calculation failed. Please check your parameters.'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred during calculation'
    console.error('Calculation error:', err)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  params.value = {
    detail: 3,
    partial: '5/12',
    radius: 5,
    connType: 'GoodKarma',
    beamsWidth: 160,
    beamsThickness: 40,
    base: 'Icosahedron',
    subdivClass: 'I',
    subdivMethod: 'Kruschke',
    symmetry: 'Pentad',
    fullerenType: 'none',
    partialMode: 'faces',
  }
  results.value = null
  error.value = ''
}
</script>

<style scoped>
.dome-calculator {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.calculator-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.calculator-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-group small {
  color: #666;
  font-size: 0.85rem;
}

.error-message {
  padding: 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  font-size: 0.95rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.btn-calculate,
.btn-reset {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-calculate {
  background: #0066cc;
  color: white;
  flex: 1;
  min-width: 150px;
}

.btn-calculate:hover:not(:disabled) {
  background: #0052a3;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.btn-calculate:disabled {
  background: #999;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-reset {
  background: #f0f0f0;
  color: #2c3e50;
  border: 1px solid #ddd;
}

.btn-reset:hover {
  background: #e0e0e0;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 768px) {
  .dome-calculator {
    padding: 1rem;
  }

  .calculator-container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-calculate,
  .btn-reset {
    width: 100%;
  }
}
</style>
