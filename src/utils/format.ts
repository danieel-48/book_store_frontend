// utils/format.ts: funciones utilitarias de formateo de moneda colombiana (COP) y fechas ISO · HU-02 a HU-07
// Funciones exportadas: formatCurrency, formatDateTime, toLocalDateTime, toLocalDate

// Formatea montos numéricos a pesos colombianos (COP) sin decimales
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

// Formatea cadenas de fecha ISO a fecha y hora legible en español
export const formatDateTime = (value: string | null) => {
  if (!value) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const pad = (value: number) => String(value).padStart(2, '0')

// La API maneja fechas locales sin zona horaria (YYYY-MM-DDTHH:mm:ss)
export const toLocalDateTime = (date: Date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

// Obtiene la fecha actual en formato local YYYY-MM-DD
export const toLocalDate = (date: Date = new Date()) => toLocalDateTime(date).slice(0, 10)
