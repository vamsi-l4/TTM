import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
