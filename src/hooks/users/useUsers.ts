import { useCallback, useEffect, useState } from 'react'
import { authService } from '@/services/authService.ts'
import { usersService } from '@/services/usersService.ts'
import type { User, UserPayload } from '@/types/user.ts'

const upsert = (list: User[], user: User) =>
  [...list.filter((item) => item.id !== user.id), user].sort((a, b) => a.id - b.id)

/** useUsers: carga la lista de usuarios (GET /api/users) y la mantiene al registrar, editar o buscar. */
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')

  const reload = useCallback(
    () =>
      usersService
        .list()
        .then((list) => {
          setUsers(list)
          setError('')
        })
        .catch((exception) => {
          setError(exception instanceof Error ? exception.message : 'No se pudieron cargar los usuarios.')
        }),
    [],
  )

  useEffect(() => {
    void reload()
  }, [reload])

  const createUser = useCallback(async (payload: UserPayload) => {
    const created = await authService.register(payload)
    setUsers((current) => upsert(current, created))
  }, [])

  const findByEmail = useCallback(async (email: string) => {
    const found = await usersService.profile(email)
    setUsers((current) => upsert(current, found))
  }, [])

  const updateUser = useCallback(async (id: number, payload: Partial<UserPayload>) => {
    const updated = await usersService.update(id, payload)
    setUsers((current) => upsert(current, updated))
    return updated
  }, [])

  return { users, error, createUser, findByEmail, updateUser, reload }
}
