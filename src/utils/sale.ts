import type { Sale } from '@/types/sale.ts'

export const getSaleNumber = (sale: Pick<Sale, 'id' | 'sold_at'>) => {
  const date = new Date(sale.sold_at)
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  return `${datePart}-${sale.id}`
}