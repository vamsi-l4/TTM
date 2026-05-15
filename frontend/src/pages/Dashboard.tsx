import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchDashboard } from '../api/dashboard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { DashboardStats } from '../types'

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
      .then((res) => setStats(res.data))
      .catch(() => setError('Unable to load dashboard stats.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (error || !stats) return <EmptyState message={error || 'Dashboard could not be loaded.'} />

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-4">
        <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Total projects</p>
          <p className="mt-4 text-4xl font-semibold text-emerald-300">{stats.total_projects ?? stats.assigned_tasks ?? 0}</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Completed</p>
          <p className="mt-4 text-4xl font-semibold text-emerald-300">{stats.completed_tasks}</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Pending</p>
          <p className="mt-4 text-4xl font-semibold text-emerald-300">{stats.pending_tasks ?? '—'}</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Progress</p>
          <p className="mt-4 text-4xl font-semibold text-emerald-300">{stats.progress ? `${stats.progress}%` : '—'}</p>
        </motion.div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <h3 className="text-xl font-semibold text-white">Upcoming milestones</h3>
          <p className="mt-3 text-slate-400">Track deadlines, overdue tasks, and release checkpoints from your active sprint.</p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-slate-950/70 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Upcoming deadlines</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">{stats.upcoming_deadlines ?? 0}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Overdue tasks</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">{stats.overdue_tasks ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <h3 className="text-xl font-semibold text-white">Team health</h3>
          <p className="mt-3 text-slate-400">Monitor the pulse of your team with status counts and completion rates.</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-3xl bg-slate-950/70 p-4">
              <span className="text-slate-300">Active projects</span>
              <span className="text-emerald-300">{stats.total_projects ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-3xl bg-slate-950/70 p-4">
              <span className="text-slate-300">Completed tasks</span>
              <span className="text-emerald-300">{stats.completed_tasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
