import { apiRequest } from '@/services/api.ts'
import type { Client, ClientPayload } from '@/types/client.ts'

/** clientsService: agrupa las solicitudes GET, POST y PUT del recurso /api/clients. */
export const clientsService = {
  list: () => apiRequest<Client[]>('/api/clients'),
  create: (payload: ClientPayload) =>
    apiRequest<Client>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: ClientPayload) =>
    apiRequest<Client>(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
}
