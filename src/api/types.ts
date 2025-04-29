import type { OrderStatus, PaymentMethod, PaymentStatus, ShippingMethod } from './enums'

export interface UserResponse {
  username: string
  token: string
}

export interface RegisterPayload {
  email: string
  password: string
  confirmPassword: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ErrorResponse {
  errors: string[]
}

export interface BooksQueryParams {
  page?: number
  pageSize?: number
  authorId?: number
  publisherId?: number
  keyword?: string
  includeInvisibleBooks?: boolean
}

export interface BookListResponse {
  items: BookSummary[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface BookSummary {
  id: number
  title: string
  listPrice: number
  discount: number
  imagePath: string
}

export interface BookDetail {
  id: number
  isbn: string
  title: string
  description: string
  listPrice: number
  discount: number
  stock: number
  publicationDate: string
  imagePath: string
  authorId: number
  authorName: string
  publisherId: number
  publisherName: string
}

export interface CartItemDetail {
  id: number
  title: string
  unitPrice: number
  stock: number
  imagePath: string
}

export interface CreateOrderPayload {
  orderItems: { BookId: number; Quantity: number }[]
  shippingAddress: string
  paymentMethod: number
  shippingMethod: number
  shippingNote: string
}

export interface OrderListResponse {
  items: OrderSummary[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface OrderSummary {
  id: number
  orderNumber: string
  totalPrice: number
  orderStatus: number
  paymentStatus: number
  paymentMethod: number
  shippingMethod: number
  createdAt: string
  memberId: number
}

export interface OrdersQueryParams {
  page?: number
  pageSize?: number
  memberId?: number
  orderStatus?: OrderStatus
  paymentStatus?: PaymentStatus
  paymentMethod?: PaymentMethod
  shippingMethod?: ShippingMethod
  startDate?: string
  endDate?: string
}
