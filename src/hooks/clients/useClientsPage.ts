// useClientsPage: coordina formulario, validaciones, paginación y confirmaciones de clientes · HU-04 gestión de clientes
// Retorna: estados y manejadores de la vista de clientes
import { useEffect, useMemo, useState } from 'react'
import { useClients } from '@/hooks/clients/useClients.ts'
import type { Client, ClientFormState, ClientPayload } from '@/types/client.ts'
import {
  validateLettersOnly,
  validateRequiredEmail,
  validateRequiredIdNumber,
  validateRequiredPhone,
} from '@/utils/validation.ts'

const emptyClient: ClientFormState = {
  idNumber: '',
  name: '',
  email: '',
  phone: '',
}

export const useClientsPage = () => {
  const { clients, createClient, updateClient } = useClients()
  const pageSize = 15
  const [isModalOpen, setIsModalOpen] = useState(false) // estado: visibilidad del modal de formulario
  const [form, setForm] = useState<ClientFormState>(emptyClient) // estado: datos del formulario de cliente
  const [submitError, setSubmitError] = useState('') // estado: mensaje de error de validación o del servidor
  const [editingClientId, setEditingClientId] = useState<number | null>(null) // estado: ID del cliente en edición (null si es nuevo)
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false) // estado: modal de confirmación antes de actualizar
  const [currentPage, setCurrentPage] = useState(1) // estado: página activa de la lista
  const [successMessage, setSuccessMessage] = useState('') // estado: texto de confirmación exitosa
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // estado: visibilidad del modal de éxito

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

  const validateAndBuildPayload = (): ClientPayload | null => {
    const nameError = validateLettersOnly('Nombre', form.name)
    if (nameError) {
      setSubmitError(nameError)
      return null
    }

    const idNumberError = validateRequiredIdNumber('Número de identificación', form.idNumber)
    if (idNumberError) {
      setSubmitError(idNumberError)
      return null
    }

    const emailError = validateRequiredEmail('Correo electrónico', form.email)
    if (emailError) {
      setSubmitError(emailError)
      return null
    }

    const phoneError = validateRequiredPhone('Teléfono', form.phone)
    if (phoneError) {
      setSubmitError(phoneError)
      return null
    }

    return {
      idNumber: Number(form.idNumber.trim()),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: Number(form.phone.trim()),
    }
  }

  // HU-04: registra o actualiza el cliente en la API y refresca la vista
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

  // HU-04: confirma la actualización del cliente en la API
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
