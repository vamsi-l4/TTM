import api from './axios'
import { DashboardStats } from '../types'

export const fetchDashboard = () => api.get<DashboardStats>('/dashboard')
