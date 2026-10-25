import { apiRequest } from '@/services/api.ts'
import type { User, UserPayload } from '@/types/user.ts'

/** usersService: consulta de perfil por correo (la API no expone listado ni eliminación de usuarios). */
export const usersService = {
  list: () => apiRequest<User[]>('/api/users'),
  profile: (email: string) => apiRequest<User>(`/api/users/profile?email=${email}`),
  update: (id: number, payload: Partial<UserPayload>) =>
    apiRequest<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
}
