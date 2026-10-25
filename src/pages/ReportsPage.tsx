/** ReportsPage: filtra y presenta reportes de ventas. Historia: HU-06. Props: ninguna; obtiene filtros y resultados desde useReportsPage. */
import { Eye, FileDown } from 'lucide-react'
import { Modal } from '@/components/Modal.tsx'
import { SectionHeader } from '@/components/SectionHeader.tsx'
import { formatCurrency, formatDateTime } from '@/utils/format.ts'
import { getSaleNumber } from '@/utils/sale.ts'
import { useReportsPage } from '@/hooks/reports/useReportsPage.ts'

export const ReportsPage = () => {
  const {
    tabs,
    filters,
    setFilters,
    result,
    paginatedSales,
    currentPage,
    totalPages,
    pageNumbers,
    setCurrentPage,
    isLoading,
    error,
    clientsError,
    booksError,
    currentUser,
    clients,
    books,
    users,
    usersError,
    selectedSale,
    setSelectedSale,
    totalAmount,
    exportPdf,
    exportSaleBill,
  } = useReportsPage()
  const periodLabels: Record<(typeof tabs)[number], string> = {
    daily: 'Diario',
    monthly: 'Mensual',
    yearly: 'Anual',
  }

  return (
    <div>
      <SectionHeader
        title="Reportes"
        description="Ventas diarias, mensuales y anuales con filtros y exportación."
        actions={
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={exportPdf}>
            Exportar a PDF
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              filters.period === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
            onClick={() => setFilters((current) => ({ ...current, period: tab }))}
          >
            {periodLabels[tab]}
          </button>
        ))}
      </div>

      <div className={`mb-5 grid gap-3 md:grid-cols-2 ${currentUser?.role === 'ADMIN' ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
        <label className="min-w-0 grid gap-1 text-sm text-slate-700">
          Fecha
          <input
            type="date"
            className="rounded-xl border border-slate-200 px-3 py-2"
            value={filters.date ?? ''}
            onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))}
          />
        </label>

        <label className="min-w-0 grid gap-1 text-sm text-slate-700">
          Cliente
          <select
            className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2"
            value={filters.idClient ?? ''}
            onChange={(event) => setFilters((current) => ({ ...current, idClient: event.target.value }))}
          >
            <option value="">Todos los clientes</option>
            {clients.map((client) => (
              <option key={client.idClient} value={client.idClient}>
                {client.name}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0 grid gap-1 text-sm text-slate-700">
          Libro
          <select
            className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2"
            value={filters.idBook ?? ''}
            onChange={(event) => setFilters((current) => ({ ...current, idBook: event.target.value }))}
          >
            <option value="">Todos los libros</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </label>

        {currentUser?.role === 'ADMIN' ? (
          <label className="min-w-0 grid gap-1 text-sm text-slate-700">
            Usuario
            <select
              className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2"
              value={filters.idUser ?? ''}
              onChange={(event) => setFilters((current) => ({ ...current, idUser: event.target.value }))}
            >
              <option value="">Todos los usuarios</option>
              {users.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.email})
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {error ? <p className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">{error}</p> : null}
      {clientsError ? <p className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">{clientsError}</p> : null}
      {booksError ? <p className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">{booksError}</p> : null}
      {currentUser?.role === 'ADMIN' && usersError ? (
        <p className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">{usersError}</p>
      ) : null}

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Reporte de ventas</h2>
            <p className="text-sm text-slate-500">Revise las ventas generadas y exporte sus comprobantes.</p>
          </div>
        </div>

        {isLoading ? <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">Cargando reporte...</p> : null}

        {!isLoading && result.sales.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
            No se encontraron ventas con los filtros seleccionados.
          </p>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[100px_1.3fr_1fr_120px_180px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
            <span>Venta</span>
            <span>Fecha</span>
            <span>Cliente</span>
            <span>Total</span>
            <span>Acciones</span>
          </div>

          <div className="divide-y divide-slate-200">
            {paginatedSales.map((sale) => (
              <article key={sale.idSale} className="grid gap-4 px-4 py-4 md:grid-cols-[100px_1.3fr_1fr_120px_180px] md:items-start md:gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Venta</p>
                  <p className="font-semibold text-slate-900">                  #{sale.idSale}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Fecha</p>
                                    <p className="text-sm text-slate-700">{formatDateTime(sale.date)}</p>
                                    <p className="text-xs text-slate-500">Usuario: {sale.user?.name ?? sale.idUser ?? 'N/D'}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Cliente</p>
                                    <p className="text-sm font-medium text-slate-900">{sale.client?.name ?? `Cliente #${sale.idClient}`}</p>
                                    <p className="text-xs text-slate-500">{sale.client?.email || 'Sin correo'}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Total</p>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {formatCurrency(sale.total)}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Acciones</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      aria-label="Ver detalle de la venta"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700"
                      onClick={() => setSelectedSale(sale)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Exportar comprobante"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white"
                      onClick={() => exportSaleBill(sale)}
                    >
                      <FileDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {!isLoading && result.sales.length > 0 && totalPages > 1 ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p>
              Mostrando {paginatedSales.length} ventas en la página {currentPage} de {totalPages} ({result.sales.length} en total)
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage <= 1}
              >
                Anterior
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`h-9 min-w-9 rounded-lg px-3 text-sm ${
                    currentPage === page ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="rounded-lg bg-slate-900 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage >= totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
            <p className="text-sm text-slate-500">Totales de ventas agrupados por el período seleccionado.</p>
          </div>
          <p className="text-sm font-semibold text-slate-900">Total general: {formatCurrency(totalAmount)}</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {!isLoading && result.summary.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">No hay datos de resumen para los filtros seleccionados.</p>
          ) : null}
          {result.summary.map((row) => (
            <div key={row.period} className="rounded-xl bg-slate-50 p-3">
              <p className="font-medium text-slate-900">{row.period}</p>
              <p className="mt-1 text-sm text-slate-600">              Ventas: {row.salesCount}</p>
                            <p className="text-sm text-slate-600">Total: {formatCurrency(Number(row.totalAmount))}</p>
            </div>
          ))}
        </div>
      </section>

      <Modal title="Detalle de la venta" size="lg" isOpen={Boolean(selectedSale)} onClose={() => setSelectedSale(null)}>
        {selectedSale ? (
          <div>
            <p className="text-sm text-slate-600">Venta #{selectedSale.idSale}</p>
            <p className="text-sm text-slate-600">Número de venta: {getSaleNumber(selectedSale)}</p>
            <p className="text-sm text-slate-600">Fecha: {formatDateTime(selectedSale.date)}</p>
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
                  {selectedSale.items.map((item) => (
                    <tr key={item.idDetail} className="border-t border-slate-200">
                                          <td className="px-3 py-2">{item.bookTitle}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                                          <td className="px-3 py-2">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
