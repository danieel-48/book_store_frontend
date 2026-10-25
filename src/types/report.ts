import type { Sale, SaleDetail, SaleRecord } from '@/types/sale.ts'

export type ReportSummary = {
  period: string
  salesCount: number
  totalAmount: number
}

export type ReportResult = {
  summary: ReportSummary[]
  sales: Sale[]
}

export type ReportData = {
  sales: SaleRecord[]
  details: SaleDetail[]
}

export type ReportFilters = {
  period: 'daily' | 'monthly' | 'yearly'
  idClient?: string
  idBook?: string
  idUser?: string
  date?: string
}
