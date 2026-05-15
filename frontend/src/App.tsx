import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import Layout from './components/Layout'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </AnimatePresence>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  )
}

export default App
