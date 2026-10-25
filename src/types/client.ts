export type Client = {
  idClient: number
  idNumber: number | null
  name: string
  email: string | null
  phone: number | null
}

export type ClientPayload = Omit<Client, 'idClient'>

export type ClientFormState = {
  idNumber: string
  name: string
  email: string
  phone: string
}
