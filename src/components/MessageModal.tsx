// MessageModal: muestra mensajes emergentes de confirmación o éxito · HU-04, HU-05, HU-06
// Props: title (título modal), message (mensaje informativo), isOpen (visibilidad), onClose (callback de cierre al padre), buttonLabel (texto botón)
import { Modal } from '@/components/Modal.tsx'

type MessageModalProps = {
  title?: string
  message: string
  isOpen: boolean
  onClose: () => void
  buttonLabel?: string
}

export const MessageModal = ({
  title = 'Éxito',
  message,
  isOpen,
  onClose,
  buttonLabel = 'Cerrar',
}: MessageModalProps) => {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex justify-end">
          {/* onClick avisa al componente padre para cerrar el modal */}
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={onClose}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
