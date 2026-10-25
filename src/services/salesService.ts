// services/salesService.ts: comunicación con la API REST de AA3 (/api/sales y /api/sale-details)
import { apiRequest } from '@/services/api.ts'
import type { SaleDetail, SaleDetailPayload, SalePayload, SaleRecord } from '@/types/sale.ts'

export const salesService = {
  // HU-06: procesar y registrar una venta junto con sus ítems en la API
  create: async (payload: SalePayload, items: Omit<SaleDetailPayload, 'idSale'>[]) => {
    // Registra la cabecera de la venta (cliente, usuario vendedor y fecha)
    const created = await apiRequest<SaleRecord>('/api/sales', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const details: SaleDetail[] = []

    // Registra cada ítem vendido asociado al identificador de la venta
    for (const item of items) {
      details.push(
        await apiRequest<SaleDetail>('/api/sale-details', {
          method: 'POST',
          body: JSON.stringify({ ...item, idSale: created.idSale }),
        }),
      )
    }

    // Consulta la venta consolidada con su total general calculado
    const sale = await apiRequest<SaleRecord>(`/api/sales/${created.idSale}`)

    return { sale, details }
  },
}
