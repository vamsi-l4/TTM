import api from './axios'
import { Project } from '../types'

export const fetchProjects = (search?: string) => api.get<Project[]>('/projects', { params: { search } })
export const createProject = (payload: Partial<Project>) => api.post('/projects', payload)
export const updateProject = (projectId: number, payload: Partial<Project>) => api.patch(`/projects/${projectId}`, payload)
export const deleteProject = (projectId: number) => api.delete(`/projects/${projectId}`)
