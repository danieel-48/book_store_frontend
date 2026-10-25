// useSalesPage: coordina búsqueda, filtros avanzados, formularios auxiliares y flujo POS · HU-06 punto de venta
// Retorna: estados y manejadores del terminal de punto de venta (POS)
import { useEffect, useMemo, useState } from 'react'
import type { ClientFormState } from '@/types/client.ts'
import type { BookFilters, BookPayload } from '@/types/book.ts'
import { exportSaleBillPdf } from '@/utils/pdf.ts'
import {
  isValidDecimal,
  isValidInteger,
  validateBookTitle,
  validateLettersOnly,
  validateRequiredEmail,
  validateRequiredIdNumber,
  validateRequiredPhone,
} from '@/utils/validation.ts'
import { useSalesPOS } from '@/hooks/sales/useSalesPOS.ts'

const emptyClientForm: ClientFormState = {
  idNumber: '',
  name: '',
  email: '',
  phone: '',
}

const emptyBookForm = {
  title: '',
  author: '',
  category: '',
  price: '',
  stock: '',
}

export const useSalesPage = () => {
  const sales = useSalesPOS()
  const booksPageSize = 12
  const [isClientModalOpen, setIsClientModalOpen] = useState(false) // estado: visibilidad modal de nuevo cliente
  const [clientForm, setClientForm] = useState<ClientFormState>(emptyClientForm) // estado: formulario rápido de cliente
  const [clientSearch, setClientSearch] = useState('') // estado: búsqueda de cliente por ID o nombre
  const [isClientResultsOpen, setIsClientResultsOpen] = useState(false) // estado: desplegable de sugerencias de clientes
  const [clientSubmitError, setClientSubmitError] = useState('') // estado: error al crear cliente
  const [bookSearch, setBookSearch] = useState('') // estado: búsqueda de libro por ID o título
  const [isBookResultsOpen, setIsBookResultsOpen] = useState(false) // estado: desplegable de sugerencias de libros
  const [isBookModalOpen, setIsBookModalOpen] = useState(false) // estado: visibilidad modal de nuevo libro
  const [bookSubmitError, setBookSubmitError] = useState('') // estado: error al crear libro
  const [bookTitle, setBookTitle] = useState(emptyBookForm.title) // estado: título del libro a crear
  const [bookAuthor, setBookAuthor] = useState(emptyBookForm.author) // estado: autor del libro a crear
  const [bookCategory, setBookCategory] = useState(emptyBookForm.category) // estado: categoría del libro a crear
  const [bookPrice, setBookPrice] = useState(emptyBookForm.price) // estado: precio del libro a crear
  const [bookStock, setBookStock] = useState(emptyBookForm.stock) // estado: stock del libro a crear
  const [booksPage, setBooksPage] = useState(1) // estado: página actual del catálogo de libros
  const [saleSuccessMessage, setSaleSuccessMessage] = useState('') // estado: confirmación de venta realizada
  const [createSuccessMessage, setCreateSuccessMessage] = useState('') // estado: mensaje de éxito para cliente o libro creado
  const [isCreateSuccessModalOpen, setIsCreateSuccessModalOpen] = useState(false) // estado: modal de creación exitosa
  const [removeItemTargetBookId, setRemoveItemTargetBookId] = useState<number | null>(null) // estado: ID de artículo a eliminar del carrito

  // Estados para filtro por categoría y precio en Sales (HU-06)
  const [filterCategory, setFilterCategory] = useState('') // estado: categoría seleccionada para filtrar
  const [filterMinPrice, setFilterMinPrice] = useState('') // estado: precio mínimo del filtro
  const [filterMaxPrice, setFilterMaxPrice] = useState('') // estado: precio máximo del filtro
  const [filterError, setFilterError] = useState('') // estado: error de validación de los filtros
  const [activeFiltersCount, setActiveFiltersCount] = useState(0) // estado: cantidad de filtros aplicados

  const availableCategories = useMemo(() => {
    const set = new Set<string>()
    sales.books.forEach((b) => {
      if (b.category?.trim()) {
        set.add(b.category.trim())
      }
    })
    return Array.from(set).sort()
  }, [sales.books])

  // HU-06: consulta libros filtrados por categoría y precio en la API
  const applyBookFilters = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault()
    }

    setFilterError('')

    const min = filterMinPrice.trim() !== '' ? Number(filterMinPrice) : undefined
    const max = filterMaxPrice.trim() !== '' ? Number(filterMaxPrice) : undefined

    if (min !== undefined && (isNaN(min) || min < 0)) {
      setFilterError('El precio mínimo debe ser un número mayor o igual a 0.')
      return
    }

    if (max !== undefined && (isNaN(max) || max < 0)) {
      setFilterError('El precio máximo debe ser un número mayor o igual a 0.')
      return
    }

    if (min !== undefined && max !== undefined && min > max) {
      setFilterError('El precio mínimo no puede ser mayor que el precio máximo.')
      return
    }

    const filters: BookFilters = {
      category: filterCategory.trim() || undefined,
      minPrice: filterMinPrice.trim() !== '' ? filterMinPrice.trim() : undefined,
      maxPrice: filterMaxPrice.trim() !== '' ? filterMaxPrice.trim() : undefined,
    }

    let count = 0
    if (filters.category) count++
    if (filters.minPrice !== undefined) count++
    if (filters.maxPrice !== undefined) count++
    setActiveFiltersCount(count)

    setBooksPage(1)
    await sales.reloadBooks(filters)
  }

  // HU-06: restablece filtros y recarga el catálogo completo desde la API
  const clearBookFilters = async () => {
    setFilterCategory('')
    setFilterMinPrice('')
    setFilterMaxPrice('')
    setFilterError('')
    setActiveFiltersCount(0)
    setBooksPage(1)
    await sales.reloadBooks()
  }

  const totalBooksPages = Math.max(1, Math.ceil(sales.books.length / booksPageSize))

  useEffect(() => {
    setBooksPage((page) => Math.min(page, totalBooksPages))
  }, [totalBooksPages])

  const paginatedBooks = useMemo(() => {
    const start = (booksPage - 1) * booksPageSize
    return sales.books.slice(start, start + booksPageSize)
  }, [booksPage, sales.books])

  const booksPageNumbers = useMemo(() => {
    const maxVisible = 5
    const start = Math.max(1, booksPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalBooksPages, start + maxVisible - 1)
    const adjustedStart = Math.max(1, end - maxVisible + 1)

    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index)
  }, [booksPage, totalBooksPages])

  const filteredClients = useMemo(() => {
    const query = clientSearch.trim().toLowerCase()

    if (!query) {
      return sales.clients
    }

    return sales.clients.filter((client) => {
      const searchableText = `${client.idClient} ${client.name}`.toLowerCase()
      return searchableText.includes(query)
    })
  }, [sales.clients, clientSearch])

  const filteredBooks = useMemo(() => {
    const query = bookSearch.trim().toLowerCase()

    if (!query) {
      return sales.books
    }

    return sales.books.filter((book) => {
      const searchableText = `${book.id} ${book.title}`.toLowerCase()
      return searchableText.includes(query)
    })
  }, [sales.books, bookSearch])

  const openClientModal = () => {
    setClientSubmitError('')
    setClientForm(emptyClientForm)
    setIsClientModalOpen(true)
  }

  const closeClientModal = () => {
    setClientSubmitError('')
    setClientForm(emptyClientForm)
    setIsClientModalOpen(false)
  }

  const updateClientForm = (field: keyof ClientFormState, value: string) => {
    setClientSubmitError('')

    if (field === 'phone' || field === 'idNumber') {
      setClientForm((current) => ({ ...current, [field]: value.replace(/\D/g, '') }))
      return
    }

    setClientForm((current) => ({ ...current, [field]: value }))
  }

  const handleClientSearchChange = (value: string) => {
    setClientSearch(value)
    setIsClientResultsOpen(true)
  }

  const handleBookSearchChange = (value: string) => {
    setBookSearch(value)
    setIsBookResultsOpen(Boolean(value.trim()))
  }

  const selectClient = (id: number, name: string) => {
    sales.setClientId(id)
    setClientSearch(`${id} - ${name}`)
    setIsClientResultsOpen(false)
  }

  const selectBook = (id: number) => {
    setBookSearch('')
    setIsBookResultsOpen(false)
    sales.addBook(id)
  }

  // HU-06: completa la venta en el POS y muestra confirmación
  const completeSale = async () => {
    setSaleSuccessMessage('')
    const isCompleted = await sales.completeSale()

    if (!isCompleted) {
      return
    }

    setClientSearch('')
    setBookSearch('')
    setIsClientResultsOpen(false)
    setIsBookResultsOpen(false)
    sales.setClientId(null)
    setBooksPage(1)
    setSaleSuccessMessage('Sale completed successfully.')
  }

  // HU-06: exporta el comprobante de la venta registrada a PDF
  const exportLastSaleBill = () => {
    if (!sales.lastSale) {
      return
    }

    exportSaleBillPdf(sales.lastSale)
  }

  // HU-04: registra cliente rápido directamente desde el flujo de ventas
  const submitClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nameError = validateLettersOnly('Nombre', clientForm.name)
    if (nameError) {
      setClientSubmitError(nameError)
      return
    }

    const idNumberError = validateRequiredIdNumber('Número de identificación', clientForm.idNumber)
    if (idNumberError) {
      setClientSubmitError(idNumberError)
      return
    }

    const emailError = validateRequiredEmail('Correo electrónico', clientForm.email)
    if (emailError) {
      setClientSubmitError(emailError)
      return
    }

    const phoneError = validateRequiredPhone('Teléfono', clientForm.phone)
    if (phoneError) {
      setClientSubmitError(phoneError)
      return
    }

    try {
      const client = await sales.createClient({
        idNumber: Number(clientForm.idNumber.trim()),
        name: clientForm.name.trim(),
        email: clientForm.email.trim(),
        phone: Number(clientForm.phone.trim()),
      })
      sales.setClientId(client.idClient)
      setClientSearch(`${client.idClient} - ${client.name}`)
      setIsClientResultsOpen(false)
      setClientForm(emptyClientForm)
      setClientSubmitError('')
      setIsClientModalOpen(false)
      setCreateSuccessMessage('Cliente creado correctamente.')
      setIsCreateSuccessModalOpen(true)
    } catch (error) {
      setClientSubmitError(error instanceof Error ? error.message : 'Error al crear el cliente.')
    }
  }

  const openBookModal = () => {
    setBookSubmitError('')
    setBookTitle(emptyBookForm.title)
    setBookAuthor(emptyBookForm.author)
    setBookCategory(emptyBookForm.category)
    setBookPrice(emptyBookForm.price)
    setBookStock(emptyBookForm.stock)
    setIsBookModalOpen(true)
  }

  const closeBookModal = () => {
    setBookSubmitError('')
    setBookTitle(emptyBookForm.title)
    setBookAuthor(emptyBookForm.author)
    setBookCategory(emptyBookForm.category)
    setBookPrice(emptyBookForm.price)
    setBookStock(emptyBookForm.stock)
    setIsBookModalOpen(false)
  }

  // HU-05: registra libro rápido directamente desde la vista POS
  const submitBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const titleError = validateBookTitle(bookTitle)
    if (titleError) {
      setBookSubmitError(titleError)
      return
    }

    const authorError = validateLettersOnly('Book author', bookAuthor)
    if (authorError) {
      setBookSubmitError(authorError)
      return
    }

    const categoryError = validateLettersOnly('Book category', bookCategory)
    if (categoryError) {
      setBookSubmitError(categoryError)
      return
    }

    if (!bookPrice.trim()) {
      setBookSubmitError('Book price is required.')
      return
    }

    if (!bookStock.trim()) {
      setBookSubmitError('Book stock is required.')
      return
    }

    if (!isValidDecimal(bookPrice)) {
      setBookSubmitError('Book price must be a valid number.')
      return
    }

    if (!isValidInteger(bookStock)) {
      setBookSubmitError('Book stock must contain only numbers.')
      return
    }

    const price = Number.parseFloat(bookPrice)
    const stock = Number.parseInt(bookStock, 10)

    if (!Number.isFinite(price) || price <= 0) {
      setBookSubmitError('Book price must be greater than 0.')
      return
    }

    if (!Number.isInteger(stock) || stock <= 0) {
      setBookSubmitError('Book stock must be greater than 0.')
      return
    }

    const payload: BookPayload = {
      title: bookTitle.trim(),
      author: bookAuthor.trim(),
      category: bookCategory.trim(),
      price,
      stock,
    }

    try {
      await sales.createBook(payload)
      setBookTitle(emptyBookForm.title)
      setBookAuthor(emptyBookForm.author)
      setBookCategory(emptyBookForm.category)
      setBookPrice(emptyBookForm.price)
      setBookStock(emptyBookForm.stock)
      setBookSubmitError('')
      setIsBookModalOpen(false)
      setCreateSuccessMessage('Book created successfully.')
      setIsCreateSuccessModalOpen(true)
    } catch (error) {
      setBookSubmitError(error instanceof Error ? error.message : 'Failed to create book.')
    }
  }

  const closeSaleDetail = () => {
    setSaleSuccessMessage('')
    sales.closeSaleDetail()
  }

  const closeCreateSuccessModal = () => {
    setCreateSuccessMessage('')
    setIsCreateSuccessModalOpen(false)
  }

  const requestRemoveItemConfirmation = (bookId: number) => {
    setRemoveItemTargetBookId(bookId)
  }

  const cancelRemoveItemConfirmation = () => {
    setRemoveItemTargetBookId(null)
  }

  const confirmRemoveItem = () => {
    if (removeItemTargetBookId === null) {
      return
    }

    sales.removeItem(removeItemTargetBookId)
    setRemoveItemTargetBookId(null)
  }

  return {
    ...sales,
    books: paginatedBooks,
    booksPage,
    totalBooksPages,
    booksPageNumbers,
    isClientModalOpen,
    clientForm,
    clientSearch,
    bookSearch,
    clientSubmitError,
    bookSubmitError,
    saleSuccessMessage,
    createSuccessMessage,
    isClientResultsOpen,
    isBookResultsOpen,
    isBookModalOpen,
    isCreateSuccessModalOpen,
    removeItemTargetBookId,
    filteredClients,
    filteredBooks,
    filterCategory,
    setFilterCategory,
    filterMinPrice,
    setFilterMinPrice,
    filterMaxPrice,
    setFilterMaxPrice,
    filterError,
    activeFiltersCount,
    availableCategories,
    applyBookFilters,
    clearBookFilters,
    updateClientForm,
    setBookTitle,
    setBookAuthor,
    setBookCategory,
    setBookPrice,
    setBookStock,
    setBooksPage,
    bookTitle,
    bookAuthor,
    bookCategory,
    bookPrice,
    bookStock,
    handleClientSearchChange,
    handleBookSearchChange,
    selectClient,
    selectBook,
    completeSale,
    exportLastSaleBill,
    openClientModal,
    openBookModal,
    closeClientModal,
    closeBookModal,
    closeCreateSuccessModal,
    requestRemoveItemConfirmation,
    cancelRemoveItemConfirmation,
    confirmRemoveItem,
    submitClient,
    submitBook,
    closeSaleDetail,
  }
}
