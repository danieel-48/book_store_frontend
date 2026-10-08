import { useCallback, useEffect, useState } from 'react'
import { booksService } from '../services/booksService'
import type { Book, BookPayload } from '../types/book'

/** useBooks: carga el catálogo y expone operaciones CRUD que refrescan la lista. HU-03. */
export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBooks = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await booksService.list()
      setBooks(response.data)
      setError('')
    } catch (exception) {
      setBooks([])
      setError(exception instanceof Error ? exception.message : 'No se pudieron cargar los libros.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadBooks()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadBooks])

  const createBook = async (payload: BookPayload) => {
    await booksService.create(payload)
    await loadBooks()
  }

  const updateBook = async (id: number, payload: BookPayload) => {
    await booksService.update(id, payload)
    await loadBooks()
  }

  const removeBook = async (id: number) => {
    await booksService.remove(id)
    await loadBooks()
  }

  return { books, isLoading, error, createBook, updateBook, removeBook, reload: loadBooks }
}
