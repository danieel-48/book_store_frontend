/** Modal: contenedor reutilizable para formularios y confirmaciones. Historias: HU-03, HU-04, HU-05, HU-07. Props: ModalProps (título, visibilidad, cierre, tamaño y contenido). */
type ModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const sizeClassMap: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
}

export const Modal = ({ title, isOpen, onClose, size = 'sm', children }: ModalProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
      <div className={`w-full ${sizeClassMap[size]} rounded-2xl bg-white p-6 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M5 5L15 15" />
              <path d="M15 5L5 15" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
