import axios from 'axios'

// API Configuration
// Expect VITE_API_BASE_URL to already include the API root (e.g., http://127.0.0.1:8000/api/v1)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Service Functions
export const apiService = {
  // Health checks
  health: () => api.get('/health'),
  healthDb: () => api.get('/health/db'),

  // Authentication
  auth: {
    login: (email: string, password: string) =>
      api.post('/citizen/token', { email, password }),
    register: (userData: any) =>
      api.post('/citizen/register', userData),
  },

  // Government data
  gov: {
    getInstitutions: (params?: any) =>
      api.get('/gov/institutions', { params }),
    createInstitution: (data: any) =>
      api.post('/gov/institutions', data),
    getOfficials: (params?: any) =>
      api.get('/gov/officials', { params }),
    createOfficial: (data: any) =>
      api.post('/gov/officials', data),
  },

  // Legal repository
  legal: {
    getLaws: (params?: any) =>
      api.get('/legal/laws', { params }),
    getLaw: (id: number) =>
      api.get(`/legal/laws/${id}`),
    getCategories: () =>
      api.get('/legal/categories'),
  },

  // AI Q&A
  ai: {
    query: (queryData: any) =>
      api.post('/ai/query', queryData),
    getQueries: (params?: any) =>
      api.get('/ai/queries', { params }),
    getStats: () =>
      api.get('/ai/stats'),
  },

  // Citizen reviews
  reviews: {
    getReviews: (params?: any) =>
      api.get('/citizen/reviews', { params }),
    createReview: (data: any) =>
      api.post('/citizen/reviews', data),
  },

  // Budget data
  budget: {
    getSpending: (params?: any) =>
      api.get('/spending/aggregate', { params }),
  },
}

export default api
