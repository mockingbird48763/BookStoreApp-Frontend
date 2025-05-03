import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import { checkHaveToken, cleanToken, getToken } from '@/utils/token'
import router from '@/router'
import { useSnackbar } from '@/composables/useSnackbar'

const snackbar = useSnackbar()

export const http: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  if (checkHaveToken()) config.headers.Authorization = `Bearer ${getToken()}`
  return config
})

http.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      cleanToken()
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
        snackbar.show('此操作需要登入', 'warning', 3000, 'top center')
      }
    }
    if (error.response && error.response.status === 403) {
      if (router.currentRoute.value.path !== '/') {
        router.push('/')
      }
    }
    return Promise.reject(error)
  },
)
