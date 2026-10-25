import { apiRequest } from '@/services/api.ts'
import type { Book, BookFilters, BookPayload } from '@/types/book.ts'

const toBooksQueryString = (filters?: BookFilters) => {
  if (!filters) return ''
  const params = new URLSearchParams()

  if (filters.category?.trim()) {
    params.set('category', filters.category.trim())
  }
  if (filters.minPrice !== undefined && String(filters.minPrice).trim() !== '') {
    params.set('minPrice', String(filters.minPrice).trim())
  }
  if (filters.maxPrice !== undefined && String(filters.maxPrice).trim() !== '') {
    params.set('maxPrice', String(filters.maxPrice).trim())
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

/** booksService: agrupa las solicitudes GET, POST y PUT del recurso /api/books. */
export const booksService = {
  list: (filters?: BookFilters) => apiRequest<Book[]>(`/api/books${toBooksQueryString(filters)}`),
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
