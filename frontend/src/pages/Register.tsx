import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { register } from '../api/auth'

const Register = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      await register({ name, email, password })
      toast.success('Registration successful. Please log in.')
      navigate('/login')
    } catch (error) {
      toast.error('Could not register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-glass"
      >
        <h1 className="mb-6 text-3xl font-semibold text-white">Create your ETHARA AI account</h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-slate-400">Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-2 w-full px-4 py-3" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-400">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-2 w-full px-4 py-3" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-400">Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-2 w-full px-4 py-3" />
          </label>
          <button disabled={loading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-400">
          Already a member? <Link to="/login" className="text-emerald-400 hover:text-emerald-300">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Register
