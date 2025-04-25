export interface UserResponse {
  username: string
  token: string
}

export interface RegisterPayload {
  email: string
  password: string
  confirmPassword: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ErrorResponse {
  errors: []
}
