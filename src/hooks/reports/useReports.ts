// useReports: solicita ventas y detalles a la API y construye el reporte consolidado · HU-07 reportes de ventas
// Retorna: { filters, setFilters, result, isLoading, error, reload }
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

export const useReports = (books: Book[], clients: Client[], users: User[]) => {
  const [filters, setFilters] = useState<ReportFilters>(defaultFilters) // estado: filtros de período, fecha, cliente, libro y usuario
  const [data, setData] = useState<ReportData>({ sales: [], details: [] }) // estado: datos crudos de ventas y detalles desde la API
  const [isLoading, setIsLoading] = useState(false) // estado: indicador de carga en curso
  const [error, setError] = useState('') // estado: mensaje de error de consulta

  // Agrupa y calcula totales de ventas según filtros aplicados
  const result = useMemo<ReportResult>(() => buildReport(data, books, clients, filters, users), [data, books, clients, filters, users])

  // HU-07: consulta ventas y detalles en la API REST
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

  // Al cambiar filtros o montar la pantalla, recarga el reporte desde la API (HU-07)
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
