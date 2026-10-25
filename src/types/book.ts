export type Book = {
  id: number
  title: string
  author: string | null
  category: string | null
  price: number
  stock: number
}

export type BookPayload = Omit<Book, 'id'>
