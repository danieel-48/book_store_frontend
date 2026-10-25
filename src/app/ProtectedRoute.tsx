// ProtectedRoute: restringe el acceso a rutas privadas solo a usuarios autenticados · HU-01 inicio de sesión
// Props: ninguna (utiliza Outlet de react-router-dom)
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/useAuth'

export const ProtectedRoute = () => {
  const { user } = useAuth() // estado: usuario autenticado del contexto

  // Si no hay sesión válida, redirige automáticamente al login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
