/** ProtectedRoute: impide el acceso a pantallas privadas sin una sesión válida. Historia: HU-08. Props: ninguna; consume el contexto de autenticación. */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/useAuth'

export const ProtectedRoute = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
