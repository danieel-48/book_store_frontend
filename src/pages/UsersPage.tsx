/** UsersPage: permite al administrador registrar usuarios y consultarlos por correo, y a los usuarios consultar y editar su información de perfil. */
import { UserCheck } from 'lucide-react'
import { Modal } from '@/components/Modal.tsx'
import { SectionHeader } from '@/components/SectionHeader.tsx'
import { useUsersPage } from '@/hooks/users/useUsersPage.ts'

export const UsersPage = () => {
  const {
    currentUser,
    users,
    usersError,
    isModalOpen,
    editingUserId,
    form,
    submitError,
    searchEmail,
    setSearchEmail,
    searchError,
    search,
    openModal,
    openEditModal,
    closeModal,
    updateForm,
    submit,
    loggedUserProfile,
    isLoadingProfile,
    profileError,
    loadLoggedUserProfile,
    closeProfileView,
  } = useUsersPage()

  const isAdmin = currentUser?.role === 'ADMIN'

  return (
    <div>
      <SectionHeader
        title="Usuarios"
        description={
          isAdmin
            ? 'Registre personal, consulte usuarios por correo y gestione su información.'
            : 'Consulte y gestione la información de su usuario.'
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              onClick={() => void loadLoggedUserProfile()}
              disabled={isLoadingProfile}
            >
              <UserCheck className="h-4 w-4 text-slate-500" />
              {isLoadingProfile ? 'Consultando perfil...' : 'Ver información del usuario logeado'}
            </button>
            {isAdmin ? (
              <button
                type="button"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                onClick={openModal}
              >
                Nuevo usuario
              </button>
            ) : null}
          </div>
        }
      />

      {profileError ? (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <span>{profileError}</span>
          <button
            type="button"
            onClick={() => void loadLoggedUserProfile()}
            className="font-semibold underline hover:text-rose-800"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {loggedUserProfile ? (
        <section className="mb-6 rounded-2xl border-2 border-slate-900 bg-slate-50 p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                  Usuario logeado
                </span>
                <h2 className="text-lg font-bold text-slate-900">{loggedUserProfile.name}</h2>
              </div>
              <p className="mt-1 text-sm text-slate-600">{loggedUserProfile.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                  {loggedUserProfile.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
                </span>
                <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                  {loggedUserProfile.active ? 'Activo' : 'Inactivo'}
                </span>
                <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                  ID: #{loggedUserProfile.id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                onClick={() => openEditModal(loggedUserProfile)}
              >
                Editar
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-100"
                onClick={closeProfileView}
              >
                Ocultar
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {!isAdmin ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Nota: Solo los administradores pueden registrar y consultar el listado completo de usuarios.
        </p>
      ) : (
        <>
          <form className="mb-5 flex flex-wrap items-center gap-2" onSubmit={(event) => void search(event)}>
            <input
              className="min-w-[260px] rounded-xl border border-slate-200 px-4 py-2 text-sm"
              placeholder="Buscar usuario por correo"
              value={searchEmail}
              onChange={(event) => setSearchEmail(event.target.value)}
            />
            <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200 transition">
              Buscar
            </button>
            {searchError ? <span className="text-sm text-rose-600">{searchError}</span> : null}
          </form>
          {usersError ? <p className="mb-4 text-sm text-rose-600">{usersError}</p> : null}

          <div className="grid gap-4 md:grid-cols-2">
            {users.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 p-4 shadow-sm">
                <h2 className="font-semibold text-slate-900">{item.name}</h2>
                <p className="text-sm text-slate-500">{item.email}</p>
                <div className="mt-2 flex gap-2">
                  <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs">
                    {item.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
                  </p>
                  <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs">
                    {item.active ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 transition"
                  onClick={() => openEditModal(item)}
                >
                  Editar
                </button>
              </article>
            ))}
          </div>
        </>
      )}

      <Modal title={editingUserId === null ? 'Crear usuario' : 'Editar usuario'} isOpen={isModalOpen} onClose={closeModal}>
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
            Contraseña{editingUserId === null ? '' : ' (opcional)'}
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
