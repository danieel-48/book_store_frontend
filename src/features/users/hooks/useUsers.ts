import { useCallback, useEffect, useState } from 'react'
import { usersService } from '../services/usersService'
import type { User, UserPayload } from '../types/user'

type UseUsersOptions = {
  enabled?: boolean
}

/** useUsers: carga usuarios cuando está habilitado y refresca la lista tras cambios. HU-07. */
export const useUsers = ({ enabled = true }: UseUsersOptions = {}) => {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')

  const loadUsers = useCallback(async () => {
    if (!enabled) {
      setUsers([])
      setError('')
      return
    }

    try {
      const response = await usersService.list()
      setUsers(response.data.data)
      setError('')
    } catch (exception) {
      setUsers([])
      setError(exception instanceof Error ? exception.message : 'No se pudieron cargar los usuarios.')
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      setUsers([])
      setError('')
      return
    }

    const timer = window.setTimeout(() => {
      void loadUsers()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [enabled, loadUsers])

  const createUser = async (payload: UserPayload) => {
    await usersService.create(payload)
    await loadUsers()
  }

  const updateUser = async (id: number, payload: UserPayload) => {
    await usersService.update(id, payload)
    await loadUsers()
  }

  const removeUser = async (id: number) => {
    await usersService.remove(id)
    await loadUsers()
  }

  return { users, error, createUser, updateUser, removeUser, reload: loadUsers }
}
