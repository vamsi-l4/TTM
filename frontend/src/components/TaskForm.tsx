import { useState } from 'react'
import { User, Project, Task } from '../types'

interface Props {
  projects: Project[]
  users: User[]
  onSubmit: (data: Partial<Task>) => void
  initial?: Partial<Task>
}

const TaskForm = ({ projects, users, onSubmit, initial }: Props) => {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [projectId, setProjectId] = useState(initial?.project_id || projects[0]?.id || 0)
  const [assigneeId, setAssigneeId] = useState(initial?.assignee_id || users[0]?.id || 0)
  const [priority, setPriority] = useState(initial?.priority || 'medium')
  const [status, setStatus] = useState(initial?.status || 'pending')
  const [dueDate, setDueDate] = useState(initial?.due_date?.slice(0, 10) || '')

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({
          title,
          description,
          project_id: projectId,
          assignee_id: assigneeId,
          priority,
          status,
          due_date: dueDate ? `${dueDate}T00:00:00` : null,
        })
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <div className="mb-2 text-sm text-slate-400">Task title</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3" />
        </label>
        <label className="block">
          <div className="mb-2 text-sm text-slate-400">Project</div>
          <select value={projectId} onChange={(e) => setProjectId(Number(e.target.value))} className="w-full px-4 py-3">
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <div className="mb-2 text-sm text-slate-400">Description</div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3" />
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <div className="mb-2 text-sm text-slate-400">Assignee</div>
          <select value={assigneeId} onChange={(e) => setAssigneeId(Number(e.target.value))} className="w-full px-4 py-3">
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <div className="mb-2 text-sm text-slate-400">Priority</div>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-3">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="block">
          <div className="mb-2 text-sm text-slate-400">Status</div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3">
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <div className="mb-2 text-sm text-slate-400">Due date</div>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3" />
        </label>
      </div>
      <button type="submit" className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
        Save task
      </button>
    </form>
  )
}

export default TaskForm
