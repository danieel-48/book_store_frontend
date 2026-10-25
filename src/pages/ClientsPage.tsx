// ClientsPage: consulta, registra y administra los clientes del sistema · HU-04 gestión de clientes
// Props: ninguna (página conectada a AppRouter)
import { Pencil } from 'lucide-react'
import { MessageModal } from '@/components/MessageModal.tsx'
import { Modal } from '@/components/Modal.tsx'
import { SectionHeader } from '@/components/SectionHeader.tsx'
import { ClientFormModal } from '@/components/clients/ClientFormModal.tsx'
import { useClientsPage } from '@/hooks/clients/useClientsPage.ts'

export const ClientsPage = () => {
  // Hook que administra la lista de clientes, formulario modal y mutaciones en la API (HU-04)
  const {
    clients,
    clientsCount,
    currentPage,
    totalPages,
    pageNumbers,
    isModalOpen,
    isUpdateConfirmOpen,
    isSuccessModalOpen,
    editingClientId,
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
    updateForm,
    setCurrentPage,
    submit,
  } = useClientsPage()

  return (
    <div>
      <SectionHeader
        title="Clientes"
        description="Registros de clientes para agilizar el cobro y los reportes."
        actions={
          /* onClick abre el formulario modal para registrar un nuevo cliente con datos obligatorios (HU-04) */
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={openModal}>
            Nuevo cliente
          </button>
        }
      />

      {/* Tabla con el listado de clientes registrados */}
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Identificación</th>
              <th className="px-4 py-3">Correo electrónico</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.idClient} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-900">{client.name}</td>
                <td className="px-4 py-3">{client.idNumber}</td>
                <td className="px-4 py-3">{client.email}</td>
                <td className="px-4 py-3">{client.phone}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {/* onClick abre el modal cargando la información del cliente para editarlo */}
                    <button
                      type="button"
                      aria-label="Editar cliente"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-white text-slate-600 transition hover:bg-amber-50"
                      onClick={() => openEditModal(client)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación de clientes */}
      {totalPages > 1 ? (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            Mostrando {clients.length} clientes en la página {currentPage} de {totalPages} ({clientsCount} en total)
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

      {/* Modal con formulario para capturar o editar datos del cliente (HU-04) */}
      <ClientFormModal
        title={editingClientId === null ? 'Crear cliente' : 'Actualizar cliente'}
        isOpen={isModalOpen}
        onClose={closeModal}
        form={form}
        onFieldChange={updateForm}
        onSubmit={editingClientId === null ? submit : requestUpdateConfirmation}
        submitError={submitError}
        submitLabel={editingClientId === null ? 'Guardar' : 'Actualizar'}
      />

      {/* Modal de confirmación previo a actualizar datos de un cliente */}
      <Modal title="Confirmar actualización" isOpen={isUpdateConfirmOpen} onClose={cancelUpdateConfirmation}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">¿Está seguro de que desea actualizar este cliente?</p>
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

      {/* Modal emergente que informa el resultado exitoso */}
      <MessageModal message={successMessage} isOpen={isSuccessModalOpen} onClose={closeSuccessModal} />
    </div>
  )
}
