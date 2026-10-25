import { apiRequest } from '@/services/api.ts'
import type { AuthUser, LoginData, LoginPayload } from '@/types/auth.ts'

/** authService: centraliza las solicitudes de inicio, consulta y cierre de sesión. HU-01. */
export const authService = {
  // Envía las credenciales a POST /auth/login.
  login: (payload: LoginPayload) =>
    apiRequest<LoginData>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  // Recupera el usuario de la sesión actual con GET /auth/me.
  me: () => apiRequest<AuthUser>('/api/auth/me'),
  // Invalida la sesión en el servidor mediante POST /auth/logout.
  logout: () =>
    apiRequest<null>('/api/auth/logout', {
      method: 'POST',
    }),
}
