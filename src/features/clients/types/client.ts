export type Client = {
  id: number
  name: string
  email: string | null
  phone: string | null
}

export type ClientPayload = Omit<Client, 'id'>
