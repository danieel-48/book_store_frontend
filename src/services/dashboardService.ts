import { booksService } from '@/services/booksService.ts'
import { clientsService } from '@/services/clientsService.ts'
import { reportsService } from '@/services/reportsService.ts'
import type { DashboardStats } from '@/types/dashboard.ts'

/** dashboardService: combina libros, clientes y ventas diarias para calcular las métricas del panel. HU-02. */
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [books, clients, report] = await Promise.all([
      booksService.list(),
      clientsService.list(),
      reportsService.sales({ period: 'daily', date: new Date().toISOString().split('T')[0] }),
    ])

    const today = report.data.summary[0]

    return {
      totalBooks: books.data.length,
      totalClients: clients.data.length,
      salesToday: Number(today?.total_amount ?? 0),
      transactionsToday: Number(today?.sales_count ?? 0),
    }
  },
}
