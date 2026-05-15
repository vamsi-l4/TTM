import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bars3Icon, HomeIcon, FolderIcon, ClipboardDocumentListIcon, UserCircleIcon, ShieldCheckIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'

const links = [
  { label: 'Dashboard', path: '/', icon: HomeIcon },
  { label: 'Projects', path: '/projects', icon: FolderIcon },
  { label: 'Tasks', path: '/tasks', icon: ClipboardDocumentListIcon },
  { label: 'Profile', path: '/profile', icon: UserCircleIcon },
]

const adminLink = { label: 'Admin Panel', path: '/admin', icon: ShieldCheckIcon }

const Layout = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('taskflow_token')

  const handleLogout = () => {
    localStorage.removeItem('taskflow_token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-950/90 p-6 backdrop-blur-xl">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-300 shadow-glass">
              <Bars3Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">ETHARA AI</p>
              <h1 className="text-2xl font-semibold">TaskFlow</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {links.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${isActive ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-300 hover:bg-slate-800/80'}`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <NavLink
              to={adminLink.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${isActive ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-300 hover:bg-slate-800/80'}`
              }
            >
              <adminLink.icon className="h-5 w-5" />
              <span>{adminLink.label}</span>
            </NavLink>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </aside>

        <main className="bg-slate-950/90 p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-slate-400">Welcome to the ETHARA AI workspace.</p>
                <h2 className="text-3xl font-semibold text-white">Team task management simplified.</h2>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-5 py-4 text-slate-300 shadow-glass">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Live status</p>
                <p className="mt-1 text-xl text-emerald-300">Productivity boost ready</p>
              </div>
            </div>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout
