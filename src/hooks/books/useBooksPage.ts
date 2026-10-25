// useBooksPage: coordina la lógica de búsqueda, paginación, formularios y confirmaciones del inventario · HU-05 inventario de libros
// Retorna: estados y manejadores de la página de libros
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

export const useBooksPage = () => {
  const { books, createBook, updateBook } = useBooks()
  const pageSize = 10
  const [isModalOpen, setIsModalOpen] = useState(false) // estado: visibilidad del modal de formulario
  const [form, setForm] = useState<BookFormState>(emptyBook) // estado: campos del formulario del libro
  const [submitError, setSubmitError] = useState('') // estado: error de validación o del servidor
  const [editingBookId, setEditingBookId] = useState<number | null>(null) // estado: ID del libro editado (o null si es nuevo)
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false) // estado: modal de confirmación antes de guardar edición
  const [searchQuery, setSearchQuery] = useState('') // estado: texto de búsqueda por título o ID
  const [currentPage, setCurrentPage] = useState(1) // estado: página actual del catálogo
  const [successMessage, setSuccessMessage] = useState('') // estado: mensaje de éxito de la operación
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // estado: modal de confirmación exitosa

  // Filtra los libros en memoria según el ID o título buscado
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

  // Reinicia a la primera página si cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Ajusta la página si se redujo el total de páginas
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  // Segmenta la lista para paginación local de 10 elementos por página
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
      author: book.author ?? '',
      category: book.category ?? '',
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

  // Valida los campos y construye el objeto de datos que espera la API
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

  // HU-05: envía la creación o edición del libro a la API REST
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

  // HU-05: confirma y ejecuta la actualización en la API
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
    closeSuccessModal,
    updateTextForm,
    updateNumberForm,
    setSearchQuery,
    setCurrentPage,
    submit,
  }
}
