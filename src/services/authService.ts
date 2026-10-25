// services/authService.ts: comunicación con la API REST de AA3 (/api/auth)
import { apiRequest } from '@/services/api.ts'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth.ts'

export const authService = {
  // HU-01: inicio de sesión mediante credenciales de usuario
  login: (payload: LoginPayload) =>
    apiRequest<AuthUser>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // HU-08: registrar un nuevo usuario con rol en el sistema
  register: (payload: RegisterPayload) =>
    apiRequest<AuthUser>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
