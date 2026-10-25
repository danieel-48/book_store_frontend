import { useCallback, useEffect, useState } from 'react'
import { booksService } from '@/services/booksService.ts'
import type { Book, BookPayload } from '@/types/book.ts'

/** useBooks: carga el catálogo y expone operaciones CRUD que refrescan la lista. HU-03. */
export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBooks = useCallback(async () => {
    setIsLoading(true)
    try {
      setBooks(await booksService.list())
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

  return { books, isLoading, error, createBook, updateBook, reload: loadBooks }
}
