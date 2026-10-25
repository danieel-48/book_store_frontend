// services/usersService.ts: comunicación con la API REST de AA3 (/api/users)
import { apiRequest } from '@/services/api.ts'
import type { User, UserPayload } from '@/types/user.ts'

export const usersService = {
  // HU-08: consultar el listado general de usuarios registrados (solo ADMIN)
  list: () => apiRequest<User[]>('/api/users'),

  // HU-03: consultar el perfil del usuario logeado por su correo electrónico
  profile: (email: string) => apiRequest<User>(`/api/users/profile?email=${email}`),

  // HU-03 y HU-08: actualizar los datos de un usuario por su id
  update: (id: number, payload: Partial<UserPayload>) =>
    apiRequest<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
}
