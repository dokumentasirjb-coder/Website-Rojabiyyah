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

  const isAuthenticated = () => !!token.value

  async function login(email: string, password: string) {
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
      const msg = err.response?.data?.message || 'Email atau kata sandi tidak cocok.'
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

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    fetchCurrentUser,
  }
})
