import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'
import type { Author } from '@/types'

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

      const msg = err.response?.data?.message || 'Gagal terhubung ke server atau kredensial tidak cocok.'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) {
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
    return (user.value as any)?.email || ''
  }

  async function updateLocalCredentials(currentPassword: string, newEmail: string, newPassword: string) {
    const trimmedEmail = newEmail.trim()
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, message: 'Format email tidak valid.' }
    }
    if (newPassword.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' }
    }

    try {
      const res = await api.post<{ success: boolean; message: string; data: Author }>('/change-password', {
        current_password: currentPassword,
        email: trimmedEmail,
        new_password: newPassword,
      })
      if (res.data?.data) {
        user.value = res.data.data
        localStorage.setItem('admin_user', JSON.stringify(res.data.data))
      }
      return { success: true, message: res.data?.message || 'Email dan kata sandi admin berhasil diperbarui di database!' }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal memperbarui kata sandi di server.'
      return { success: false, message: msg }
    }
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
