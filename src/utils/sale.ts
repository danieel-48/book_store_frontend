// utils/sale.ts: funciones auxiliares para estructurar objetos de venta y comprobantes · HU-06 y HU-07
// Funciones exportadas: getSaleNumber, buildSale
import type { Book } from '@/types/book.ts'
import type { Client } from '@/types/client.ts'
import type { Sale, SaleDetail, SaleRecord } from '@/types/sale.ts'
import type { User } from '@/types/user.ts'

// Genera un número legible de comprobante basado en la fecha y el ID de la venta
export const getSaleNumber = (sale: Pick<Sale, 'idSale' | 'date'>) => {
  if (!sale.date) {
    return String(sale.idSale)
  }

  return `${sale.date.slice(0, 10).replaceAll('-', '')}-${sale.idSale}`
}

// HU-06 y HU-07: une el registro de venta con sus detalles, libros, cliente y usuario para visualización completa
export const buildSale = (
  record: SaleRecord,
  details: SaleDetail[],
  books: Book[],
  clients: Client[],
  users: User[] = [],
): Sale => ({
  ...record,
  client: clients.find((client) => client.idClient === record.idClient) ?? null,
  user: users.find((user) => user.id === record.idUser) ?? null,
  items: details
    .filter((detail) => detail.idSale === record.idSale)
    .map((detail) => ({
      idDetail: detail.idDetail,
      idBook: detail.idBook,
      bookTitle: books.find((book) => book.id === detail.idBook)?.title ?? `Libro #${detail.idBook}`,
      quantity: detail.quantity,
      unitPrice: detail.quantity > 0 ? detail.total / detail.quantity : 0,
      total: detail.total,
    })),
})
