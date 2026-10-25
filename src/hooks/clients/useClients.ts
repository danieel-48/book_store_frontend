// useClients: consulta y sincroniza el listado de clientes con la API REST · HU-04 gestión de clientes
// Retorna: { clients, error, createClient, updateClient, reload }
import { useCallback, useEffect, useState } from 'react'
import { clientsService } from '@/services/clientsService.ts'
import type { Client, ClientPayload } from '@/types/client.ts'

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]) // estado: lista de clientes registrados
  const [error, setError] = useState('') // estado: error en la consulta a la API

  // HU-04: consulta los clientes desde la API
  const loadClients = useCallback(async () => {
    try {
      setClients(await clientsService.list())
      setError('')
    } catch (exception) {
      setClients([])
      setError(exception instanceof Error ? exception.message : 'No se pudieron cargar los clientes.')
    }
  }, [])

  // Al montar, consulta los clientes registrados en la API (HU-04)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadClients()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadClients])

  // HU-04: registra un cliente en la API y recarga la lista
  const createClient = async (payload: ClientPayload) => {
    const client = await clientsService.create(payload)
    await loadClients()
    return client
  }

  // HU-04: actualiza los datos del cliente en la API y recarga la lista
  const updateClient = async (id: number, payload: ClientPayload) => {
    await clientsService.update(id, payload)
    await loadClients()
  }

  return { clients, error, createClient, updateClient, reload: loadClients }
}
