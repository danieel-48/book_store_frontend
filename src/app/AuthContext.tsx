// AuthProvider: gestiona el estado global de autenticación y la inactividad de sesión · HU-01 inicio de sesión
// Props: children (componentes hijos de la aplicación)
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { authService } from '@/services/authService.ts'
import type { AuthUser, LoginPayload } from '@/types/auth.ts'
import { AuthContext } from '@/app/auth-context'

const SESSION_KEY = 'bookstore_user'
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000

// Lee el usuario guardado en localStorage al iniciar la aplicación
const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser) // estado: usuario autenticado en la sesión
  const inactivityTimeoutRef = useRef<number | null>(null)

  // Cierra la sesión activa, borra almacenamiento local y redirige a login
  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)

    if (window.location.pathname !== '/login') {
      window.location.replace('/login')
    }
  }, [])

  // Actualiza los datos de sesión tanto en memoria como en localStorage
  const updateSessionUser = useCallback((nextUser: AuthUser) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  // HU-01: autentica al usuario contra la API y persiste su sesión
  const login = useCallback(
    async (payload: LoginPayload) => {
      updateSessionUser(await authService.login(payload))
    },
    [updateSessionUser],
  )

  const logout = clearSession

  // HU-01: controla la expiración de la sesión por 10 minutos de inactividad del usuario
  useEffect(() => {
    if (!user) {
      if (inactivityTimeoutRef.current) {
        window.clearTimeout(inactivityTimeoutRef.current)
        inactivityTimeoutRef.current = null
      }

      return
    }

    const resetInactivityTimer = () => {
      if (inactivityTimeoutRef.current) {
        window.clearTimeout(inactivityTimeoutRef.current)
      }

      inactivityTimeoutRef.current = window.setTimeout(() => {
        clearSession()
      }, INACTIVITY_TIMEOUT_MS)
    }

    const activityEvents: Array<keyof WindowEventMap> = [
      'click',
      'keydown',
      'mousemove',
      'scroll',
      'touchstart',
    ]

    resetInactivityTimer()

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer, { passive: true })
    })

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer)
      })

      if (inactivityTimeoutRef.current) {
        window.clearTimeout(inactivityTimeoutRef.current)
        inactivityTimeoutRef.current = null
      }
    }
  }, [clearSession, user])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateSessionUser,
    }),
    [login, logout, updateSessionUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
