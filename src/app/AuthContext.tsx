/** AuthProvider: restaura y mantiene la sesión autenticada y su expiración por inactividad. Historia: HU-01. Props: children, contenido de la aplicación. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { authService } from '@/services/authService.ts'
import type { AuthUser, LoginPayload } from '@/types/auth.ts'
import { clearStoredToken, getStoredToken, persistToken, setUnauthorizedHandler } from '@/services/api.ts'
import { AuthContext } from '@/app/auth-context'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()))
  const inactivityTimeoutRef = useRef<number | null>(null)

  const clearSession = useCallback(() => {
    clearStoredToken()
    setUser(null)

    if (window.location.pathname !== '/login') {
      window.location.replace('/login')
    }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(clearSession)

    if (!getStoredToken()) return

    authService
      .me()
      .then((response) => setUser(response.data))
      .catch(() => clearSession())
      .finally(() => setIsLoading(false))
  }, [clearSession])

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload)
    persistToken(response.data.token)
    setUser(response.data.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      clearSession()
    }
  }, [clearSession])

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
      isLoading,
      login,
      logout,
    }),
    [isLoading, login, logout, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
