import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
  const token = ref('')
  const TOKEN_KEY = 'token' // 定義 storage key

  const login = (newToken: string) => {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, token.value)
  }

  const logout = () => {
    token.value = ''
    localStorage.removeItem(TOKEN_KEY)
  }

  const loadToken = () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
    }
  }

  const isLoggedIn = computed(() => !!token.value)

  return {
    login,
    logout,
    isLoggedIn,
    loadToken,
  }
})
