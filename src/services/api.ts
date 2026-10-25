// services/api.ts: cliente HTTP base para comunicación con la API REST del backend
// HU-01 a HU-08: intercepta solicitudes fetch, serializa JSON y gestiona códigos de error HTTP

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type ErrorBody = {
  message?: string
  error?: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

// HU-01 a HU-08: función genérica para peticiones HTTP con control de errores y parsing JSON
export const apiRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  if (!API_BASE_URL) {
    throw new Error('Falta configurar VITE_API_URL en el entorno.')
  }

  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      ...options,
      headers,
    })
  } catch (error) {
    throw new Error(
      error instanceof Error && error.message
        ? `No se pudo conectar con el servidor API en ${API_BASE_URL}. ${error.message}`
        : `No se pudo conectar con el servidor API en ${API_BASE_URL}.`,
      { cause: error },
    )
  }

  const rawBody = await response.text()
  let payload: unknown = null

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody)
    } catch {
      if (!response.ok) {
        const contentType = response.headers.get('content-type') ?? 'unknown content type'
        throw new ApiError(`La solicitud falló (${response.status}): se esperaba JSON pero se recibió ${contentType}.`, response.status)
      }

      throw new Error('Respuesta JSON no válida del servidor.')
    }
  }

  if (!response.ok) {
    const body = (payload ?? {}) as ErrorBody
    const friendly = getFriendlyMessage(response.status, path, options.method)
    throw new ApiError(friendly || body.message || body.error || `La solicitud falló (${response.status})`, response.status)
  }

  return payload as T
}

// Mensajes amigables en español para 404 y 409 según el recurso consultado en la API REST
const notFoundMessages: [string, string][] = [
  ['/api/sale-details', 'No se encontró el detalle de venta o el libro/venta indicado.'],
  ['/api/sales', 'No se encontró la venta, el cliente o el usuario indicado.'],
  ['/api/books', 'No se encontró el libro solicitado.'],
  ['/api/clients', 'No se encontró el cliente solicitado.'],
  ['/api/users', 'No se encontró un usuario con esos datos.'],
]

const conflictMessages: [string, string][] = [
  ['/api/sale-details', 'No hay stock suficiente para completar la venta de ese libro.'],
  ['/api/clients', 'Ya existe un cliente con ese número de identificación o correo electrónico.'],
  ['/api/auth/register', 'Ya existe un usuario registrado con ese correo electrónico.'],
  ['/api/users', 'Ya existe un usuario registrado con ese correo electrónico.'],
]

const getFriendlyMessage = (status: number, path: string, method = 'GET') => {
  const table = status === 404 ? notFoundMessages : status === 409 ? conflictMessages : null
  const match = table?.find(([prefix]) => path.startsWith(prefix))

  if (match) return match[1]
  if (status === 404) return 'El recurso solicitado no existe.'
  if (status === 409) return `Conflicto: la operación (${method}) choca con datos existentes.`
  return ''
}
