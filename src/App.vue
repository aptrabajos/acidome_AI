<template>
  <div class="acidome-app">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <h1>🔵 Acidome - Geodesic Dome Calculator</h1>
        <p class="tagline">Professional refactored with Vue 3 + TypeScript</p>
      </div>

      <!-- Language Selector - All 11 ACIDOME Languages -->
      <div class="language-selector">
        <label for="lang-select">Language:</label>
        <select
          id="lang-select"
          v-model="store.language"
          @change="store.setLanguage(store.language)"
          class="lang-select"
        >
          <option
            v-for="lang in languages"
            :key="lang.id"
            :value="lang.id"
          >
            {{ lang.name }}
          </option>
        </select>
      </div>
    </header>

    <!-- Main content -->
    <main class="app-main">
      <div class="container">
        <!-- Form -->
        <section class="form-section">
          <h2>Dome Configuration</h2>

          <div class="form-group">
            <label>Polyhedron Base</label>
            <select v-model="store.figureParams.base" @change="onParamChange">
              <option value="Icosahedron">Icosahedron</option>
              <option value="Octohedron">Octohedron</option>
            </select>
          </div>

          <div class="form-group">
            <label>Level of Detail</label>
            <select
              v-model.number="store.figureParams.detail"
              @change="onParamChange"
            >
              <option v-for="d in store.detailList" :key="d" :value="d">
                {{ d }}
              </option>
            </select>
          </div>

          <div v-if="store.figureParams.detail >= 2" class="form-group">
            <label>Subdivision Class</label>
            <select
              v-model="store.figureParams.subdivClass"
              @change="onParamChange"
            >
              <option
                v-for="sc in store.subdivClassList"
                :key="sc.id"
                :value="sc.id"
              >
                {{ sc.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Radius (m)</label>
            <input
              v-model.number="store.figureParams.radius"
              type="number"
              step="0.1"
              min="0.1"
              @change="onParamChange"
            />
          </div>

          <div class="form-group">
            <label>Partial Sphere</label>
            <select v-model="store.figureParams.partial" @change="onParamChange">
              <option
                v-for="p in store.partialList"
                :key="p.value"
                :value="p.value"
              >
                {{ p.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Beam Width (mm)</label>
            <input
              v-model.number="store.productParams.beamsWidth"
              type="number"
              step="1"
              min="1"
              @change="onParamChange"
            />
          </div>

          <div class="form-group">
            <label>Beam Thickness (mm)</label>
            <input
              v-model.number="store.productParams.beamsThickness"
              type="number"
              step="1"
              min="1"
              @change="onParamChange"
            />
          </div>

          <button
            @click="store.calculate"
            :disabled="store.isCalculating"
            class="btn-calculate"
          >
            {{ store.isCalculating ? 'Calculating...' : 'Calculate' }}
          </button>

          <div v-if="store.error" class="error-message">
            {{ store.error }}
          </div>
        </section>

        <!-- Preview -->
        <section class="preview-section">
          <h2>Results</h2>

          <div class="mode-selector">
            <button
              v-for="mode in ['base', 'carcass', 'schema', 'cover']"
              :key="mode"
              @click="store.setViewerMode(mode)"
              :class="{ active: store.viewerMode === mode }"
              class="mode-btn"
            >
              {{ mode }}
            </button>
          </div>

          <div class="preview-canvas">
            <canvas id="preview" ref="canvasRef"></canvas>
            <p v-if="!store.currentFigure" class="placeholder">
              Configure and calculate to see preview
            </p>
          </div>
        </section>

        <!-- Stats -->
        <section class="stats-section">
          <h2>Statistics</h2>
          <pre class="stats-text">{{ store.reportText }}</pre>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>
        Acidome © 2025 | Refactored with Vue 3, TypeScript & Vite |
        <a href="https://github.com">GitHub</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from './ui/store/appStore'
import { LANGUAGE_OPTIONS } from './utils/config'

const store = useAppStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const languages = LANGUAGE_OPTIONS

const onParamChange = () => {
  // Trigger recalculation if needed
  // This can be automatic or debounced
}

onMounted(() => {
  console.log('[App] Vue 3 component mounted')
  // Initialize with default calculation
  store.calculate()
})
</script>

<style scoped lang="scss">
@import './style';

.acidome-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .tagline {
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .header-content {
    flex: 1;
  }

  .language-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    white-space: nowrap;

    label {
      font-weight: 600;
      font-size: 0.95rem;
      margin: 0;
    }

    .lang-select {
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      border: none;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 150px;

      &:hover {
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
      }

      option {
        color: #333;
        background: white;
      }
    }
  }
}

.app-main {
  flex: 1;
  padding: 2rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.form-section,
.preview-section,
.stats-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    margin-top: 0;
    color: #333;
    font-size: 1.3rem;
  }
}

.form-group {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #555;
  }

  input,
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
}

.btn-calculate {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.mode-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.mode-btn {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #e0e0e0;
  }

  &.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
}

.preview-canvas {
  width: 100%;
  height: 300px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  canvas {
    width: 100%;
    height: 100%;
  }

  .placeholder {
    color: #999;
    font-style: italic;
  }
}

.stats-text {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: 'Monaco', 'Menlo', monospace;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.app-footer {
  background: #333;
  color: #aaa;
  padding: 1.5rem;
  text-align: center;
  font-size: 0.85rem;

  a {
    color: #667eea;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
