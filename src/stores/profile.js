import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api, { getImageUrl } from '../api'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref({
    app_name: 'Peta Magang',
    description: 'Sistem Informasi Pemetaan Titik Magang',
    logo_path: null
  })
  const loading = ref(false)

  const logoUrl = computed(() => {
    return profile.value.logo_path ? getImageUrl(profile.value.logo_path) : ''
  })

  const fetchProfile = async () => {
    loading.value = true
    try {
      const res = await api.get('/api/profile')
      if (res.data) {
        profile.value = res.data
        if (profile.value.app_name) {
          document.title = profile.value.app_name
        }
      }
    } catch (e) {
      console.warn('Could not load profile:', e)
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (formData) => {
    loading.value = true
    try {
      const res = await api.patch('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data?.data) {
        profile.value = res.data.data
      }
      return { success: true, data: res.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal memperbarui profil website.'
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    logoUrl,
    fetchProfile,
    updateProfile
  }
})
