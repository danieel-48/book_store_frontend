export type Role = 'ADMIN' | 'EMPLOYEE'

export type AuthUser = {
  id: number
  name: string
  email: string
  role: Role
  active: boolean
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  role: Role
}
