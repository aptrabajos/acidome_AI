/**
 * Application entry point
 * Initializes Vue 3 + Pinia + Router
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.scss'

// Create Vue app
const app = createApp(App)

// Install Pinia for state management
const pinia = createPinia()
app.use(pinia)

// Mount app
app.mount('#app')

// Log initialization
console.log('[Acidome] Application initialized successfully')
console.log('[Acidome] Environment:', {
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
  ssr: import.meta.env.SSR
})
