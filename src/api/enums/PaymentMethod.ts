import type { StatusDetail } from './type'

export enum PaymentMethod {
  Cash = 0,
  CreditCard = 1,
}

export const PaymentMethodDetails: Record<PaymentMethod, StatusDetail> = {
  [PaymentMethod.Cash]: { label: '現金付款', icon: 'mdi-cash', color: 'brown' },
  [PaymentMethod.CreditCard]: { label: '信用卡', icon: 'mdi-credit-card', color: 'blue' },
}
