import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Request Interceptor: Sisipkan Bearer Token Sanctum dari localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Tangani 429 Rate Limit dan 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = Number(error.response.headers?.['retry-after'] || error.response.data?.retry_after || 60)
      error.rateLimitRetryAfter = retryAfter
      error.userMessage =
        error.response.data?.message ||
        `Terlalu banyak percobaan. Silakan tunggu ${retryAfter} detik sebelum mencoba lagi.`
    }

    if (error.response?.status === 401 && !(error.config as any)?.skipAuthRedirect) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')

      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = `/panel-panitia?redirect=${encodeURIComponent(window.location.pathname)}`
      }
    }

    const message = error.userMessage || error.response?.data?.message || error.message || 'Terjadi kesalahan pada server.'
    console.error('[API Error]:', error.response?.status || 'NETWORK', message)
    return Promise.reject(error)
  }
)

export default api
