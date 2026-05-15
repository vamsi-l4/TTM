import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('taskflow_token')
  return token ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
