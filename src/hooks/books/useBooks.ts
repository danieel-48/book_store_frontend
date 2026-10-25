// useBooks: gestiona la carga y mutaciones del catálogo de libros con la API REST · HU-05 inventario de libros
// Retorna: { books, isLoading, error, createBook, updateBook, reload }
import { useCallback, useEffect, useState } from 'react'
import { booksService } from '@/services/booksService.ts'
import type { Book, BookFilters, BookPayload } from '@/types/book.ts'

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]) // estado: lista de libros del catálogo
  const [isLoading, setIsLoading] = useState(true) // estado: indicador de carga en proceso
  const [error, setError] = useState('') // estado: mensaje de error en consulta

  // HU-05: consulta los libros desde la API con soporte para filtros
  const loadBooks = useCallback(async (filters?: BookFilters) => {
    setIsLoading(true)
    try {
      setBooks(await booksService.list(filters))
      setError('')
    } catch (exception) {
      setBooks([])
      setError(exception instanceof Error ? exception.message : 'No se pudieron cargar los libros.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Al montar, consulta la lista inicial de libros desde la API (HU-05)
  useEffect(() => {
    void loadBooks()
  }, [loadBooks])

  // HU-05: registra un nuevo libro en la API y recarga el catálogo
  const createBook = async (payload: BookPayload) => {
    await booksService.create(payload)
    await loadBooks()
  }

  // HU-05: actualiza los datos de un libro en la API y recarga el catálogo
  const updateBook = async (id: number, payload: BookPayload) => {
    await booksService.update(id, payload)
    await loadBooks()
  }

  return { books, isLoading, error, createBook, updateBook, reload: loadBooks }
}
