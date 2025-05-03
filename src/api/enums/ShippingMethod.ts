import type { StatusDetail } from './type'

export enum ShippingMethod {
  ConvenienceStore = 0,
  HomeDelivery = 1,
}

export const ShippingMethodDetails: Record<ShippingMethod, StatusDetail> = {
  [ShippingMethod.ConvenienceStore]: {
    label: '超商取貨',
    icon: 'mdi-store',
    color: 'purple',
  },
  [ShippingMethod.HomeDelivery]: {
    label: '宅配到府',
    icon: 'mdi-truck-delivery',
    color: 'blue',
  },
}
