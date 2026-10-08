import type { Book } from '../../books/types/book'
import type { Client } from '../../clients/types/client'
import type { User } from '../../users/types/user'

export type CartItem = {
  book: Book
  quantity: number
}

export type SaleItemPayload = {
  book_id: number
  quantity: number
}

export type SalePayload = {
  client_id: number
  items: SaleItemPayload[]
}

export type SaleItem = {
  id: number
  quantity: number
  unit_price: number
  line_total: number
  book: Book
}

export type Sale = {
  id: number
  sale_number?: string
  bill_number?: string
  client: Client
  user: User
  total: number
  sold_at: string
  items: SaleItem[]
}
