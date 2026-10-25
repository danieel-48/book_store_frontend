import { apiRequest } from '@/services/api.ts'
import type { Book, BookPayload } from '@/types/book.ts'

/** booksService: agrupa las solicitudes GET, POST y PUT del recurso /api/books. */
export const booksService = {
  list: () => apiRequest<Book[]>('/api/books'),
  create: (payload: BookPayload) =>
    apiRequest<Book>('/api/books', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: BookPayload) =>
    apiRequest<Book>(`/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
}
