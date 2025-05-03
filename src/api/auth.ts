import { http } from './http'
import { type LoginPayload, type RegisterPayload } from './types'

export function fetchLogin(data: LoginPayload) {
  return http.post<{ token: string }>('/auth/login', {
    ...data,
  })
}

export function fetchRegister(data: RegisterPayload): Promise<{ message: string }> {
  return http.post('/auth/register', {
    ...data,
  })
}
