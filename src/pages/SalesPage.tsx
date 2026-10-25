// SalesPage: gestiona el punto de venta POS, filtros de libros, carrito y facturación · HU-06 ventas POS
// Props: ninguna (página conectada a AppRouter)
import { CircleCheck, FileDown, Filter, Trash2 } from 'lucide-react'
import { BookFormModal } from '@/components/books/BookFormModal.tsx'
import { ClientFormModal } from '@/components/clients/ClientFormModal.tsx'
import { MessageModal } from '@/components/MessageModal.tsx'
import { Modal } from '@/components/Modal.tsx'
import { CartQuantityInput } from '@/components/CartQuantityInput.tsx'
import { SectionHeader } from '@/components/SectionHeader.tsx'
import { formatCurrency, formatDateTime } from '@/utils/format.ts'
import { getSaleNumber } from '@/utils/sale.ts'
import { useSalesPage } from '@/hooks/sales/useSalesPage.ts'

export const SalesPage = () => {
  // Hook que coordina la lógica de venta POS, carrito, clientes y filtros en la API (HU-06)
  const {
    books,
    booksPage,
    totalBooksPages,
    booksPageNumbers,
    isBooksLoading,
    booksError,
    reloadBooks,
    filteredBooks,
    filteredClients,
    cart,
    clientId,
    subtotal,
    lastSale,
    isSubmitting,
    saleError,
    addBook,
    updateQuantity,
    setClientId,
    completeSale,
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
  } = useSalesPage()

  const isUnauthenticatedBooksError = booksError.toLowerCase().includes('unauthenticated')

  return (
    <div>
      <SectionHeader title="Ventas POS" description="Cobro rápido con validación de existencias en tiempo real y totales del carrito." />

      {/* Bloque superior para selección de cliente y búsqueda rápida de libros */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <label className="relative min-w-[260px] flex-1 grid gap-1 text-sm text-slate-700">
            Buscar cliente
            <input
              className="rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Escriba el ID o el nombre del cliente"
              value={clientSearch}
              onChange={(event) => handleClientSearchChange(event.target.value)}
            />
            {clientSearch.trim() && isClientResultsOpen ? (
              <div className="absolute top-[calc(100%+4px)] z-20 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <button
                      key={client.idClient}
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => selectClient(client.idClient, client.name)}
                    >
                      <span className="font-medium text-slate-900">{client.name}</span>
                      <span className="ml-2 text-slate-500">#{client.idClient}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-slate-500">No se encontraron clientes</p>
                )}
              </div>
            ) : null}
          </label>

          <label className="min-w-[220px] grid gap-1 text-sm text-slate-700">
            Cliente seleccionado
            <select
              className="rounded-xl border border-slate-200 px-3 py-2"
              value={clientId ?? ''}
              onChange={(event) =>
                setClientId(event.target.value ? Number(event.target.value) : null)
              }
            >
              <option value="">Seleccione un cliente</option>
              {filteredClients.map((client) => (
                <option key={client.idClient} value={client.idClient}>
                  {client.idClient} - {client.name}
                </option>
              ))}
            </select>
          </label>

          {/* onClick abre modal para registrar cliente sin salir del POS */}
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={openClientModal}>
            Nuevo cliente
          </button>

          <label className="relative min-w-[260px] flex-1 grid gap-1 text-sm text-slate-700">
            Buscar libro
            <input
              className="rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Escriba el ID o el título del libro"
              value={bookSearch}
              onChange={(event) => handleBookSearchChange(event.target.value)}
            />
            {bookSearch.trim() && isBookResultsOpen ? (
              <div className="absolute top-[calc(100%+4px)] z-20 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => selectBook(book.id)}
                    >
                      <span className="font-medium text-slate-900">{book.title}</span>
                      <span className="ml-2 text-slate-500">#{book.id}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-slate-500">No se encontraron libros</p>
                )}
              </div>
            ) : null}
          </label>

          {/* onClick abre modal para crear un libro directamente */}
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={openBookModal}>
            Nuevo libro
          </button>
        </div>
      </section>

      {/* Apartado para filtrar libros por categoría y precio en la API (HU-06) */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-800">Filtrar libros por categoría y precio</h2>
            {activeFiltersCount > 0 ? (
              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                {activeFiltersCount} activo{activeFiltersCount > 1 ? 's' : ''}
              </span>
            ) : null}
          </div>
          {activeFiltersCount > 0 ? (
            /* onClick restablece los filtros y consulta el catálogo sin parámetros en la API */
            <button
              type="button"
              onClick={() => void clearBookFilters()}
              className="text-xs font-medium text-slate-500 underline transition hover:text-slate-800"
            >
              Restablecer filtros
            </button>
          ) : null}
        </div>

        {/* onSubmit ejecuta la consulta GET /api/books?category=&minPrice=&maxPrice= */}
        <form onSubmit={(e) => void applyBookFilters(e)} className="flex flex-wrap items-end gap-3">
          <label className="min-w-[240px] flex-[2] grid gap-1 text-sm font-medium text-slate-700">
            Categoría
            <input
              type="text"
              list="sales-categories-list"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              placeholder="Ej: Fantasia"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            />
            <datalist id="sales-categories-list">
              {availableCategories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </label>

          <label className="min-w-[150px] flex-1 grid gap-1 text-sm font-medium text-slate-700">
            Precio mínimo
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              placeholder="Ej: 10"
              value={filterMinPrice}
              onChange={(e) => setFilterMinPrice(e.target.value)}
            />
          </label>

          <label className="min-w-[150px] flex-1 grid gap-1 text-sm font-medium text-slate-700">
            Precio máximo
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              placeholder="Ej: 50"
              value={filterMaxPrice}
              onChange={(e) => setFilterMaxPrice(e.target.value)}
            />
          </label>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Filtrar
            </button>
            <button
              type="button"
              onClick={() => void clearBookFilters()}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Limpiar
            </button>
          </div>
        </form>

        {filterError ? <p className="mt-2 text-xs font-medium text-rose-600">{filterError}</p> : null}
      </section>

      {/* Cuadrícula de libros a la venta y carrito de compras */}
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section>
          {isBooksLoading ? <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">Cargando libros...</p> : null}
          {!isBooksLoading && booksError && !isUnauthenticatedBooksError ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
              <p>{booksError}</p>
              <button className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700" onClick={() => void reloadBooks()}>
                Reintentar
              </button>
            </div>
          ) : null}
          {!isBooksLoading && !booksError && books.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">Todavía no hay libros disponibles.</p>
          ) : null}
          {!isBooksLoading && !booksError && books.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => (
                <article key={book.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h2 className="font-semibold text-slate-900">{book.title}</h2>
                  <p className="text-sm text-slate-500">{book.author}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">{book.category}</p>
                  <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{formatCurrency(book.price)}</p>
                      <p className="text-sm text-slate-600">Existencia {book.stock}</p>
                    </div>
                    {/* onClick agrega el libro al carrito validando stock disponible */}
                    <button
                      onClick={() => addBook(book.id)}
                      disabled={book.stock === 0}
                      className="mt-4 w-full rounded-xl bg-slate-900 px-3 py-2 text-white disabled:bg-slate-300"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {/* Paginación de libros en POS */}
          {!isBooksLoading && !booksError && totalBooksPages > 1 ? (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <p>
                Página {booksPage} de {totalBooksPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setBooksPage((page) => Math.max(1, page - 1))}
                  disabled={booksPage <= 1}
                >
                  Anterior
                </button>
                {booksPageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`h-9 min-w-9 rounded-lg px-3 text-sm ${
                      booksPage === page ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                    onClick={() => setBooksPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setBooksPage((page) => Math.min(totalBooksPages, page + 1))}
                  disabled={booksPage >= totalBooksPages}
                >
                  Siguiente
                </button>
              </div>
            </div>
          ) : null}

          {/* Botón para procesar la venta en la API (POST /api/sales y /api/sale-details) */}
          <button
            onClick={() => void completeSale()}
            disabled={isSubmitting || cart.length === 0 || !clientId}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-white px-6 py-4 text-lg font-semibold text-slate-900 shadow-sm transition hover:bg-emerald-50 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400">
              <CircleCheck className="h-4 w-4 text-slate-700" />
            </span>
            {isSubmitting ? 'Procesando...' : 'Completar venta'}
          </button>
          {saleError ? <p className="mt-3 text-sm text-slate-600">{saleError}</p> : null}
        </section>

        {/* Panel lateral del carrito de compras */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Carrito de compras</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.book.id} className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="min-w-0 pr-3">
                  <p className="truncate text-sm font-medium text-slate-900">{item.book.title}</p>
                  <p className="text-xs text-slate-500">{formatCurrency(item.book.price)} c/u</p>
                </div>
                <div className="flex items-center gap-2">
                  <CartQuantityInput
                    quantity={item.quantity}
                    stock={item.book.stock}
                    onChange={(next) => updateQuantity(item.book.id, next)}
                  />
                  {/* onClick solicita confirmación para remover el libro del carrito */}
                  <button
                    onClick={() => requestRemoveItemConfirmation(item.book.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label={`Eliminar ${item.book.title} del carrito`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1 text-right text-sm">
            <p className="text-slate-500">Subtotal: {formatCurrency(subtotal)}</p>
            <p className="text-slate-500">IVA (19%): {formatCurrency(subtotal * 0.19)}</p>
            <p className="text-lg font-bold text-slate-900">Total: {formatCurrency(subtotal * 1.19)}</p>
          </div>
        </aside>
      </div>

      {/* Modal para crear cliente ágilmente */}
      <ClientFormModal
        title="Crear cliente"
        isOpen={isClientModalOpen}
        onClose={closeClientModal}
        form={clientForm}
        onFieldChange={updateClientForm}
        onSubmit={submitClient}
        submitError={clientSubmitError}
        submitLabel="Guardar"
      />

      {/* Modal para crear nuevo libro */}
      <BookFormModal
        title="Crear libro"
        isOpen={isBookModalOpen}
        onClose={closeBookModal}
        form={{
          title: bookTitle,
          author: bookAuthor,
          category: bookCategory,
          price: bookPrice,
          stock: bookStock,
        }}
        onTextChange={(field, value) => {
          if (field === 'title') setBookTitle(value)
          if (field === 'author') setBookAuthor(value)
          if (field === 'category') setBookCategory(value)
        }}
        onNumberChange={(field, value) => {
          if (field === 'price') setBookPrice(value)
          if (field === 'stock') setBookStock(value)
        }}
        onSubmit={submitBook}
        submitError={bookSubmitError}
        submitLabel="Guardar"
      />

      <MessageModal
        title="Creación exitosa"
        message={createSuccessMessage}
        isOpen={isCreateSuccessModalOpen}
        onClose={closeCreateSuccessModal}
      />

      {/* Modal de confirmación para eliminar libro del carrito */}
      <Modal
        title="Confirmar eliminación de libro"
        isOpen={removeItemTargetBookId !== null}
        onClose={cancelRemoveItemConfirmation}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            ¿Está seguro de que desea eliminar este libro del carrito de compras?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700"
              onClick={cancelRemoveItemConfirmation}
            >
              Cancelar
            </button>
            <button className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white" onClick={confirmRemoveItem}>
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de detalle de venta completada con exportación de factura PDF */}
      <Modal title="Detalle de la venta" size="lg" isOpen={Boolean(lastSale)} onClose={closeSaleDetail}>
        {lastSale ? (
          <div>
            {saleSuccessMessage ? <p className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{saleSuccessMessage}</p> : null}
            <div className="mb-2 flex justify-end">
              {/* onClick genera y descarga la factura en formato PDF */}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                onClick={exportLastSaleBill}
              >
                <FileDown className="h-4 w-4" />
                Exportar PDF
              </button>
            </div>
            <p className="text-sm text-slate-600">Venta #{lastSale.idSale}</p>
            <p className="text-sm text-slate-600">Número de venta: {getSaleNumber(lastSale)}</p>
            <p className="text-sm text-slate-600">Fecha: {formatDateTime(lastSale.date)}</p>
            <p className="text-sm text-slate-600">Cliente: {lastSale.client?.name ?? `#${lastSale.idClient}`}</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Libro</th>
                    <th className="px-3 py-2 text-left">Cant.</th>
                    <th className="px-3 py-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lastSale.items.map((item) => (
                    <tr key={item.idDetail} className="border-t border-slate-200">
                      <td className="px-3 py-2">{item.bookTitle}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                      <td className="px-3 py-2">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-right text-lg font-semibold">Total general: {formatCurrency(lastSale.total)}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
