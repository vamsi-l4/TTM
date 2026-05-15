import api from './axios'

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export const login = (payload: LoginPayload) => api.post('/auth/login', new URLSearchParams({ username: payload.username, password: payload.password }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
export const register = (payload: RegisterPayload) => api.post('/auth/register', payload)

export const fetchProfile = () => api.get('/users/me')
