import { useMemo, useState } from 'react'
import { useAuth } from '@/app/useAuth'
import { useBooks } from '@/hooks/books/useBooks.ts'
import { useClients } from '@/hooks/clients/useClients.ts'
import { booksService } from '@/services/booksService.ts'
import { salesService } from '@/services/salesService.ts'
import type { CartItem, Sale } from '@/types/sale.ts'
import { toLocalDateTime } from '@/utils/format.ts'
import { buildSale } from '@/utils/sale.ts'

/** useSalesPOS: administra el carrito, valida existencias y registra ventas. */
export const useSalesPOS = () => {
  const { user } = useAuth()
  const { books, isLoading: isBooksLoading, error: booksError, createBook, reload: reloadBooks } = useBooks()
  const { clients, createClient, reload } = useClients()
  const [cart, setCart] = useState<CartItem[]>([])
  const [clientId, setClientId] = useState<number | null>(null)
  const [lastSale, setLastSale] = useState<Sale | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saleError, setSaleError] = useState('')
  const sellableBooks = useMemo(() => books.filter((book) => book.price > 0 && book.stock > 0), [books])

  // Impide agregar libros sin stock o superar la existencia disponible.
  const addBook = (bookId: number) => {
    const book = sellableBooks.find((item) => item.id === bookId)
    if (!book || book.stock <= 0) return

    setCart((current) => {
      const found = current.find((item) => item.book.id === bookId)
      if (!found) return [...current, { book, quantity: 1 }]
      if (found.quantity >= book.stock) return current

      return current.map((item) =>
        item.book.id === bookId ? { ...item, quantity: item.quantity + 1 } : item,
      )
    })
  }

  const updateQuantity = (bookId: number, quantity: number) => {
    if (!Number.isFinite(quantity)) {
      return
    }

    setCart((current) =>
      current
        .map((item) =>
          item.book.id === bookId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.book.stock)) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (bookId: number) => {
    setCart((current) => current.filter((item) => item.book.id !== bookId))
  }

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0), [cart])

  const completeSale = async (): Promise<boolean> => {
    if (!clientId || cart.length === 0) {
      setSaleError('Seleccione un cliente y agregue artículos antes de completar la venta.')
      return false
    }

    setSaleError('')
    setIsSubmitting(true)

    try {
      // Se consulta el stock actual para no crear una venta que luego falle a mitad.
      const freshBooks = await booksService.list()
      const insufficient = cart.find((item) => {
        const current = freshBooks.find((book) => book.id === item.book.id)
        return !current || item.quantity > current.stock
      })

      if (insufficient) {
        const current = freshBooks.find((book) => book.id === insufficient.book.id)
        setSaleError(
          current
            ? `Stock insuficiente de «${current.title}»: solicitó ${insufficient.quantity} y solo hay ${current.stock} disponibles.`
            : `El libro «${insufficient.book.title}» ya no está disponible.`,
        )
        await reloadBooks()
        return false
      }

      const { sale, details } = await salesService.create(
        { idClient: clientId, idUser: user?.id, date: toLocalDateTime() },
        cart.map((item) => ({ idBook: item.book.id, quantity: item.quantity })),
      )

      setLastSale(buildSale(sale, details, freshBooks, clients, user ? [user] : []))
      setCart([])
      await reload()
      await reloadBooks()
      return true
    } catch (error) {
      setSaleError(error instanceof Error ? error.message : 'No se pudo completar la venta.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    books: sellableBooks,
    isBooksLoading,
    booksError,
    clients,
    cart,
    clientId,
    subtotal,
    lastSale,
    isSubmitting,
    saleError,
    addBook,
    updateQuantity,
    removeItem,
    setClientId,
    completeSale,
    createClient,
    createBook,
    reloadBooks,
    closeSaleDetail: () => setLastSale(null),
  }
}
