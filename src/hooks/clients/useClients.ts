import { useCallback, useEffect, useState } from 'react'
import { clientsService } from '@/services/clientsService.ts'
import type { Client, ClientPayload } from '@/types/client.ts'

/** useClients: carga clientes y mantiene la lista sincronizada tras cada operación CRUD. HU-04. */
export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError] = useState('')

  const loadClients = useCallback(async () => {
    try {
      setClients(await clientsService.list())
      setError('')
    } catch (exception) {
      setClients([])
      setError(exception instanceof Error ? exception.message : 'No se pudieron cargar los clientes.')
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadClients()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadClients])

  const createClient = async (payload: ClientPayload) => {
    const client = await clientsService.create(payload)
    await loadClients()
    return client
  }

  const updateClient = async (id: number, payload: ClientPayload) => {
    await clientsService.update(id, payload)
    await loadClients()
  }

  return { clients, error, createClient, updateClient, reload: loadClients }
}
