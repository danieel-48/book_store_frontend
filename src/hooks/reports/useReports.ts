import { useCallback, useEffect, useState } from 'react'
import { reportsService } from '@/services/reportsService.ts'
import type { ReportFilters, ReportResult } from '@/types/report.ts'

const getTodayDate = () => new Date().toISOString().slice(0, 10)

const defaultFilters: ReportFilters = {
  period: 'daily',
  date: getTodayDate(),
}

/** useReports: solicita los datos del reporte cada vez que cambian sus filtros. HU-06. */
export const useReports = () => {
  const [filters, setFilters] = useState<ReportFilters>(defaultFilters)
  const [result, setResult] = useState<ReportResult>({ summary: [], sales: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadReports = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await reportsService.sales(filters)
      setResult(response.data)
    } catch (exception) {
      setResult({ summary: [], sales: [] })
      setError(exception instanceof Error ? exception.message : 'No se pudieron cargar los reportes.')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

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
