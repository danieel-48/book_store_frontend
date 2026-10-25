import { apiRequest } from '@/services/api.ts'
import type { SaleDetail, SaleDetailPayload, SalePayload, SaleRecord } from '@/types/sale.ts'

/** salesService: registra ventas (/api/sales) y sus detalles (/api/sale-details). */
export const salesService = {
  // Crea la venta y luego cada detalle; la API calcula el total y descuenta el stock.
  create: async (payload: SalePayload, items: Omit<SaleDetailPayload, 'idSale'>[]) => {
    const created = await apiRequest<SaleRecord>('/api/sales', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const details: SaleDetail[] = []

    for (const item of items) {
      details.push(
        await apiRequest<SaleDetail>('/api/sale-details', {
          method: 'POST',
          body: JSON.stringify({ ...item, idSale: created.idSale }),
        }),
      )
    }

    const sale = await apiRequest<SaleRecord>(`/api/sales/${created.idSale}`)

    return { sale, details }
  },
}
