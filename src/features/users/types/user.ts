import type { Role } from '../../auth/types/auth'

export type User = {
  id: number
  name: string
  email: string
  role: Role
}

export type UserPayload = {
  name: string
  email: string
  password?: string
  role: Role
}
