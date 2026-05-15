export interface User {
  id: number
  name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
}

export interface Project {
  id: number
  title: string
  description: string
  status: string
  due_date: string | null
  owner_id: number
  members: { id: number; name?: string }[]
  created_at: string
}

export interface Task {
  id: number
  title: string
  description: string
  due_date: string | null
  priority: string
  status: string
  project_id: number
  assignee_id: number | null
  creator_id: number
  created_at: string
}

export interface DashboardStats {
  total_projects?: number
  total_users?: number
  completed_tasks: number
  pending_tasks?: number
  overdue_tasks?: number
  assigned_tasks?: number
  upcoming_deadlines?: number
  progress?: number
}
