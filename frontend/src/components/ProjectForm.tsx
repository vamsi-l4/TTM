import { useState } from 'react'
import { User, Project } from '../types'

interface Props {
  onSubmit: (data: Partial<Project> & { member_ids: number[] }) => void
  users: User[]
  initial?: Partial<Project>
}

const ProjectForm = ({ onSubmit, users, initial }: Props) => {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [status, setStatus] = useState(initial?.status || 'planning')
  const [dueDate, setDueDate] = useState(initial?.due_date?.slice(0, 10) || '')
  const [members, setMembers] = useState<number[]>((initial?.members || []).map((m) => m.id))


  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({ title, description, status, due_date: dueDate ? `${dueDate}T00:00:00` : null, member_ids: members })
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <div className="mb-2 text-sm text-slate-400">Project name</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3" />
        </label>
        <label className="block">
          <div className="mb-2 text-sm text-slate-400">Status</div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3">
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>
      <label className="block">
        <div className="mb-2 text-sm text-slate-400">Description</div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <div className="mb-2 text-sm text-slate-400">Due date</div>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3" />
        </label>
        <label className="block">
          <div className="mb-2 text-sm text-slate-400">Assign members</div>
          <select multiple value={members.map(String)} onChange={(e) => setMembers(Array.from(e.target.selectedOptions, (opt) => Number(opt.value)))} className="w-full px-4 py-3">
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
        Save project
      </button>
    </form>
  )
}

export default ProjectForm
