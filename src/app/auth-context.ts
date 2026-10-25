import { createContext } from 'react'
import type { AuthUser, LoginPayload } from '@/types/auth.ts'

export type AuthContextValue = {
  user: AuthUser | null
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
  updateSessionUser: (user: AuthUser) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
