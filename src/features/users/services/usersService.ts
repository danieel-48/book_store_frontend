import { apiRequest } from '../../../shared/utils/api'
import type { User, UserPayload } from '../types/user'

type PaginatedUsers = {
  data: User[]
}

/** usersService: centraliza las solicitudes GET, POST, PUT y DELETE del recurso /users. HU-07. */
export const usersService = {
  list: () => apiRequest<PaginatedUsers>('/users'),
  create: (payload: UserPayload) =>
    apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: UserPayload) =>
    apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id: number) =>
    apiRequest<null>(`/users/${id}`, {
      method: 'DELETE',
    }),
}
