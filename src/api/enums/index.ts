import { OrderStatusDetails } from './OrderStatus'
import { PaymentMethodDetails } from './PaymentMethod'
import { PaymentStatusDetails } from './PaymentStatus'
import { ShippingMethodDetails } from './ShippingMethod'
import { StatusUtils } from './utils'

export const OrderStatusUtils = StatusUtils(OrderStatusDetails)
export const PaymentStatusUtils = StatusUtils(PaymentStatusDetails)
export const ShippingMethodUtils = StatusUtils(ShippingMethodDetails)
export const PaymentMethodUtils = StatusUtils(PaymentMethodDetails)
export * from './OrderStatus'
export * from './PaymentStatus'
export * from './ShippingMethod'
export * from './PaymentMethod'
export * from './type'
export * from './utils'
