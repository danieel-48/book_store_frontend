import { apiRequest } from '@/services/api.ts'
import type { User, UserPayload } from '@/types/user.ts'

type PaginatedUsers = {
  data: User[]
}

/** usersService: centraliza las solicitudes GET, POST, PUT y DELETE del recurso /users. HU-07. */
export const usersService = {
  list: () => apiRequest<PaginatedUsers>('/api/users'),
  create: (payload: UserPayload) =>
    apiRequest<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: UserPayload) =>
    apiRequest<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id: number) =>
    apiRequest<null>(`/api/users/${id}`, {
      method: 'DELETE',
    }),
}
