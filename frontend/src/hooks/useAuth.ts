import { useState, useEffect } from 'react'
import { fetchProfile } from '../api/auth'
import { User } from '../types'

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('taskflow_token')
    if (!token) {
      setLoading(false)
      return
    }

    fetchProfile()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('taskflow_token'))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
