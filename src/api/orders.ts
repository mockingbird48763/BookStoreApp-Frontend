export function fetchOrders() {} // GET /orders

export function fetchOrder(id: string) {
  return id
} // GET /orders/{id}

export function fetchCreateOrder(data: OrderPayload) {
  return data
} // POST /orders

export function fetchUpdateOrder(id: string, data: OrderUpdatePayload) {
  return { id, data }
} // PATCH /orders/{id}

export function fetchOrdereport() {} // GET /order/report

interface OrderPayload {
  _: undefined
}

interface OrderUpdatePayload {
  _: undefined
}
