import { useEffect, useMemo, useState } from 'react'
import { useClients } from '@/hooks/clients/useClients.ts'
import type { Client, ClientFormState, ClientPayload } from '@/types/client.ts'
import { validateLettersOnly, validateOptionalEmail, validateOptionalPhone } from '@/utils/validation.ts'

const emptyClient: ClientFormState = {
  idNumber: '',
  name: '',
  email: '',
  phone: '',
}

/** useClientsPage: gestiona el formulario, validaciones, paginación y confirmaciones de clientes. */
export const useClientsPage = () => {
  const { clients, createClient, updateClient } = useClients()
  const pageSize = 15
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<ClientFormState>(emptyClient)
  const [submitError, setSubmitError] = useState('')
  const [editingClientId, setEditingClientId] = useState<number | null>(null)
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false)
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
    setEditingClientId(client.idClient)
    setForm({
      idNumber: client.idNumber === null ? '' : String(client.idNumber),
      name: client.name,
      email: client.email ?? '',
      phone: client.phone === null ? '' : String(client.phone),
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

  const updateForm = (field: keyof ClientFormState, value: string) => {
    setSubmitError('')

    if (field === 'phone' || field === 'idNumber') {
      const onlyDigits = value.replace(/\D/g, '')
      setForm((current) => ({ ...current, [field]: onlyDigits }))
      return
    }

    setForm((current) => ({ ...current, [field]: value }))
  }

  // Solo el nombre es obligatorio; el resto de campos se normalizan a null si están vacíos.
  const validateAndBuildPayload = (): ClientPayload | null => {
    const nameError = validateLettersOnly('Nombre', form.name)
    if (nameError) {
      setSubmitError(nameError)
      return null
    }

    const emailError = validateOptionalEmail('Correo electrónico', form.email)
    if (emailError) {
      setSubmitError(emailError)
      return null
    }

    const phoneError = validateOptionalPhone('Teléfono', form.phone)
    if (phoneError) {
      setSubmitError(phoneError)
      return null
    }

    return {
      idNumber: form.idNumber.trim() ? Number(form.idNumber) : null,
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() ? Number(form.phone) : null,
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
    closeSuccessModal,
    updateForm,
    setCurrentPage,
    submit,
  }
}
