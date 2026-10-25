import { apiRequest } from '@/services/api.ts'
import type { Sale, SalePayload } from '@/types/sale.ts'

/** salesService: registra ventas y consulta su detalle mediante los endpoints /sales. HU-05. */
export const salesService = {
  create: (payload: SalePayload) =>
    apiRequest<Sale>('/api/sales', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  detail: (id: number) => apiRequest<Sale>(`/api/sales/${id}`),
}
