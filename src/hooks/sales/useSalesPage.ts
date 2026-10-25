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

/** useSalesPage: coordina búsqueda, formularios auxiliares y presentación del flujo POS. HU-05. */
export const useSalesPage = () => {
  const sales = useSalesPOS()
  const booksPageSize = 12
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [clientForm, setClientForm] = useState<ClientFormState>(emptyClientForm)
  const [clientSearch, setClientSearch] = useState('')
  const [isClientResultsOpen, setIsClientResultsOpen] = useState(false)
  const [clientSubmitError, setClientSubmitError] = useState('')
  const [bookSearch, setBookSearch] = useState('')
  const [isBookResultsOpen, setIsBookResultsOpen] = useState(false)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [bookSubmitError, setBookSubmitError] = useState('')
  const [bookTitle, setBookTitle] = useState(emptyBookForm.title)
  const [bookAuthor, setBookAuthor] = useState(emptyBookForm.author)
  const [bookCategory, setBookCategory] = useState(emptyBookForm.category)
  const [bookPrice, setBookPrice] = useState(emptyBookForm.price)
  const [bookStock, setBookStock] = useState(emptyBookForm.stock)
  const [booksPage, setBooksPage] = useState(1)
  const [saleSuccessMessage, setSaleSuccessMessage] = useState('')
  const [createSuccessMessage, setCreateSuccessMessage] = useState('')
  const [isCreateSuccessModalOpen, setIsCreateSuccessModalOpen] = useState(false)
  const [removeItemTargetBookId, setRemoveItemTargetBookId] = useState<number | null>(null)

  // Estados para filtro por categoría y precio en Sales
  const [filterCategory, setFilterCategory] = useState('')
  const [filterMinPrice, setFilterMinPrice] = useState('')
  const [filterMaxPrice, setFilterMaxPrice] = useState('')
  const [filterError, setFilterError] = useState('')
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const availableCategories = useMemo(() => {
    const set = new Set<string>()
    sales.books.forEach((b) => {
      if (b.category?.trim()) {
        set.add(b.category.trim())
      }
    })
    return Array.from(set).sort()
  }, [sales.books])

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

  const exportLastSaleBill = () => {
    if (!sales.lastSale) {
      return
    }

    exportSaleBillPdf(sales.lastSale)
  }

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
