import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { UserRole } from '@/constants'

interface JwtPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[]
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string
}

// 定義 storage key
const TOKEN_KEY = 'token'
const EMAIL_KEY = 'email'
const ROLES_KEY = 'roles'

// 定義 JWT payload 的 key
const JWT_ROLES_KEY = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const JWT_EMAIL_KEY = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'

export const useAuthStore = defineStore('authStore', () => {
  const token = ref('')
  const email = ref('')
  const roles = ref<string[]>([])

  const login = (newToken: string) => {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token.value))

    try {
      const decoded = jwtDecode<JwtPayload>(token.value)

      email.value = decoded[JWT_EMAIL_KEY] || ''
      const roleClaim = decoded[JWT_ROLES_KEY]

      // 如果是單個 string，就包成陣列；否則直接使用
      roles.value = Array.isArray(roleClaim) ? roleClaim : roleClaim ? [roleClaim] : []

      // admin 包含 user 角色的權限
      if (roles.value.includes(UserRole.ADMIN)) {
        roles.value.push(UserRole.USER)
      }

      localStorage.setItem(EMAIL_KEY, JSON.stringify(email.value))
      localStorage.setItem(ROLES_KEY, JSON.stringify(roles.value))
    } catch (error) {
      console.error('無法解碼 token:', error)
      logout()
    }
  }

  const logout = () => {
    token.value = ''
    email.value = ''
    roles.value = []

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
    localStorage.removeItem(ROLES_KEY)
  }

  const loadToken = () => {
    try {
      const savedToken = JSON.parse(localStorage.getItem(TOKEN_KEY) || '')
      if (!savedToken) {
        logout()
        return
      }
      token.value = savedToken
      roles.value = JSON.parse(localStorage.getItem(ROLES_KEY) || '[]')
      email.value = JSON.parse(localStorage.getItem(EMAIL_KEY) || '""')
    } catch {
      logout()
    }
  }

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => roles.value.includes(UserRole.ADMIN))
  const hasRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.some((role) => roles.value.includes(role))
  }
  const getEmail = () => email.value
  const getRoles = () => roles.value
  const getToken = () => token.value

  return {
    login,
    logout,
    isLoggedIn,
    isAdmin,
    loadToken,
    hasRole,
    getEmail,
    getRoles,
    getToken,
  }
})
