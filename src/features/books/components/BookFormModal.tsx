/** BookFormModal: captura los datos de creación o edición de un libro. Historia: HU-03. Props: BookFormModalProps (estado, callbacks, errores y etiquetas del formulario). */
import { Modal } from '../../../shared/components/Modal'

type BookFormState = {
  title: string
  author: string
  category: string
  price: string
  stock: string
}

type BookFormModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  form: BookFormState
  onTextChange: (field: 'title' | 'author' | 'category', value: string) => void
  onNumberChange: (field: 'price' | 'stock', value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  submitError: string
  submitLabel: string
}

export const BookFormModal = ({
  title,
  isOpen,
  onClose,
  form,
  onTextChange,
  onNumberChange,
  onSubmit,
  submitError,
  submitLabel,
}: BookFormModalProps) => {
  return (
    <Modal title={title} size="sm" isOpen={isOpen} onClose={onClose}>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className="grid gap-1 text-sm text-slate-700">
          Título
          <input
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={form.title}
            onChange={(event) => onTextChange('title', event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-700">
          Autor
          <input
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={form.author}
            onChange={(event) => onTextChange('author', event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-700">
          Categoría
          <input
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={form.category}
            onChange={(event) => onTextChange('category', event.target.value)}
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="min-w-0 grid gap-1 text-sm text-slate-700">
            Precio
            <input
              className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-2"
              type="number"
              min={1}
              step="0.01"
              value={form.price}
              onChange={(event) => onNumberChange('price', event.target.value)}
            />
          </label>
          <label className="min-w-0 grid gap-1 text-sm text-slate-700">
            Existencia
            <input
              className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-2"
              type="number"
              min={1}
              value={form.stock}
              onChange={(event) => onNumberChange('stock', event.target.value)}
            />
          </label>
        </div>
        {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-white">{submitLabel}</button>
      </form>
    </Modal>
  )
}