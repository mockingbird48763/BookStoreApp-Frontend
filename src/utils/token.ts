export function getToken(): string | null {
  try {
    const raw = localStorage.getItem('token')
    // 習慣性使用 JSON.parse 和 JSON.strngify
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function checkHaveToken() {
  return getToken()
}

export function setToken(token: string) {
  localStorage.setItem('token', JSON.stringify(token))
}

export function cleanToken() {
  localStorage.removeItem('token')
  localStorage.removeItem('email')
  localStorage.removeItem('roles')
}
