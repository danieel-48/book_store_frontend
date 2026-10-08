import type { Sale } from '../../sales/types/sale'

export type ReportSummary = {
  period: string
  sales_count: number
  total_amount: number
}

export type ReportResult = {
  summary: ReportSummary[]
  sales: Sale[]
}

export type ReportFilters = {
  period: 'daily' | 'monthly' | 'yearly'
  client_id?: string
  book_id?: string
  user_id?: string
  date?: string
}
