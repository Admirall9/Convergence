import axios from 'axios';
// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response interceptor for error handling
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
// API Service Functions
export const apiService = {
    // Health checks
    health: () => api.get('/health'),
    healthDb: () => api.get('/health/db'),
    // Authentication
    auth: {
        login: (email, password) => api.post('/api/v1/citizen/token', { email, password }),
        register: (userData) => api.post('/api/v1/citizen/register', userData),
    },
    // Government data
    gov: {
        getInstitutions: (params) => api.get('/api/v1/gov/institutions', { params }),
        createInstitution: (data) => api.post('/api/v1/gov/institutions', data),
        getOfficials: (params) => api.get('/api/v1/gov/officials', { params }),
        createOfficial: (data) => api.post('/api/v1/gov/officials', data),
    },
    // Legal repository
    legal: {
        getLaws: (params) => api.get('/api/v1/legal/laws', { params }),
        getLaw: (id) => api.get(`/api/v1/legal/laws/${id}`),
        getCategories: () => api.get('/api/v1/legal/categories'),
    },
    // AI Q&A
    ai: {
        query: (queryData) => api.post('/api/v1/ai/query', queryData),
        getQueries: (params) => api.get('/api/v1/ai/queries', { params }),
        getStats: () => api.get('/api/v1/ai/stats'),
    },
    // Citizen reviews
    reviews: {
        getReviews: (params) => api.get('/api/v1/citizen/reviews', { params }),
        createReview: (data) => api.post('/api/v1/citizen/reviews', data),
    },
    // Budget data
    budget: {
        getSpending: (params) => api.get('/api/v1/api/spending/aggregate', { params }),
    },
};
export default api;
