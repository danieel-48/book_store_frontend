import { useState } from 'react'
import { useAuth } from '../../../app/useAuth'
import { useUsers } from './useUsers'
import type { UserPayload } from '../types/user'
import { validateLettersOnly, validateOptionalEmail } from '../../../shared/utils/validation'

const emptyUser: UserPayload = {
  name: '',
  email: '',
  password: '',
  role: 'EMPLOYEE',
}

/** useUsersPage: gestiona creación y eliminación de usuarios con acceso restringido a ADMIN. HU-07. */
export const useUsersPage = () => {
  const { user } = useAuth()
  const { users, createUser, removeUser } = useUsers()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteTargetUserId, setDeleteTargetUserId] = useState<number | null>(null)
  const [form, setForm] = useState<UserPayload>(emptyUser)
  const [submitError, setSubmitError] = useState('')

  const openModal = () => {
    setSubmitError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSubmitError('')
    setIsModalOpen(false)
  }

  const updateForm = (field: keyof UserPayload, value: string) => {
    setSubmitError('')
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nameError = validateLettersOnly('Nombre', form.name)
    if (nameError) {
      setSubmitError(nameError)
      return
    }

    const emailError = validateOptionalEmail('Correo electrónico', form.email)
    if (emailError || !form.email.trim()) {
      setSubmitError(emailError || 'El correo electrónico es obligatorio.')
      return
    }

    if (!form.password?.trim()) {
      setSubmitError('La contraseña es obligatoria.')
      return
    }

    if (form.password.trim().length < 6) {
      setSubmitError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    const payload: UserPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      role: form.role,
    }

    try {
      await createUser(payload)
      setForm(emptyUser)
      setSubmitError('')
      setIsModalOpen(false)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo crear el usuario.')
    }
  }

  const requestDeleteConfirmation = (id: number) => {
    setDeleteTargetUserId(id)
  }

  const cancelDeleteConfirmation = () => {
    setDeleteTargetUserId(null)
  }

  const confirmDelete = async () => {
    if (deleteTargetUserId === null) {
      return
    }

    try {
      await removeUser(deleteTargetUserId)
      setDeleteTargetUserId(null)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo eliminar el usuario.')
    }
  }

  return {
    currentUser: user,
    users,
    isModalOpen,
    deleteTargetUserId,
    form,
    submitError,
    openModal,
    closeModal,
    updateForm,
    submit,
    requestDeleteConfirmation,
    cancelDeleteConfirmation,
    confirmDelete,
  }
}
