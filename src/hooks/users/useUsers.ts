// useUsers: consulta, registra y actualiza usuarios contra la API REST · HU-08 administración de personal
// Retorna: { users, error, createUser, findByEmail, updateUser, reload }
import { useCallback, useEffect, useState } from 'react'
import { authService } from '@/services/authService.ts'
import { usersService } from '@/services/usersService.ts'
import type { User, UserPayload } from '@/types/user.ts'

const upsert = (list: User[], user: User) =>
  [...list.filter((item) => item.id !== user.id), user].sort((a, b) => a.id - b.id)

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]) // estado: lista de usuarios registrados
  const [error, setError] = useState('') // estado: mensaje de error de consulta

  // HU-08: consulta la lista de usuarios en la API
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

  // Al montar, consulta los usuarios desde la API (HU-08)
  useEffect(() => {
    void reload()
  }, [reload])

  // HU-08: registra un nuevo usuario en la API
  const createUser = useCallback(async (payload: UserPayload) => {
    const created = await authService.register(payload)
    setUsers((current) => upsert(current, created))
  }, [])

  // HU-03 / HU-08: consulta el perfil de un usuario por su correo electrónico
  const findByEmail = useCallback(async (email: string) => {
    const found = await usersService.profile(email)
    setUsers((current) => upsert(current, found))
  }, [])

  // HU-03 / HU-08: actualiza los datos de un usuario en la API
  const updateUser = useCallback(async (id: number, payload: Partial<UserPayload>) => {
    const updated = await usersService.update(id, payload)
    setUsers((current) => upsert(current, updated))
    return updated
  }, [])

  return { users, error, createUser, findByEmail, updateUser, reload }
}
