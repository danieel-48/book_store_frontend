import { apiRequest } from '../../../shared/utils/api'
import type { ReportFilters, ReportResult } from '../types/report'

const toQueryString = (filters: ReportFilters) => {
  const params = new URLSearchParams()
  params.set('period', filters.period)

  if (filters.client_id) params.set('client_id', filters.client_id)
  if (filters.book_id) params.set('book_id', filters.book_id)
  if (filters.user_id) params.set('user_id', filters.user_id)
  if (filters.date) params.set('date', filters.date)

  return params.toString()
}

/** reportsService: consulta /reports/sales y serializa los filtros como parámetros URL. HU-06. */
export const reportsService = {
  sales: (filters: ReportFilters) => apiRequest<ReportResult>(`/reports/sales?${toQueryString(filters)}`),
}
