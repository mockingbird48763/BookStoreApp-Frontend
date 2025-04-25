import { http } from './http'
import { type ErrorResponse, type LoginPayload, type RegisterPayload } from './types'

export function fetchLogin(data: LoginPayload) {
  return http.post<{ token: string }, ErrorResponse>('/auth/login', {
    ...data,
  })
}

export function fetchRegister(data: RegisterPayload) {
  return http.post<{ message: string }, ErrorResponse>('/auth/register', {
    ...data,
  })
}
