import { defineStore } from 'pinia'
import { ref } from 'vue'
import api, { LOCAL_OFFLINE_TOKEN, resetApiOfflineStatus } from '@/lib/axios'
import type { Author } from '@/types'

const LOCAL_CREDENTIALS_KEY = 'admin_local_credentials'

const DEFAULT_LOCAL_CREDENTIALS = {
  email: 'admin@rojabiyyah.id',
  password: 'Rojabiyyah2026!',
}

function getLocalCredentials(): { email: string; password: string } {
  try {
    const raw = localStorage.getItem(LOCAL_CREDENTIALS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.email && parsed?.password) {
        return { email: String(parsed.email), password: String(parsed.password) }
      }
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_LOCAL_CREDENTIALS }
}

function buildLocalUser(): Author {
  return {
    id: 1,
    name: 'Panitia Rojabiyyah',
    role: 'admin',
    avatar: '',
    bio: '',
  }
}

function getSavedUser(): Author | null {
  const saved = localStorage.getItem('admin_user')
  try {
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const user = ref<Author | null>(getSavedUser())

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const retryAfterSeconds = ref(0)
  let cooldownTimer: ReturnType<typeof setInterval> | null = null

  function startCooldown(seconds: number) {
    if (cooldownTimer) clearInterval(cooldownTimer)
    retryAfterSeconds.value = Math.max(1, Math.ceil(seconds))
    cooldownTimer = setInterval(() => {
      retryAfterSeconds.value -= 1
      if (retryAfterSeconds.value <= 0) {
        retryAfterSeconds.value = 0
        if (cooldownTimer) {
          clearInterval(cooldownTimer)
          cooldownTimer = null
        }
      }
    }, 1000)
  }

  const isAuthenticated = () => !!token.value

  async function login(email: string, password: string) {
    if (retryAfterSeconds.value > 0) {
      const msg = `Terlalu banyak percobaan login. Silakan tunggu ${retryAfterSeconds.value} detik.`
      error.value = msg
      return { success: false, message: msg }
    }

    isLoading.value = true
    error.value = null
    resetApiOfflineStatus()
    try {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          user: Author
          access_token: string
          token_type: string
        }
      }>('/login', { email, password })

      const data = response.data.data
      token.value = data.access_token
      user.value = data.user

      localStorage.setItem('admin_token', data.access_token)
      localStorage.setItem('admin_user', JSON.stringify(data.user))

      return { success: true }
    } catch (err: any) {
      if (err.response?.status === 429) {
        const waitSec = Number(err.rateLimitRetryAfter || err.response?.data?.retry_after || 60)
        startCooldown(waitSec)
        const msg = err.userMessage || err.response?.data?.message || `Terlalu banyak percobaan login. Tunggu ${waitSec} detik.`
        error.value = msg
        return { success: false, message: msg }
      }

      // Fallback login lokal jika server API belum terhubung / offline
      const isNetworkError = !err.response || err.response.status >= 500 || err.response.status === 404
      const localCreds = getLocalCredentials()
      if (
        isNetworkError &&
        email.trim().toLowerCase() === localCreds.email.toLowerCase() &&
        password === localCreds.password
      ) {
        const localUser = buildLocalUser()
        token.value = LOCAL_OFFLINE_TOKEN
        user.value = localUser
        localStorage.setItem('admin_token', LOCAL_OFFLINE_TOKEN)
        localStorage.setItem('admin_user', JSON.stringify(localUser))
        return { success: true }
      }

      const msg = err.response?.data?.message || 'Email atau kata sandi tidak cocok.'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value && token.value !== LOCAL_OFFLINE_TOKEN) {
        await api.post('/logout')
      }
    } catch (err) {
      console.warn('Logout API warning:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) return
    if (token.value === LOCAL_OFFLINE_TOKEN) {
      user.value = getSavedUser() || buildLocalUser()
      return
    }
    try {
      const res = await api.get<{ success: boolean; data: Author }>('/me')
      if (res.data?.data) {
        user.value = res.data.data
        localStorage.setItem('admin_user', JSON.stringify(res.data.data))
      }
    } catch {
      logout()
    }
  }

  function getAdminEmail() {
    return getLocalCredentials().email
  }

  function updateLocalCredentials(currentPassword: string, newEmail: string, newPassword: string) {
    const localCreds = getLocalCredentials()
    if (currentPassword !== localCreds.password) {
      return { success: false, message: 'Kata sandi saat ini tidak cocok.' }
    }
    const trimmedEmail = newEmail.trim()
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, message: 'Format email tidak valid.' }
    }
    if (newPassword.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' }
    }

    localStorage.setItem(
      LOCAL_CREDENTIALS_KEY,
      JSON.stringify({ email: trimmedEmail, password: newPassword })
    )
    const updatedUser = buildLocalUser()
    user.value = updatedUser
    localStorage.setItem('admin_user', JSON.stringify(updatedUser))

    return { success: true, message: 'Email dan kata sandi admin berhasil diperbarui!' }
  }

  return {
    token,
    user,
    isLoading,
    error,
    retryAfterSeconds,
    isAuthenticated,
    login,
    logout,
    fetchCurrentUser,
    getAdminEmail,
    updateLocalCredentials,
  }
})
