import axios from 'axios'

// API base URL - automatically detects environment
const getBaseURL = () => {
  // In development, use the full URL
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api'
  }
  
  // In production, use environment variable or default to your Render URL
  const apiUrl = import.meta.env.VITE_API_URL || 'https://assignment-5-1g7j.onrender.com/api'
  console.log('API Base URL:', apiUrl) // Debug log
  return apiUrl
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url) // Debug log
    return config
  },
  (error) => {
    console.error('API Request Error:', error) // Debug log
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url) // Debug log
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.config?.url, error.message) // Debug log
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
