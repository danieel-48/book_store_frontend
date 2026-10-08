export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8080/api/v1' : '/api/v1')
const TOKEN_KEY = 'bookstore_token'

let unauthorizedHandler: (() => void) | null = null

export const setUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler
}

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY)

export const persistToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)

export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY)

export const apiRequest = async <T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const token = getStoredToken()
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    })
  } catch (error) {
    throw new Error(
      error instanceof Error && error.message
        ? `No se pudo conectar con el servidor API en ${API_BASE_URL}. ${error.message}`
        : `No se pudo conectar con el servidor API en ${API_BASE_URL}.`,
    )
  }

  if (response.status === 401 && unauthorizedHandler) {
    unauthorizedHandler()
  }

  const rawBody = await response.text()
  let payload: ApiResponse<T> | null = null

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody) as ApiResponse<T>
    } catch {
      if (!response.ok) {
        const contentType = response.headers.get('content-type') ?? 'unknown content type'
        throw new Error(`La solicitud falló (${response.status}): se esperaba JSON pero se recibió ${contentType}.`)
      }

      throw new Error('Respuesta JSON no válida del servidor.')
    }
  }

  if (!response.ok) {
    throw new Error(payload?.message || `La solicitud falló (${response.status})`)
  }

  if (!payload) {
    throw new Error('El servidor devolvió una respuesta vacía.')
  }

  return payload
}
