import { useEffect, useState } from 'react'
import { fetchCurrentUser } from '../api/users'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { User } from '../types'

const Profile = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCurrentUser()
      .then((res) => setUser(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (!user) return <EmptyState message="Profile data is unavailable." />

  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glass">
      <h2 className="text-3xl font-semibold text-white">Your profile</h2>
      <p className="mt-3 text-slate-400">Manage your ETHARA AI account and team access.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-950/80 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Full name</p>
          <p className="mt-3 text-xl text-white">{user.name}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Email</p>
          <p className="mt-3 text-xl text-white">{user.email}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Role</p>
          <p className="mt-3 text-xl text-emerald-300">{user.role}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Member since</p>
          <p className="mt-3 text-xl text-white">{new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
