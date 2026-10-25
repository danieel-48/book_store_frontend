// BooksPage: consulta, filtra y administra el catálogo de libros · HU-05 inventario de libros
// Props: ninguna (página conectada a AppRouter)
import { Pencil } from 'lucide-react'
import { MessageModal } from '@/components/MessageModal.tsx'
import { Modal } from '@/components/Modal.tsx'
import { SectionHeader } from '@/components/SectionHeader.tsx'
import { formatCurrency } from '@/utils/format.ts'
import { BookFormModal } from '@/components/books/BookFormModal.tsx'
import { useBooksPage } from '@/hooks/books/useBooksPage.ts'

export const BooksPage = () => {
  // Hook que coordina carga, búsqueda, paginación y mutaciones en la API (HU-05)
  const {
    books,
    searchQuery,
    filteredBooksCount,
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
  } = useBooksPage()

  return (
    <div>
      <SectionHeader
        title="Inventario"
        description="Administre libros, niveles de existencia y precios."
        actions={
          /* onClick abre el modal para registrar un nuevo libro (HU-05) */
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={openModal}>
            Nuevo libro
          </button>
        }
      />

      {/* Campo de búsqueda rápida por identificador o título */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="grid gap-1 text-sm text-slate-700">
          Buscar por ID o título
          <input
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Ejemplo: 12 o Don Quijote"
          />
        </label>
      </div>

      {/* Tabla con listado del catálogo de libros */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.7fr_1fr_1fr_120px_120px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
          <span>Libro</span>
          <span>Categoría</span>
          <span>Precio</span>
          <span>Existencia</span>
          <span>Acciones</span>
        </div>
        <div className="divide-y divide-slate-200">
          {books.map((book) => (
            <article key={book.id} className="grid gap-4 px-4 py-4 md:grid-cols-[1.7fr_1fr_1fr_120px_120px] md:items-center md:gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Libro</p>
                <p className="font-semibold text-slate-900">{book.title}</p>
                <p className="text-sm text-slate-500">{book.author}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Categoría</p>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs">{book.category}</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Precio</p>
                <p className="font-semibold text-slate-900">{formatCurrency(book.price)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Existencia</p>
                <p className="text-sm text-slate-600">{book.stock}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Acciones</p>
                <div className="flex gap-2">
                  {/* onClick abre el formulario modal cargando los datos del libro para editarlo */}
                  <button
                    type="button"
                    aria-label="Editar libro"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200 bg-white text-slate-600 transition hover:bg-amber-50"
                    onClick={() => openEditModal(book)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Controles de paginación de libros */}
      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          Mostrando {books.length} de {filteredBooksCount} libros (página {currentPage} de {totalPages})
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage <= 1}
          >
            Anterior
          </button>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal con formulario para registrar o actualizar un libro (HU-05) */}
      <BookFormModal
        title={editingBookId === null ? 'Crear libro' : 'Actualizar libro'}
        isOpen={isModalOpen}
        onClose={closeModal}
        form={form}
        onTextChange={updateTextForm}
        onNumberChange={updateNumberForm}
        onSubmit={editingBookId === null ? submit : requestUpdateConfirmation}
        submitError={submitError}
        submitLabel={editingBookId === null ? 'Guardar' : 'Actualizar'}
      />

      {/* Modal de confirmación para actualizar libro */}
      <Modal title="Confirmar actualización" isOpen={isUpdateConfirmOpen} onClose={cancelUpdateConfirmation}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">¿Está seguro de que desea actualizar este libro?</p>
          <div className="flex justify-end gap-2">
            <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700" onClick={cancelUpdateConfirmation}>
              Cancelar
            </button>
            <button className="rounded-lg bg-amber-600 px-3 py-2 text-sm text-white" onClick={() => void confirmUpdate()}>
              Confirmar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal emergente que informa éxito de la operación */}
      <MessageModal message={successMessage} isOpen={isSuccessModalOpen} onClose={closeSuccessModal} />
    </div>
  )
}
