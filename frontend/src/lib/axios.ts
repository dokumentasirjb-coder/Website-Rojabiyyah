import axios from 'axios'

export const LOCAL_OFFLINE_TOKEN = 'local-admin-session-token'

// Circuit breaker ringan agar saat backend offline, navigasi SPA tidak terus-menerus menembak API
let apiOfflineUntil = 0
const OFFLINE_BACKOFF_MS = 30000

export function isApiOffline(): boolean {
  if (import.meta.env.VITE_API_ENABLED === 'false') return true
  return Date.now() < apiOfflineUntil
}

export function markApiOffline() {
  apiOfflineUntil = Date.now() + OFFLINE_BACKOFF_MS
}

export function resetApiOfflineStatus() {
  apiOfflineUntil = 0
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://rojabiyyah-api.test/api/v1',
  timeout: 6000,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Request Interceptor: Hanya sisipkan Bearer Token Sanctum asli (jangan kirim token lokal offline)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token && token !== LOCAL_OFFLINE_TOKEN) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Tangani offline fallback, 429 Rate Limit, dan 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    resetApiOfflineStatus()
    return response
  },
  (error) => {
    // Jika tidak ada response (backend mati / DNS tidak terjangkau), aktifkan backoff sementara
    if (!error.response) {
      markApiOffline()
    }

    if (error.response?.status === 429) {
      const retryAfter = Number(error.response.headers?.['retry-after'] || error.response.data?.retry_after || 60)
      error.rateLimitRetryAfter = retryAfter
      error.userMessage =
        error.response.data?.message ||
        `Terlalu banyak percobaan. Silakan tunggu ${retryAfter} detik sebelum mencoba lagi.`
    }

    if (error.response?.status === 401 && !(error.config as any)?.skipAuthRedirect) {
      const currentToken = localStorage.getItem('admin_token')
      // Jangan hapus sesi lokal offline jika token memang token lokal
      if (currentToken && currentToken !== LOCAL_OFFLINE_TOKEN) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')

        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = `/panel-panitia?redirect=${encodeURIComponent(window.location.pathname)}`
        }
      }
    }

    const message = error.userMessage || error.response?.data?.message || error.message || 'Terjadi kesalahan pada server.'
    if (error.response) {
      console.error('[API Error]:', error.response.status, message)
    }
    return Promise.reject(error)
  }
)

export default api
