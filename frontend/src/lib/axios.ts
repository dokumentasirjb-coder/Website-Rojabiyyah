import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://rojabiyyah-api.test/api/v1',
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Request Interceptor: Otomatis menyisipkan Bearer Token dari localStorage jika tersedia
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

// Response Interceptor: Tangani 401 Unauthorized dan redirect ke /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hapus sesi lokal
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')

      // Jika user sedang berada di rute /admin, redirect ke /login
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }
    }

    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan pada server.'
    console.error('[API Error]:', message)
    return Promise.reject(error)
  }
)

export default api
