// utils/report.ts: procesamiento y consolidación de reportes de ventas por período · HU-07 reportes de ventas
// Funciones exportadas: buildReport
import type { Book } from '@/types/book.ts'
import type { Client } from '@/types/client.ts'
import type { User } from '@/types/user.ts'
import type { ReportData, ReportFilters, ReportResult, ReportSummary } from '@/types/report.ts'
import { buildSale } from '@/utils/sale.ts'

const periodLength = { daily: 10, monthly: 7, yearly: 4 } as const

// HU-07: agrupa las ventas por período (día, mes, año) y aplica filtros por fecha, libro, cliente y usuario
export const buildReport = (
  data: ReportData,
  books: Book[],
  clients: Client[],
  filters: ReportFilters,
  users: User[] = [],
): ReportResult => {
  const length = periodLength[filters.period]
  const periodOf = (date: string) => date.slice(0, length)
  const selectedPeriod = filters.date ? periodOf(filters.date) : ''
  const selectedBook = filters.idBook ? Number(filters.idBook) : null

  const sales = data.sales
    .filter((sale) => sale.date !== null)
    .filter((sale) => !selectedPeriod || periodOf(sale.date as string) === selectedPeriod)
    .filter(
      (sale) =>
        selectedBook === null ||
        data.details.some((detail) => detail.idSale === sale.idSale && detail.idBook === selectedBook),
    )
    .sort((a, b) => (b.date as string).localeCompare(a.date as string))
    .map((sale) => buildSale(sale, data.details, books, clients, users))

  const grouped = new Map<string, ReportSummary>()

  sales.forEach((sale) => {
    const period = periodOf(sale.date as string)
    const row = grouped.get(period) ?? { period, salesCount: 0, totalAmount: 0 }
    row.salesCount += 1
    row.totalAmount += Number(sale.total)
    grouped.set(period, row)
  })

  const summary = [...grouped.values()].sort((a, b) => a.period.localeCompare(b.period))

  return { summary, sales }
}
