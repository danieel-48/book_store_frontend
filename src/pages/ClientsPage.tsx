/** ClientsPage: consulta y administra los clientes registrados. Historia: HU-04. Props: ninguna; obtiene estado y acciones desde useClientsPage. */
import { Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '@/app/useAuth'
import { MessageModal } from '@/components/MessageModal.tsx'
import { Modal } from '@/components/Modal.tsx'
import { SectionHeader } from '@/components/SectionHeader.tsx'
import { ClientFormModal } from '@/components/clients/ClientFormModal.tsx'
import { useClientsPage } from '@/hooks/clients/useClientsPage.ts'

export const ClientsPage = () => {
  const { user } = useAuth()
  const {
    clients,
    clientsCount,
    currentPage,
    totalPages,
    pageNumbers,
    isModalOpen,
    isUpdateConfirmOpen,
    isSuccessModalOpen,
    deleteTargetClientId,
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
    requestDeleteConfirmation,
    confirmDelete,
    cancelDeleteConfirmation,
    closeSuccessModal,
    updateForm,
    setCurrentPage,
    submit,
  } = useClientsPage()
  const canDeleteClients = user?.role === 'ADMIN'

  return (
    <div>
      <SectionHeader
        title="Clientes"
        description="Registros de clientes para agilizar el cobro y los reportes."
        actions={
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={openModal}>
            Nuevo cliente
          </button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo electrónico</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-900">{client.name}</td>
                <td className="px-4 py-3">{client.email}</td>
                <td className="px-4 py-3">{client.phone}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Editar cliente"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-white text-slate-600 transition hover:bg-amber-50"
                      onClick={() => openEditModal(client)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {canDeleteClients ? (
                      <button
                        type="button"
                        aria-label="Eliminar cliente"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-slate-600 transition hover:bg-rose-50"
                        onClick={() => requestDeleteConfirmation(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {canDeleteClients ? (
        <Modal title="Confirmar eliminación" isOpen={deleteTargetClientId !== null} onClose={cancelDeleteConfirmation}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">¿Está seguro de que desea eliminar este cliente?</p>
            <div className="flex justify-end gap-2">
              <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700" onClick={cancelDeleteConfirmation}>
                Cancelar
              </button>
              <button className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white" onClick={() => void confirmDelete()}>
                Eliminar
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      <MessageModal message={successMessage} isOpen={isSuccessModalOpen} onClose={closeSuccessModal} />
    </div>
  )
}
