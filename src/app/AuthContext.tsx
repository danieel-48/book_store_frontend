/** AuthProvider: mantiene la sesión del usuario (guardada localmente) y su expiración por inactividad. Props: children, contenido de la aplicación. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { authService } from '@/services/authService.ts'
import type { AuthUser, LoginPayload } from '@/types/auth.ts'
import { AuthContext } from '@/app/auth-context'

const SESSION_KEY = 'bookstore_user'
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser)
  const inactivityTimeoutRef = useRef<number | null>(null)

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)

    if (window.location.pathname !== '/login') {
      window.location.replace('/login')
    }
  }, [])

  const updateSessionUser = useCallback((nextUser: AuthUser) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const login = useCallback(
    async (payload: LoginPayload) => {
      updateSessionUser(await authService.login(payload))
    },
    [updateSessionUser],
  )

  const logout = clearSession

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
