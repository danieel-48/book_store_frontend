// services/reportsService.ts: comunicación con la API REST de AA3 (/api/sales y /api/sale-details)
import { apiRequest } from '@/services/api.ts'
import type { ReportData, ReportFilters } from '@/types/report.ts'
import type { SaleDetail, SaleRecord } from '@/types/sale.ts'

// Construye la query string para filtrar ventas por cliente y/o usuario vendedor
const toQueryString = (filters: ReportFilters) => {
  const params = new URLSearchParams()

  if (filters.idClient) params.set('idClient', filters.idClient)
  if (filters.idUser) params.set('idUser', filters.idUser)

  const query = params.toString()
  return query ? `?${query}` : ''
}

export const reportsService = {
  // HU-07: consultar el historial de ventas y sus detalles para generar reportes
  sales: async (filters: ReportFilters): Promise<ReportData> => {
    const [sales, details] = await Promise.all([
      apiRequest<SaleRecord[]>(`/api/sales${toQueryString(filters)}`),
      apiRequest<SaleDetail[]>('/api/sale-details'),
    ])

    return { sales, details }
  },
}
