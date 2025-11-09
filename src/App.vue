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
      <DomeCalculator />
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
import { useAppStore } from './ui/store/appStore'
import { LANGUAGE_OPTIONS } from './utils/config'
import DomeCalculator from './components/DomeCalculator.vue'

const store = useAppStore()
const languages = LANGUAGE_OPTIONS
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
  background: #f5f5f5;
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
