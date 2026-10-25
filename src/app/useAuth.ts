// useAuth: hook personalizado para acceder al contexto global de autenticación · HU-01 inicio de sesión
// Retorna: { user, login, logout, updateSessionUser }
import { useContext } from 'react'
import { AuthContext } from '@/app/auth-context'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
