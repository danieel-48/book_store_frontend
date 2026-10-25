// utils/pdf.ts: generación y descarga de comprobantes de venta en formato PDF · HU-06 y HU-07
// Funciones exportadas: exportSaleBillPdf
import jsPDF from 'jspdf'
import type { Sale } from '@/types/sale.ts'
import { formatCurrency, formatDateTime } from '@/utils/format.ts'
import { getSaleNumber } from '@/utils/sale.ts'

// HU-06 y HU-07: genera la factura de venta en PDF con detalles de cliente, libros, totales y pie de página
export const exportSaleBillPdf = (sale: Sale) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const saleNumber = getSaleNumber(sale)
  const left = 14
  const right = pageWidth - 14

  // Encabezado institucional
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, pageWidth, 34, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.text('BOOKSTORE', left, 16)
  doc.setFontSize(10)
  doc.text('Factura de venta / comprobante del cliente', left, 24)

  doc.setTextColor(15, 23, 42)
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.3)

  // Datos del cliente
  doc.setFontSize(10)
  doc.roundedRect(left, 42, 86, 34, 3, 3)
  doc.text('FACTURAR A', left + 4, 49)
  doc.setFontSize(12)
  doc.text(sale.client?.name ?? `Cliente #${sale.idClient}`, left + 4, 57)
  doc.setFontSize(10)
  doc.text(`ID del cliente: ${sale.idClient}`, left + 4, 64)
  if (sale.client?.email) {
    doc.text(`Correo: ${sale.client.email}`, left + 4, 71)
  }

  // Datos de la venta
  doc.roundedRect(right - 72, 42, 72, 46, 3, 3)
  doc.text('DETALLES', right - 68, 49)
  doc.text(`Venta No: ${saleNumber}`, right - 68, 57)
  doc.text(`Fecha: ${formatDateTime(sale.date)}`, right - 68, 71)
  doc.text(`Vendedor: ${sale.user?.name ?? 'N/D'}`, right - 68, 78)

  // Tabla de libros vendidos
  let y = 100
  doc.setFillColor(241, 245, 249)
  doc.rect(left, y, right - left, 10, 'F')
  doc.setFontSize(10)
  doc.text('Libro', left + 3, y + 6.5)
  doc.text('Cant.', left + 108, y + 6.5)
  doc.text('Precio unitario', left + 128, y + 6.5)
  doc.text('Importe', left + 165, y + 6.5)
  y += 14

  sale.items.forEach((item) => {
    const titleLines = doc.splitTextToSize(item.bookTitle, 96)
    const rowHeight = Math.max(10, titleLines.length * 5 + 3)

    doc.text(titleLines, left + 3, y)
    doc.text(String(item.quantity), left + 111, y)
    doc.text(formatCurrency(item.unitPrice), left + 128, y)
    doc.text(formatCurrency(item.total), left + 165, y)
    doc.line(left, y + rowHeight - 4, right, y + rowHeight - 4)

    y += rowHeight
  })

  // Totales
  y += 4
  const summaryX = right - 72
  doc.setFontSize(11)
  doc.text('Subtotal:', summaryX, y)
  doc.text(formatCurrency(sale.total), right, y, { align: 'right' })
  y += 8
  doc.setFont('helvetica', 'bold')
  doc.text('Total:', summaryX, y)
  doc.text(formatCurrency(sale.total), right, y, { align: 'right' })
  doc.setFont('helvetica', 'normal')

  y += 14
  doc.setFontSize(10)
  doc.text('Gracias por su compra.', left, y)
  doc.text('Conserve esta factura para sus registros.', left, y + 6)

  // Guarda y descarga el archivo PDF
  doc.save(`sale-${saleNumber}.pdf`)
}
