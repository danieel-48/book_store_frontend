import { apiRequest } from '@/services/api.ts'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth.ts'

/** authService: solicitudes de registro e inicio de sesión (/api/auth). La API no emite token. */
export const authService = {
  login: (payload: LoginPayload) =>
    apiRequest<AuthUser>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  register: (payload: RegisterPayload) =>
    apiRequest<AuthUser>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
