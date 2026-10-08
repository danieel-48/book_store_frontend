/** ClientFormModal: captura los datos de creación o edición de un cliente. Historia: HU-04. Props: ClientFormModalProps (estado, callbacks, errores y etiquetas del formulario). */
import { Modal } from '../../../shared/components/Modal'
import type { ClientPayload } from '../types/client'

type ClientFormModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  form: ClientPayload
  onFieldChange: (field: keyof ClientPayload, value: string) => void
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
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className="grid gap-1 text-sm text-slate-700">
          Name
          <input
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={form.name}
            onChange={(event) => onFieldChange('name', event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-700">
          Email
          <input
            type="email"
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={form.email ?? ''}
            onChange={(event) => onFieldChange('email', event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-700">
          Phone
          <input
            inputMode="numeric"
            maxLength={10}
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={form.phone ?? ''}
            onChange={(event) => onFieldChange('phone', event.target.value)}
          />
        </label>
        {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-white">{submitLabel}</button>
      </form>
    </Modal>
  )
}