import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { fetchUsers } from '../api/users'
import { fetchProjects } from '../api/projects'
import { fetchTasks } from '../api/tasks'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { User, Project, Task } from '../types'

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, projectsRes, tasksRes] = await Promise.all([fetchUsers(), fetchProjects(), fetchTasks()])
      setUsers(usersRes.data)
      setProjects(projectsRes.data)
      setTasks(tasksRes.data)
    } catch {
      toast.error('Unable to load admin data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glass">
        <h2 className="text-3xl font-semibold text-white">Admin control center</h2>
        <p className="mt-3 text-slate-400">Manage users, projects, and tasks across the entire ETHARA AI workspace.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Users</p>
          <p className="mt-4 text-4xl font-semibold text-emerald-300">{users.length}</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Projects</p>
          <p className="mt-4 text-4xl font-semibold text-emerald-300">{projects.length}</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Tasks</p>
          <p className="mt-4 text-4xl font-semibold text-emerald-300">{tasks.length}</p>
        </motion.div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <h3 className="text-xl font-semibold text-white">User directory</h3>
          <div className="mt-5 space-y-3">
            {users.length ? users.map((user) => (
              <div key={user.id} className="rounded-3xl bg-slate-950/80 p-4 text-slate-300">
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm">{user.email} • {user.role}</p>
              </div>
            )) : <EmptyState message="No users found." />}
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <h3 className="text-xl font-semibold text-white">Activity summary</h3>
          <div className="mt-5 space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="rounded-3xl bg-slate-950/80 p-4 text-slate-300">
                <p className="font-semibold text-white">{task.title}</p>
                <p className="text-sm">Status: {task.status} • Priority: {task.priority}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
