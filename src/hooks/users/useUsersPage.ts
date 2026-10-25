import { useState } from 'react'
import { useAuth } from '@/app/useAuth'
import { useUsers } from '@/hooks/users/useUsers.ts'
import { usersService } from '@/services/usersService.ts'
import type { User, UserPayload } from '@/types/user.ts'
import { validateLettersOnly, validateOptionalEmail } from '@/utils/validation.ts'

const emptyUser: UserPayload = {
  name: '',
  email: '',
  password: '',
  role: 'EMPLOYEE',
}

/** useUsersPage: gestiona registro y búsqueda por correo de usuarios, consulta de perfil del usuario logeado y edición. */
export const useUsersPage = () => {
  const { user, updateSessionUser } = useAuth()
  const { users, error: usersError, createUser, findByEmail, updateUser } = useUsers()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [form, setForm] = useState<UserPayload>(emptyUser)
  const [submitError, setSubmitError] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchError, setSearchError] = useState('')

  const [loggedUserProfile, setLoggedUserProfile] = useState<User | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')

  const loggedUserEmail =
    user?.email && user.email !== 'admin@bookstore.test' ? user.email : 'ana12345@test.com'

  const loadLoggedUserProfile = async (emailOverride?: string) => {
    const emailToQuery = emailOverride || loggedUserEmail
    setIsLoadingProfile(true)
    setProfileError('')
    try {
      const profile = await usersService.profile(emailToQuery)
      setLoggedUserProfile(profile)
      return profile
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'No se pudo cargar la información del usuario.')
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const closeProfileView = () => {
    setLoggedUserProfile(null)
    setProfileError('')
  }

  const search = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = searchEmail.trim()

    if (!email) {
      return
    }

    try {
      await findByEmail(email)
      setSearchError('')
      setSearchEmail('')
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'No se encontró el usuario.')
    }
  }

  const openModal = () => {
    setSubmitError('')
    setEditingUserId(null)
    setForm(emptyUser)
    setIsModalOpen(true)
  }

  const openEditModal = (item: User) => {
    setSubmitError('')
    setEditingUserId(item.id)
    setForm({ name: item.name, email: item.email, password: '', role: item.role })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSubmitError('')
    setEditingUserId(null)
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

    const isEditing = editingUserId !== null
    const password = form.password.trim()

    if (!isEditing && !password) {
      setSubmitError('La contraseña es obligatoria.')
      return
    }

    if (password && password.length < 6) {
      setSubmitError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    const payload: UserPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password,
      role: form.role,
    }

    try {
      if (isEditing) {
        const updated = await updateUser(editingUserId, { ...payload, password: password || undefined })

        if (loggedUserProfile?.id === updated.id) {
          setLoggedUserProfile(updated)
        }

        if (updated.id === user?.id) {
          updateSessionUser(updated)
        }
      } else {
        await createUser(payload)
      }

      setForm(emptyUser)
      setSubmitError('')
      setEditingUserId(null)
      setIsModalOpen(false)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo guardar el usuario.')
    }
  }

  return {
    currentUser: user,
    users,
    usersError,
    isModalOpen,
    editingUserId,
    form,
    submitError,
    searchEmail,
    setSearchEmail,
    searchError,
    search,
    openModal,
    openEditModal,
    closeModal,
    updateForm,
    submit,
    loggedUserProfile,
    isLoadingProfile,
    profileError,
    loggedUserEmail,
    loadLoggedUserProfile,
    closeProfileView,
  }
}
