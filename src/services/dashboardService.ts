import { booksService } from '@/services/booksService.ts'
import { clientsService } from '@/services/clientsService.ts'
import { reportsService } from '@/services/reportsService.ts'
import type { DashboardStats } from '@/types/dashboard.ts'
import { toLocalDate } from '@/utils/format.ts'
import { buildReport } from '@/utils/report.ts'

/** dashboardService: combina libros, clientes y ventas del día para calcular las métricas del panel. */
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const filters = { period: 'daily', date: toLocalDate() } as const
    const [books, clients, data] = await Promise.all([
      booksService.list(),
      clientsService.list(),
      reportsService.sales(filters),
    ])

    const today = buildReport(data, books, clients, filters).summary[0]

    return {
      totalBooks: books.length,
      totalClients: clients.length,
      salesToday: Number(today?.totalAmount ?? 0),
      transactionsToday: Number(today?.salesCount ?? 0),
    }
  },
}
