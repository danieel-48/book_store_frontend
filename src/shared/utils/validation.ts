const LETTERS_REGEX = /^[\p{L}\s'.-]+$/u
const PHONE_REGEX = /^\d{10}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DECIMAL_REGEX = /^\d+(\.\d{1,2})?$/
const INTEGER_REGEX = /^\d+$/
const TITLE_REGEX = /^[\p{L}\d\s'.:,()\-]+$/u

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value.trim())

export const isLettersOnly = (value: string) => LETTERS_REGEX.test(value.trim())

export const isValidPhone = (value: string) => PHONE_REGEX.test(value.trim())

export const isValidDecimal = (value: string) => DECIMAL_REGEX.test(value.trim())

export const isValidInteger = (value: string) => INTEGER_REGEX.test(value.trim())

export const isValidBookTitle = (value: string) => TITLE_REGEX.test(value.trim())

export const validateRequiredText = (label: string, value: string) => {
  if (!value.trim()) {
    return `${label} es obligatorio.`
  }

  return ''
}

export const validateLettersOnly = (label: string, value: string) => {
  const required = validateRequiredText(label, value)

  if (required) {
    return required
  }

  if (!isLettersOnly(value)) {
    return `${label} debe contener solo letras.`
  }

  return ''
}

export const validateOptionalEmail = (label: string, value: string) => {
  if (!value.trim()) {
    return ''
  }

  if (!isValidEmail(value)) {
    return `${label} debe ser un correo electrónico válido.`
  }

  return ''
}

export const validateOptionalPhone = (label: string, value: string) => {
  if (!value.trim()) {
    return ''
  }

  if (!isValidPhone(value)) {
    return `${label} debe contener exactamente 10 números.`
  }

  return ''
}

export const validateBookTitle = (value: string) => {
  const required = validateRequiredText('Título', value)

  if (required) {
    return required
  }

  if (!isValidBookTitle(value)) {
    return 'El título contiene caracteres no válidos.'
  }

  return ''
}