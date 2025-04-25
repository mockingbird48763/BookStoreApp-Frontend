import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import { checkHaveToken, getToken } from '@/utils/token'

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
  (error) => Promise.reject(error),
)
