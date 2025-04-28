import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import { checkHaveToken, getToken } from '@/utils/token'
import router from '@/router'

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
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
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
