import type { OrderStatus } from './enums/OrderStatus'
import type { PaymentMethod } from './enums/PaymentMethod'
import type { PaymentStatus } from './enums/PaymentStatus'
import type { ShippingMethod } from './enums/ShippingMethod'

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

export interface BookListForManagementResponse {
  items: BookForManagementSummary[]
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

export interface BookForManagementSummary {
  id: number
  imagePath: string
  title: string
  listPrice: number
  discount: number
  unitPrice: number
  stock: number
  isVisible: boolean
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

export interface OrderDetail {
  id: number
  orderNumber: string
  totalPrice: number
  orderStatus: number
  paymentStatus: number
  paymentMethod: number
  shippingMethod: number
  shippingAddress: string
  shippingNote: string
  createdAt: string
  memberId: number
  memberEmail: string
  orderDetailItems: OrderDetailItem[]
}

export interface OrderDetailItem {
  id: number
  unitPrice: number
  quantity: number
  bookId: number
  bookName: string
}

export interface OrderUpdatePayload {
  orderStatus: number
  paymentStatus: number
}

export interface Author {
  id: number
  name: string
}

export interface Publisher {
  id: number
  name: string
}

export interface BookVisibilityPayload {
  bookId: number
  isVisible: boolean
}
