import api from './axios'
import { User } from '../types'

export const fetchUsers = () => api.get<User[]>('/users')
export const fetchCurrentUser = () => api.get<User>('/users/me')
