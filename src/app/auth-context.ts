import { createContext } from 'react'
import type { AuthUser, LoginPayload } from '../features/auth/types/auth'

export type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
