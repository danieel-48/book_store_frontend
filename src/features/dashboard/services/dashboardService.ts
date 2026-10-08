import { booksService } from '../../books/services/booksService'
import { clientsService } from '../../clients/services/clientsService'
import { reportsService } from '../../reports/services/reportsService'
import type { DashboardStats } from '../types/dashboard'

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
