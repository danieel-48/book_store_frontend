import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../app/useAuth'
import { isValidEmail } from '../../../shared/utils/validation'

/** useLoginForm: valida el formulario de acceso y coordina el inicio de sesión. HU-01. */
export const useLoginForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@bookstore.test')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('El correo electrónico es obligatorio.')
      return
    }

    if (!isValidEmail(email)) {
      setError('Ingrese un correo electrónico válido.')
      return
    }

    if (!password.trim()) {
      setError('La contraseña es obligatoria.')
      return
    }

    if (password.trim().length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setIsSubmitting(true)

    try {
      await login({ email, password })
      navigate('/')
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Error al iniciar sesión')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    email,
    password,
    error,
    isSubmitting,
    setEmail,
    setPassword,
    submit,
  }
}
