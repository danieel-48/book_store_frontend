import { useEffect, useMemo, useState } from 'react'
import { useBooks } from '@/hooks/books/useBooks.ts'
import type { Book, BookPayload } from '@/types/book.ts'
import { isValidDecimal, isValidInteger, validateBookTitle, validateLettersOnly } from '@/utils/validation.ts'

type BookFormState = {
  title: string
  author: string
  category: string
  price: string
  stock: string
}

const emptyBook: BookFormState = {
  title: '',
  author: '',
  category: '',
  price: '',
  stock: '',
}

/** useBooksPage: coordina búsqueda, paginación, formulario y confirmaciones del inventario. HU-03. */
export const useBooksPage = () => {
  const { books, createBook, updateBook, removeBook } = useBooks()
  const pageSize = 10
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<BookFormState>(emptyBook)
  const [submitError, setSubmitError] = useState('')
  const [editingBookId, setEditingBookId] = useState<number | null>(null)
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false)
  const [deleteTargetBookId, setDeleteTargetBookId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [successMessage, setSuccessMessage] = useState('')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return books
    }

    return books.filter((book) => {
      const searchableText = `${book.id} ${book.title}`.toLowerCase()
      return searchableText.includes(query)
    })
  }, [books, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredBooks.slice(start, start + pageSize)
  }, [currentPage, filteredBooks])

  const openModal = () => {
    setSubmitError('')
    setEditingBookId(null)
    setForm(emptyBook)
    setIsModalOpen(true)
  }

  const openEditModal = (book: Book) => {
    setSubmitError('')
    setEditingBookId(book.id)
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      price: String(book.price),
      stock: String(book.stock),
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSubmitError('')
    setEditingBookId(null)
    setForm(emptyBook)
    setIsModalOpen(false)
    setIsUpdateConfirmOpen(false)
  }

  const updateTextForm = (field: 'title' | 'author' | 'category', value: string) => {
    setSubmitError('')
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateNumberForm = (field: 'price' | 'stock', value: string) => {
    setSubmitError('')
    setForm((current) => ({ ...current, [field]: value }))
  }

  // Valida los campos y construye el formato que espera la API.
  const validateAndBuildPayload = (): BookPayload | null => {
    const titleError = validateBookTitle(form.title)
    if (titleError) {
      setSubmitError(titleError)
      return null
    }

    const authorError = validateLettersOnly('Autor', form.author)
    if (authorError) {
      setSubmitError(authorError)
      return null
    }

    const categoryError = validateLettersOnly('Categoría', form.category)
    if (categoryError) {
      setSubmitError(categoryError)
      return null
    }

    if (!form.price.trim()) {
      setSubmitError('El precio es obligatorio.')
      return null
    }

    if (!form.stock.trim()) {
      setSubmitError('La existencia es obligatoria.')
      return null
    }

    if (!isValidDecimal(form.price)) {
      setSubmitError('El precio debe ser un número válido.')
      return null
    }

    if (!isValidInteger(form.stock)) {
      setSubmitError('La existencia debe contener solo números.')
      return null
    }

    const price = Number.parseFloat(form.price)
    const stock = Number.parseInt(form.stock, 10)

    if (!Number.isFinite(price) || price <= 0) {
      setSubmitError('El precio debe ser mayor que 0.')
      return null
    }

    if (!Number.isInteger(stock) || stock <= 0) {
      setSubmitError('La existencia debe ser mayor que 0.')
      return null
    }

    return {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      price,
      stock,
    }
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = validateAndBuildPayload()
    if (!payload) {
      return
    }

    try {
      if (editingBookId === null) {
        await createBook(payload)
        setSuccessMessage('Libro creado correctamente.')
      } else {
        await updateBook(editingBookId, payload)
        setSuccessMessage('Libro actualizado correctamente.')
      }

      setForm(emptyBook)
      setSubmitError('')
      setEditingBookId(null)
      setIsModalOpen(false)
      setIsUpdateConfirmOpen(false)
      setIsSuccessModalOpen(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : `No se pudo ${editingBookId === null ? 'crear' : 'actualizar'} el libro.`)
    }
  }

  const requestUpdateConfirmation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = validateAndBuildPayload()
    if (!payload || editingBookId === null) {
      return
    }

    setSubmitError('')
    setIsUpdateConfirmOpen(true)
  }

  const confirmUpdate = async () => {
    if (editingBookId === null) {
      return
    }

    const payload = validateAndBuildPayload()
    if (!payload) {
      setIsUpdateConfirmOpen(false)
      return
    }

    try {
      await updateBook(editingBookId, payload)
      setSuccessMessage('Libro actualizado correctamente.')
      setForm(emptyBook)
      setSubmitError('')
      setEditingBookId(null)
      setIsModalOpen(false)
      setIsUpdateConfirmOpen(false)
      setIsSuccessModalOpen(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo actualizar el libro.')
      setIsUpdateConfirmOpen(false)
    }
  }

  const cancelUpdateConfirmation = () => {
    setIsUpdateConfirmOpen(false)
  }

  const requestDeleteConfirmation = (id: number) => {
    setDeleteTargetBookId(id)
  }

  const cancelDeleteConfirmation = () => {
    setDeleteTargetBookId(null)
  }

  const confirmDelete = async () => {
    if (deleteTargetBookId === null) {
      return
    }

    try {
      await removeBook(deleteTargetBookId)
      setDeleteTargetBookId(null)
      setSuccessMessage('Libro eliminado correctamente.')
      setIsSuccessModalOpen(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo eliminar el libro.')
      setDeleteTargetBookId(null)
    }
  }

  const closeSuccessModal = () => {
    setSuccessMessage('')
    setIsSuccessModalOpen(false)
  }

  return {
    books: paginatedBooks,
    searchQuery,
    filteredBooksCount: filteredBooks.length,
    currentPage,
    totalPages,
    isModalOpen,
    isUpdateConfirmOpen,
    isSuccessModalOpen,
    deleteTargetBookId,
    editingBookId,
    form,
    submitError,
    successMessage,
    openModal,
    openEditModal,
    closeModal,
    requestUpdateConfirmation,
    confirmUpdate,
    cancelUpdateConfirmation,
    requestDeleteConfirmation,
    confirmDelete,
    cancelDeleteConfirmation,
    closeSuccessModal,
    updateTextForm,
    updateNumberForm,
    setSearchQuery,
    setCurrentPage,
    submit,
  }
}
