import { useCallback, useEffect, useMemo, useState } from 'react'
import { reportsService } from '@/services/reportsService.ts'
import type { Book } from '@/types/book.ts'
import type { Client } from '@/types/client.ts'
import type { User } from '@/types/user.ts'
import type { ReportData, ReportFilters, ReportResult } from '@/types/report.ts'
import { toLocalDate } from '@/utils/format.ts'
import { buildReport } from '@/utils/report.ts'

const defaultFilters: ReportFilters = {
  period: 'daily',
  date: toLocalDate(),
}

/** useReports: solicita ventas y detalles (/api/sale-details) y arma el reporte según los filtros. */
export const useReports = (books: Book[], clients: Client[], users: User[]) => {
  const [filters, setFilters] = useState<ReportFilters>(defaultFilters)
  const [data, setData] = useState<ReportData>({ sales: [], details: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const result = useMemo<ReportResult>(() => buildReport(data, books, clients, filters, users), [data, books, clients, filters, users])

  const loadReports = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      setData(await reportsService.sales(filters))
    } catch (exception) {
      setData({ sales: [], details: [] })
      setError(exception instanceof Error ? exception.message : 'No se pudieron cargar los reportes.')
    } finally {
      setIsLoading(false)
    }
  }, [filters.idClient, filters.idUser]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReports()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadReports])

  return {
    filters,
    setFilters,
    result,
    isLoading,
    error,
    reload: loadReports,
  }
}
