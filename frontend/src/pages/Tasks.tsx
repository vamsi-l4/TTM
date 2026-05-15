import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import { fetchProjects } from '../api/projects'
import { fetchUsers, fetchCurrentUser } from '../api/users'
import TaskForm from '../components/TaskForm'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { Task, Project, User } from '../types'

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [filter, setFilter] = useState('')

  const loadAll = async () => {
    setLoading(true)
    try {
      const [profileRes, taskRes, projectRes] = await Promise.all([fetchCurrentUser(), fetchTasks({ status: filter }), fetchProjects()])
      setCurrentUser(profileRes.data)
      setTasks(taskRes.data)
      setProjects(projectRes.data)
      if (profileRes.data.role === 'admin') {
        const userRes = await fetchUsers()
        setUsers(userRes.data)
      }
    } catch {
      toast.error('Unable to load tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [filter])

  const handleCreate = async (data: Partial<Task>) => {
    try {
      await createTask(data)
      toast.success('Task created')
      setShowNew(false)
      loadAll()
    } catch {
      toast.error('Failed to create task')
    }
  }

  const handleStatusUpdate = async (task: Task, status: string) => {
    await updateTask(task.id, { status })
    toast.success('Task updated')
    loadAll()
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-slate-400">Task workspace</p>
          <h2 className="text-3xl font-semibold text-white">Organize your work.</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {currentUser?.role === 'admin' && (
            <button onClick={() => setShowNew(!showNew)} className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
              {showNew ? 'Hide' : 'New task'}
            </button>
          )}
        </div>
      </div>

      {showNew && <TaskForm projects={projects} users={users} onSubmit={handleCreate} />}

      {!tasks.length ? (
        <EmptyState message="No tasks match your filter. Create a new task to get started." />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {tasks.map((task) => (
            <motion.div key={task.id} whileHover={{ y: -4 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white">{task.title}</h3>
                  <p className="mt-2 text-slate-400">{task.description}</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-300">{task.status}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
                <span>Priority: {task.priority}</span>
                <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'None'}</span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button onClick={() => handleStatusUpdate(task, 'pending')} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">Pending</button>
                <button onClick={() => handleStatusUpdate(task, 'in progress')} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">In Progress</button>
                <button onClick={() => handleStatusUpdate(task, 'completed')} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">Complete</button>
                <button onClick={async () => { await deleteTask(task.id); toast.success('Task removed'); loadAll() }} className="rounded-2xl border border-red-500 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">Remove</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tasks
