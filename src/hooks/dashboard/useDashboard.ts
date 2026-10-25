import { useEffect, useState } from 'react'
import { dashboardService } from '@/services/dashboardService.ts'
import type { DashboardStats } from '@/types/dashboard.ts'

const initialStats: DashboardStats = {
  totalBooks: 0,
  totalClients: 0,
  salesToday: 0,
  transactionsToday: 0,
}

/** useDashboard: carga y expone las métricas resumidas del panel principal. HU-02. */
export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>(initialStats)

  useEffect(() => {
    dashboardService.getStats().then(setStats).catch(() => setStats(initialStats))
  }, [])

  return { stats }
}
