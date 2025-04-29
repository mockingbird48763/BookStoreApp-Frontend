import type { StatusDetail } from './type'

export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Failed = 2,
}

export const PaymentStatusDetails: Record<PaymentStatus, StatusDetail> = {
  [PaymentStatus.Pending]: { label: '待付款', icon: 'mdi-timer-sand', color: 'orange' },
  [PaymentStatus.Paid]: { label: '已付款', icon: 'mdi-check-circle', color: 'green' },
  [PaymentStatus.Failed]: { label: '付款失敗', icon: 'mdi-close-circle', color: 'red' },
}
