import api from './axios'
import { Task } from '../types'

export const fetchTasks = (params?: Record<string, unknown>) => api.get<Task[]>('/tasks', { params })
export const createTask = (payload: Partial<Task>) => api.post('/tasks', payload)
export const updateTask = (taskId: number, payload: Partial<Task>) => api.patch(`/tasks/${taskId}`, payload)
export const deleteTask = (taskId: number) => api.delete(`/tasks/${taskId}`)
export const addComment = (taskId: number, content: string) => api.post(`/tasks/${taskId}/comments`, { task_id: taskId, content })
