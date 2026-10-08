import { apiRequest } from '../../../shared/utils/api'
import type { Client, ClientPayload } from '../types/client'

/** clientsService: agrupa las solicitudes GET, POST, PUT y DELETE del recurso /clients. HU-04. */
export const clientsService = {
  list: () => apiRequest<Client[]>('/clients'),
  create: (payload: ClientPayload) =>
    apiRequest<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: ClientPayload) =>
    apiRequest<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id: number) =>
    apiRequest<null>(`/clients/${id}`, {
      method: 'DELETE',
    }),
}
