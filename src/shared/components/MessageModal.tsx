/** MessageModal: informa el resultado de una acción y ofrece confirmación para cerrarlo. Historias: HU-03, HU-04, HU-05, HU-07. Props: MessageModalProps (título, mensaje, visibilidad y callback de cierre). */
import { Modal } from './Modal'

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
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={onClose}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}