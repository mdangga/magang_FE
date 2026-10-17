import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL
console.log('API_BASE_URL:', API_BASE_URL)
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Request interceptor to add bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

const APP_URL = (import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/+$/, '')

// Response interceptor to handle auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/user'))) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Helper to resolve static image urls from backend
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  // Remove leading slash if any
  const cleanBase = (API_BASE_URL || '').replace(/\/+$/, '')
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `${cleanBase}/${cleanPath}`
}

/**
 * Helper to resolve static document / PDF file urls from backend
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return ''
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath
  }
  const cleanBase = (API_BASE_URL || '').replace(/\/+$/, '')
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath
  return `${cleanBase}/${cleanPath}`
}

/**
 * Helper to get frontend application URL
 */
export const getAppUrl = (path = '') => {
  if (!path) return APP_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${APP_URL}${cleanPath}`
}

export { API_BASE_URL, APP_URL }
export default api
