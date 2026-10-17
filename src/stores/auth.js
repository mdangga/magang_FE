import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')

  const login = async (username, password) => {
    loading.value = true
    try {
      const res = await api.post('/api/auth/login', { username, password })
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', res.data.token)
      return { success: true, data: res.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal login. Periksa username dan password.'
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const register = async (username, name, password) => {
    loading.value = true
    try {
      const res = await api.post('/api/auth/register', { username, name, password })
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', res.data.token)
      return { success: true, data: res.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.'
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (e) {
      // ignore
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  const fetchUser = async () => {
    if (!token.value) return null
    try {
      const res = await api.get('/api/auth/me')
      user.value = res.data
      return user.value
    } catch (e) {
      logout()
      return null
    }
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    register,
    logout,
    fetchUser
  }
})
