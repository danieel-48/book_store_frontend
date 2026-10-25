// useReportsPage: coordina filtros, datos auxiliares, paginación y exportación de reportes · HU-07 reportes de ventas
// Retorna: estados y manejadores de la pantalla de reportes
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

export const useReportsPage = () => {
  const pageSize = 10
  const { user } = useAuth()
  const { clients, error: clientsError } = useClients()
  const { books, error: booksError } = useBooks()
  const { users, error: usersError } = useUsers()
  const { filters, setFilters, result, isLoading, error } = useReports(books, clients, users)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null) // estado: venta seleccionada para modal de detalle
  const [currentPage, setCurrentPage] = useState(1) // estado: página actual en el listado de ventas

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
    () => result.summary.reduce((sum, row) => sum + Number(row.totalAmount), 0),
    [result.summary],
  )

  // HU-07: genera reporte consolidado en PDF y dispara la descarga en el navegador
  const exportPdf = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(`Reporte de ventas ${periodLabels[filters.period]}`, 10, 20)
    doc.setFontSize(11)

    result.summary.forEach((row, index) => {
      doc.text(
        `${row.period} | Ventas: ${row.salesCount} | Total: ${formatCurrency(Number(row.totalAmount))}`,
        10,
        35 + index * 8,
      )
    })

    doc.text(`Total general: ${formatCurrency(totalAmount)}`, 10, 45 + result.summary.length * 8)
    doc.save(`bookstore-reporte-${filters.period}.pdf`)
  }

  // HU-07: exporta la factura/comprobante individual de una venta en PDF
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
    currentUser: user,
    clients,
    books,
    users,
    usersError,
    selectedSale,
    setSelectedSale,
    totalAmount,
    exportPdf,
    exportSaleBill,
  }
}
