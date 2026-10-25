// services/clientsService.ts: comunicación con la API REST de AA3 (/api/clients)
import { apiRequest } from '@/services/api.ts'
import type { Client, ClientPayload } from '@/types/client.ts'

export const clientsService = {
  // HU-04: consultar todos los clientes registrados
  list: () => apiRequest<Client[]>('/api/clients'),

  // HU-04: crear un nuevo cliente con datos obligatorios
  create: (payload: ClientPayload) =>
    apiRequest<Client>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // HU-04: actualizar la información de un cliente por su id
  update: (id: number, payload: ClientPayload) =>
    apiRequest<Client>(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
}
