import { http } from './http'
import type { CreateOrderPayload, OrderDetail, OrderListResponse, OrdersQueryParams } from './types'

// GET /orders
export function fetchOrders(queryParams?: OrdersQueryParams): Promise<OrderListResponse> {
  return http.get('/orders', {
    params: queryParams,
  })
}

// GET /orders/{id}
export function fetchOrderById(id: number | string): Promise<OrderDetail> {
  return http.get(`/orders/${id}`)
}

// POST /orders
export function fetchCreateOrder(payload: CreateOrderPayload) {
  return http.post('/orders', payload)
}

export function fetchUpdateOrder(id: string, data: OrderUpdatePayload) {
  return { id, data }
} // PATCH /orders/{id}

export function fetchOrdereport() {} // GET /order/report

interface OrderUpdatePayload {
  _: undefined
}
