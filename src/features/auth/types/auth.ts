export type Role = 'ADMIN' | 'EMPLOYEE'

export type AuthUser = {
  id: number
  name: string
  email: string
  role: Role
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginData = {
  token: string
  user: AuthUser
}
