import jsPDF from 'jspdf'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/useAuth'
import { useBooks } from '@/hooks/books/useBooks.ts'
import { useClients } from '@/hooks/clients/useClients.ts'
import { useUsers } from '@/hooks/users/useUsers.ts'
import { formatCurrency } from '@/utils/format.ts'
import { exportSaleBillPdf } from '@/utils/pdf.ts'
import { useReports } from '@/hooks/reports/useReports.ts'
import type { Sale } from '@/types/sale.ts'

const tabs = ['daily', 'monthly', 'yearly'] as const
const periodLabels = {
  daily: 'diario',
  monthly: 'mensual',
  yearly: 'anual',
} as const

/** useReportsPage: coordina filtros, datos auxiliares, paginación y exportación de reportes. HU-06. */
export const useReportsPage = () => {
  const pageSize = 10
  const { user } = useAuth()
  const { filters, setFilters, result, isLoading, error } = useReports()
  const { clients, error: clientsError } = useClients()
  const { books, error: booksError } = useBooks()
  const { users, error: usersError } = useUsers({ enabled: user?.role === 'ADMIN' })
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(result.sales.length / pageSize))

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return result.sales.slice(start, start + pageSize)
  }, [currentPage, result.sales])

  const pageNumbers = useMemo(() => {
    const maxVisible = 5
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)
    const adjustedStart = Math.max(1, end - maxVisible + 1)

    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index)
  }, [currentPage, totalPages])

  const totalAmount = useMemo(
    () => result.summary.reduce((sum, row) => sum + Number(row.total_amount), 0),
    [result.summary],
  )

  const exportPdf = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(`Reporte de ventas ${periodLabels[filters.period]}`, 10, 20)
    doc.setFontSize(11)

    result.summary.forEach((row, index) => {
      doc.text(
        `${row.period} | Ventas: ${row.sales_count} | Total: ${formatCurrency(Number(row.total_amount))}`,
        10,
        35 + index * 8,
      )
    })

    doc.text(`Total general: ${formatCurrency(totalAmount)}`, 10, 45 + result.summary.length * 8)
    doc.save(`bookstore-reporte-${filters.period}.pdf`)
  }

  const exportSaleBill = (sale: Sale) => {
    exportSaleBillPdf(sale)
  }

  return {
    tabs,
    filters,
    setFilters,
    result,
    paginatedSales,
    currentPage,
    totalPages,
    pageNumbers,
    setCurrentPage,
    isLoading,
    error,
    clientsError,
    booksError,
    usersError,
    currentUser: user,
    clients,
    books,
    users,
    selectedSale,
    setSelectedSale,
    totalAmount,
    exportPdf,
    exportSaleBill,
  }
}
