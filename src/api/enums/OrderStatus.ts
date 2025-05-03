import type { StatusDetail } from './type'

export enum OrderStatus {
  Pending = 0,
  Shipped = 1,
  Completed = 2,
  Cancelled = 3,
}

export const OrderStatusDetails: Record<OrderStatus, StatusDetail> = {
  [OrderStatus.Pending]: { label: '待出貨', icon: 'mdi-clock', color: 'yellow' },
  [OrderStatus.Shipped]: { label: '已出貨', icon: 'mdi-truck', color: 'blue' },
  [OrderStatus.Completed]: { label: '已完成', icon: 'mdi-check-circle', color: 'green' },
  [OrderStatus.Cancelled]: { label: '已取消', icon: 'mdi-cancel', color: 'red' },
}
