export type Book = {
  id: number
  title: string
  author: string
  category: string
  price: number
  stock: number
}

export type BookPayload = Omit<Book, 'id'>
