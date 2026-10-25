// ClientFormModal: modal con formulario para crear o editar un cliente · HU-04 gestión de clientes
// Props: title (título modal), isOpen (visibilidad), onClose (cierre), form (datos del cliente), onFieldChange (callback cambio), onSubmit (envío formulario), submitError (error validación), submitLabel (texto botón)
import { Modal } from '@/components/Modal.tsx'
import type { ClientFormState } from '@/types/client.ts'

type ClientFormModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  form: ClientFormState
  onFieldChange: (field: keyof ClientFormState, value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  submitError: string
  submitLabel: string
}

export const ClientFormModal = ({
  title,
  isOpen,
  onClose,
  form,
  onFieldChange,
  onSubmit,
  submitError,
  submitLabel,
}: ClientFormModalProps) => {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      {/* onSubmit procesa la validación y envía los datos del cliente a la API (HU-04) */}
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className="grid gap-1 text-sm text-slate-700">
          Nombre
          <input
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={form.name}
            onChange={(event) => onFieldChange('name', event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-700">
          Número de identificación
          <input
            inputMode="numeric"
            maxLength={15}
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={form.idNumber}
            onChange={(event) => onFieldChange('idNumber', event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-700">
          Correo electrónico
          <input
            type="email"
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={form.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-700">
          Teléfono
          <input
            inputMode="numeric"
            maxLength={10}
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={form.phone}
            onChange={(event) => onFieldChange('phone', event.target.value)}
          />
        </label>
        {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
        {/* Botón de envío: guarda o actualiza el cliente en la API según submitLabel */}
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-white">{submitLabel}</button>
      </form>
    </Modal>
  )
}
