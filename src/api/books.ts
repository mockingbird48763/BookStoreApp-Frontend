import { http } from './http'
import type {
  Author,
  BookDetail,
  BookListForManagementResponse,
  BookListResponse,
  BooksQueryParams,
  BookVisibilityPayload,
  CartItemDetail,
  Publisher,
} from './types'

// GET /books
export function fetchBooks(params: BooksQueryParams = {}): Promise<BookListResponse> {
  return http.get('/books', {
    params,
  })
}

// GET /books/{id}
export function fetchBookById(id: number | string): Promise<BookDetail> {
  return http.get(`/books/${id}`)
}

// GET /books/cart
export function fetchBooksForCartById(ids: number[]): Promise<CartItemDetail[]> {
  const queryString = ids.map((id) => `ids=${id}`).join('&')
  return http.get(`/books/cart?${queryString}`)
}

// GET /authors
export function fetchAuthors(): Promise<Author[]> {
  return http.get('/authors')
}

// GET /publishers
export function fetchPublishers(): Promise<Publisher[]> {
  return http.get('/publishers')
}

// GET /books
export function fetchBooksForManagement(
  params: BooksQueryParams = {},
): Promise<BookListForManagementResponse> {
  return http.get('/books/management', {
    params,
  })
}

// PATCH /books/visibility
export function fetchUpdateBookVisibility(payload: BookVisibilityPayload[]) {
  return http.patch('/books/visibility', payload)
}

export function fetchCreateBook(data: BookPayload) {
  return data
} // POST /books
export function fetchUpdateBook(id: string, data: BookUpdatePayload) {
  return { id, data }
} // PATCH /books/{id}

interface BookPayload {
  _: undefined
}
interface BookUpdatePayload {
  _: undefined
}
