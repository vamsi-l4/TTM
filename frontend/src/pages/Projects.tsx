import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { fetchProjects, createProject, deleteProject, updateProject } from '../api/projects'
import { fetchUsers, fetchCurrentUser } from '../api/users'
import ProjectForm from '../components/ProjectForm'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { Project, User } from '../types'

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [currentRes, projectsRes] = await Promise.all([fetchCurrentUser(), fetchProjects(search)])
      setCurrentUser(currentRes.data)
      setProjects(projectsRes.data)
      if (currentRes.data.role === 'admin') {
        const usersRes = await fetchUsers()
        setUsers(usersRes.data)
      }
    } catch {
      toast.error('Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [search])

  const handleCreate = async (data: Partial<Project> & { member_ids: number[] }) => {
    try {
      await createProject({
        ...data,
        members: data.member_ids.map((id) => ({ id })),
      })

      toast.success('Project created successfully')
      setShowNew(false)
      load()
    } catch {
      toast.error('Could not create project')
    }
  }

  const handleDelete = async (id: number) => {
    await deleteProject(id)
    toast.success('Project removed')
    load()
  }

  const projectCounts = useMemo(
    () => ({ total: projects.length, active: projects.filter((item) => item.status === 'active').length }),
    [projects],
  )

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-slate-400">Projects overview</p>
          <h2 className="text-3xl font-semibold text-white">Manage your workspaces.</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects"
            className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
          {currentUser?.role === 'admin' && (
            <button onClick={() => setShowNew(!showNew)} className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
              {showNew ? 'Hide form' : 'New project'}
            </button>
          )}
        </div>
      </div>

      {showNew && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
          <ProjectForm users={users} onSubmit={handleCreate} />
        </motion.div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {projects.map((project) => (
          <motion.div key={project.id} whileHover={{ y: -4 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-glass">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-slate-400">{project.description}</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-300">{project.status}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
              <span>Members: {project.members?.length ?? 0}</span>
              <span>Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No deadline'}</span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={() => handleDelete(project.id)} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Projects
