import { http } from './http'
import type { CreateOrderPayload } from './types'

export function fetchOrders() {} // GET /orders

export function fetchOrder(id: string) {
  return id
} // GET /orders/{id}

// POST /orders
export function fetchCreateOrder(payload: CreateOrderPayload) {
  const token =
    'Bearer ' +
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQ1ODIxMTY1LCJpc3MiOiJCb29rU3RvcmVBcGkiLCJhdWQiOiJCb29rU3RvcmVDbGllbnQifQ.JlX480qhtIVFnp7fL3rtIqJU9MbHKwXcdOfnPrBoXFs'
  return http.post('/orders', payload, { headers: { Authorization: token } })
}

export function fetchUpdateOrder(id: string, data: OrderUpdatePayload) {
  return { id, data }
} // PATCH /orders/{id}

export function fetchOrdereport() {} // GET /order/report

interface OrderUpdatePayload {
  _: undefined
}
