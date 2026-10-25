import { apiRequest } from '@/services/api.ts'
import type { ReportData, ReportFilters } from '@/types/report.ts'
import type { SaleDetail, SaleRecord } from '@/types/sale.ts'

const toQueryString = (filters: ReportFilters) => {
  const params = new URLSearchParams()

  if (filters.idClient) params.set('idClient', filters.idClient)
  if (filters.idUser) params.set('idUser', filters.idUser)

  const query = params.toString()
  return query ? `?${query}` : ''
}

/** reportsService: obtiene los detalles de venta (/api/sale-details) y las ventas filtradas por cliente y usuario. */
export const reportsService = {
  sales: async (filters: ReportFilters): Promise<ReportData> => {
    const [sales, details] = await Promise.all([
      apiRequest<SaleRecord[]>(`/api/sales${toQueryString(filters)}`),
      apiRequest<SaleDetail[]>('/api/sale-details'),
    ])

    return { sales, details }
  },
}
