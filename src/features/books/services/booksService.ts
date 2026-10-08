import { apiRequest } from '../../../shared/utils/api'
import type { Book, BookPayload } from '../types/book'

/** booksService: agrupa las solicitudes GET, POST, PUT y DELETE del recurso /books. HU-03. */
export const booksService = {
  list: () => apiRequest<Book[]>('/books'),
  create: (payload: BookPayload) =>
    apiRequest<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: BookPayload) =>
    apiRequest<Book>(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id: number) =>
    apiRequest<null>(`/books/${id}`, {
      method: 'DELETE',
    }),
}
