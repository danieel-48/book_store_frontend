import { useEffect, useMemo, useState } from 'react'
import { useClients } from './useClients'
import type { Client, ClientPayload } from '../types/client'
import { validateLettersOnly, validateOptionalEmail, validateOptionalPhone } from '../../../shared/utils/validation'

const emptyClient: ClientPayload = {
  name: '',
  email: '',
  phone: '',
}

/** useClientsPage: gestiona el formulario, validaciones, paginación y confirmaciones de clientes. HU-04. */
export const useClientsPage = () => {
  const { clients, createClient, updateClient, removeClient } = useClients()
  const pageSize = 15
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<ClientPayload>(emptyClient)
  const [submitError, setSubmitError] = useState('')
  const [editingClientId, setEditingClientId] = useState<number | null>(null)
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false)
  const [deleteTargetClientId, setDeleteTargetClientId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [successMessage, setSuccessMessage] = useState('')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const totalPages = Math.max(1, Math.ceil(clients.length / pageSize))

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return clients.slice(start, start + pageSize)
  }, [clients, currentPage])

  const pageNumbers = useMemo(() => {
    const maxVisible = 5
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)
    const adjustedStart = Math.max(1, end - maxVisible + 1)

    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index)
  }, [currentPage, totalPages])

  const openModal = () => {
    setSubmitError('')
    setEditingClientId(null)
    setForm(emptyClient)
    setIsModalOpen(true)
  }

  const openEditModal = (client: Client) => {
    setSubmitError('')
    setEditingClientId(client.id)
    setForm({
      name: client.name,
      email: client.email ?? '',
      phone: client.phone ?? '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSubmitError('')
    setEditingClientId(null)
    setForm(emptyClient)
    setIsModalOpen(false)
    setIsUpdateConfirmOpen(false)
  }

  const updateForm = (field: keyof ClientPayload, value: string) => {
    setSubmitError('')

    if (field === 'phone') {
      const onlyDigits = value.replace(/\D/g, '')
      setForm((current) => ({ ...current, phone: onlyDigits }))
      return
    }

    setForm((current) => ({ ...current, [field]: value }))
  }

  // Requiere al menos un medio de contacto y normaliza los campos opcionales.
  const validateAndBuildPayload = (): ClientPayload | null => {
    if (!form.email?.trim() && !form.phone?.trim()) {
      setSubmitError('El correo electrónico o el teléfono son obligatorios.')
      return null
    }

    const nameError = validateLettersOnly('Nombre', form.name)
    if (nameError) {
      setSubmitError(nameError)
      return null
    }

    const emailError = validateOptionalEmail('Correo electrónico', form.email ?? '')
    if (emailError) {
      setSubmitError(emailError)
      return null
    }

    const phoneError = validateOptionalPhone('Teléfono', form.phone ?? '')
    if (phoneError) {
      setSubmitError(phoneError)
      return null
    }

    return {
      name: form.name.trim(),
      email: form.email?.trim() || null,
      phone: form.phone?.trim() || null,
    }
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = validateAndBuildPayload()
    if (!payload) {
      return
    }

    try {
      if (editingClientId === null) {
        await createClient(payload)
        setSuccessMessage('Cliente creado correctamente.')
      } else {
        await updateClient(editingClientId, payload)
        setSuccessMessage('Cliente actualizado correctamente.')
      }

      setForm(emptyClient)
      setSubmitError('')
      setEditingClientId(null)
      setIsModalOpen(false)
      setIsUpdateConfirmOpen(false)
      setIsSuccessModalOpen(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : `No se pudo ${editingClientId === null ? 'crear' : 'actualizar'} el cliente.`)
    }
  }

  const requestUpdateConfirmation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = validateAndBuildPayload()
    if (!payload || editingClientId === null) {
      return
    }

    setSubmitError('')
    setIsUpdateConfirmOpen(true)
  }

  const confirmUpdate = async () => {
    if (editingClientId === null) {
      return
    }

    const payload = validateAndBuildPayload()
    if (!payload) {
      setIsUpdateConfirmOpen(false)
      return
    }

    try {
      await updateClient(editingClientId, payload)
      setSuccessMessage('Cliente actualizado correctamente.')
      setForm(emptyClient)
      setSubmitError('')
      setEditingClientId(null)
      setIsModalOpen(false)
      setIsUpdateConfirmOpen(false)
      setIsSuccessModalOpen(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo actualizar el cliente.')
      setIsUpdateConfirmOpen(false)
    }
  }

  const cancelUpdateConfirmation = () => {
    setIsUpdateConfirmOpen(false)
  }

  const requestDeleteConfirmation = (id: number) => {
    setDeleteTargetClientId(id)
  }

  const cancelDeleteConfirmation = () => {
    setDeleteTargetClientId(null)
  }

  const confirmDelete = async () => {
    if (deleteTargetClientId === null) {
      return
    }

    try {
      await removeClient(deleteTargetClientId)
      setDeleteTargetClientId(null)
      setSuccessMessage('Cliente eliminado correctamente.')
      setIsSuccessModalOpen(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo eliminar el cliente.')
      setDeleteTargetClientId(null)
    }
  }

  const closeSuccessModal = () => {
    setSuccessMessage('')
    setIsSuccessModalOpen(false)
  }

  return {
    clients: paginatedClients,
    clientsCount: clients.length,
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
  }
}
