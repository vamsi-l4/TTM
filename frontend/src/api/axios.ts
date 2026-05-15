import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
