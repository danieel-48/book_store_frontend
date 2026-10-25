// services/booksService.ts: comunicación con la API REST de AA3 (/api/books)
import { apiRequest } from '@/services/api.ts'
import type { Book, BookFilters, BookPayload } from '@/types/book.ts'

// Construye la cadena de consulta para filtros de categoría y precio
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

export const booksService = {
  // HU-05 y HU-06: consultar todos los libros o filtrar por categoría y precio
  list: (filters?: BookFilters) => apiRequest<Book[]>(`/api/books${toBooksQueryString(filters)}`),

  // HU-05: registrar un nuevo libro en el catálogo
  create: (payload: BookPayload) =>
    apiRequest<Book>('/api/books', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // HU-05: actualizar los datos de un libro existente por su id
  update: (id: number, payload: BookPayload) =>
    apiRequest<Book>(`/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
}
