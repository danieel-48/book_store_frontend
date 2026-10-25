/** UsersPage: permite al administrador crear, editar y eliminar usuarios. Historia: HU-07. Props: ninguna; delega estado y operaciones a useUsersPage. */
import { Trash2 } from 'lucide-react'
import { Modal } from '@/components/Modal.tsx'
import { SectionHeader } from '@/components/SectionHeader.tsx'
import { useUsersPage } from '@/hooks/users/useUsersPage.ts'

export const UsersPage = () => {
  const {
    currentUser,
    users,
    isModalOpen,
    deleteTargetUserId,
    form,
    submitError,
    openModal,
    closeModal,
    updateForm,
    submit,
    requestDeleteConfirmation,
    cancelDeleteConfirmation,
    confirmDelete,
  } =
    useUsersPage()

  if (currentUser?.role !== 'ADMIN') {
    return <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">Solo los usuarios ADMIN pueden administrar usuarios del sistema.</p>
  }

  return (
    <div>
      <SectionHeader
        title="Usuarios"
        description="Administre el acceso del personal y sus roles."
        actions={
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={openModal}>
            Nuevo usuario
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {users.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 p-4 shadow-sm">
            <h2 className="font-semibold text-slate-900">{item.name}</h2>
            <p className="text-sm text-slate-500">{item.email}</p>
            <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs">
              {item.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
            </p>
            <button
              type="button"
              aria-label="Eliminar usuario"
              className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 bg-white text-slate-600 transition hover:bg-rose-50"
              onClick={() => requestDeleteConfirmation(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>

      <Modal title="Confirmar eliminación" isOpen={deleteTargetUserId !== null} onClose={cancelDeleteConfirmation}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">¿Está seguro de que desea eliminar este usuario?</p>
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

      <Modal title="Crear usuario" isOpen={isModalOpen} onClose={closeModal}>
        <form className="grid gap-3" onSubmit={submit}>
          <label className="grid gap-1 text-sm text-slate-700">
            Nombre
            <input
              className="rounded-xl border border-slate-200 px-4 py-2"
              value={form.name}
              onChange={(event) => updateForm('name', event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-700">
            Correo electrónico
            <input
              className="rounded-xl border border-slate-200 px-4 py-2"
              value={form.email}
              onChange={(event) => updateForm('email', event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-700">
            Contraseña
            <input
              className="rounded-xl border border-slate-200 px-4 py-2"
              type="password"
              value={form.password ?? ''}
              onChange={(event) => updateForm('password', event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-700">
            Rol
            <select
              className="rounded-xl border border-slate-200 px-4 py-2"
              value={form.role}
              onChange={(event) => updateForm('role', event.target.value)}
            >
              <option value="EMPLOYEE">Empleado</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>
          {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white">Guardar</button>
        </form>
      </Modal>
    </div>
  )
}
