import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { setupSmoothScroll } from '@/plugins/smoothScroll'
import { vReveal } from '@/directives/reveal'

import 'lenis/dist/lenis.css'
import './style.css'

const APP_VERSION = '2026.11.26'

function purgeStaleClientCache() {
  if (typeof window === 'undefined') return
  try {
    const currentVersion = localStorage.getItem('roja_app_version')
    if (currentVersion !== APP_VERSION) {
      const preservedToken = localStorage.getItem('admin_token')
      localStorage.clear()
      if (preservedToken) {
        localStorage.setItem('admin_token', preservedToken)
      }
      localStorage.setItem('roja_app_version', APP_VERSION)

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          ?.getRegistrations()
          .then((registrations) => {
            registrations.forEach((registration) => {
              registration.unregister().catch(() => {})
            })
          })
          .catch(() => {})
      }

      if ('caches' in window) {
        caches
          ?.keys()
          .then((keys) => {
            keys.forEach((key) => {
              caches.delete(key).catch(() => {})
            })
          })
          .catch(() => {})
      }
    }
  } catch {
    // Ignore storage errors in restricted browser contexts
  }
}

purgeStaleClientCache()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.directive('reveal', vReveal)

setupSmoothScroll(router)

// Initialize settings and apply active theme immediately
const settingsStore = useSettingsStore(pinia)
settingsStore.applyTheme(settingsStore.settings)

app.mount('#app')
