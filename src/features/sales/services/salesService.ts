import { apiRequest } from '../../../shared/utils/api'
import type { Sale, SalePayload } from '../types/sale'

/** salesService: registra ventas y consulta su detalle mediante los endpoints /sales. HU-05. */
export const salesService = {
  create: (payload: SalePayload) =>
    apiRequest<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  detail: (id: number) => apiRequest<Sale>(`/sales/${id}`),
}
