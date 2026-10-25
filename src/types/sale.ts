import type { Book } from '@/types/book.ts'
import type { Client } from '@/types/client.ts'
import type { User } from '@/types/user.ts'

export type CartItem = {
  book: Book
  quantity: number
}

export type SalePayload = {
  date?: string
  idClient: number
  idUser?: number
}

export type SaleRecord = {
  idSale: number
  date: string | null
  total: number
  idClient: number
  idUser: number | null
}

export type SaleDetailPayload = {
  idSale: number
  idBook: number
  quantity: number
}

export type SaleDetail = SaleDetailPayload & {
  idDetail: number
  total: number
}

export type SaleItem = {
  idDetail: number
  idBook: number
  bookTitle: string
  quantity: number
  unitPrice: number
  total: number
}

export type Sale = SaleRecord & {
  client: Client | null
  user: User | null
  items: SaleItem[]
}
