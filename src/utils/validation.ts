// utils/validation.ts: validaciones de formatos (expresiones regulares) y campos de formularios · HU-01 a HU-08
// Funciones exportadas: isValidEmail, isLettersOnly, isValidPhone, isValidDecimal, isValidInteger, isValidBookTitle, validateRequiredText, validateLettersOnly, validateRequiredEmail, validateRequiredPhone, validateRequiredIdNumber, validateOptionalEmail, validateOptionalPhone, validateBookTitle

const LETTERS_REGEX = /^[\p{L}\s'.-]+$/u
const PHONE_REGEX = /^\d{10}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DECIMAL_REGEX = /^\d+(\.\d{1,2})?$/
const INTEGER_REGEX = /^\d+$/
const TITLE_REGEX = /^[\p{L}\d\s'.:,()-]+$/u

// Verifica si la cadena corresponde a un formato de correo electrónico válido
export const isValidEmail = (value: string) => EMAIL_REGEX.test(value.trim())

// Verifica si la cadena contiene exclusivamente caracteres alfabéticos y espacios
export const isLettersOnly = (value: string) => LETTERS_REGEX.test(value.trim())

// Verifica si el teléfono consta de exactamente 10 dígitos numéricos
export const isValidPhone = (value: string) => PHONE_REGEX.test(value.trim())

// Verifica formato numérico decimal válido (hasta 2 decimales)
export const isValidDecimal = (value: string) => DECIMAL_REGEX.test(value.trim())

// Verifica que el valor contenga exclusivamente números enteros
export const isValidInteger = (value: string) => INTEGER_REGEX.test(value.trim())

// Verifica que el título del libro cumpla con los caracteres permitidos
export const isValidBookTitle = (value: string) => TITLE_REGEX.test(value.trim())

// Valida que un campo de texto no esté vacío
export const validateRequiredText = (label: string, value: string) => {
  if (!value.trim()) {
    return `${label} es obligatorio.`
  }

  return ''
}

// Valida que el texto sea obligatorio y contenga solo letras
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

// HU-04: valida que el correo sea obligatorio y tenga formato válido
export const validateRequiredEmail = (label: string, value: string) => {
  const required = validateRequiredText(label, value)
  if (required) {
    return required
  }

  if (!isValidEmail(value)) {
    return `${label} debe ser un correo electrónico válido.`
  }

  return ''
}

// HU-04: valida que el teléfono sea obligatorio y tenga exactamente 10 dígitos
export const validateRequiredPhone = (label: string, value: string) => {
  const required = validateRequiredText(label, value)
  if (required) {
    return required
  }

  if (!isValidPhone(value)) {
    return `${label} debe contener exactamente 10 números.`
  }

  return ''
}

// HU-04: valida que el número de identificación sea obligatorio y solo numérico
export const validateRequiredIdNumber = (label: string, value: string) => {
  const required = validateRequiredText(label, value)
  if (required) {
    return required
  }

  if (!isValidInteger(value)) {
    return `${label} debe contener solo números.`
  }

  return ''
}

// Valida formato de correo si el usuario ingresó valor opcional
export const validateOptionalEmail = (label: string, value: string) => {
  if (!value.trim()) {
    return ''
  }

  if (!isValidEmail(value)) {
    return `${label} debe ser un correo electrónico válido.`
  }

  return ''
}

// Valida formato de teléfono si el usuario ingresó valor opcional
export const validateOptionalPhone = (label: string, value: string) => {
  if (!value.trim()) {
    return ''
  }

  if (!isValidPhone(value)) {
    return `${label} debe contener exactamente 10 números.`
  }

  return ''
}

// HU-05: valida título obligatorio y sin caracteres especiales no permitidos
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
