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

// POST /books
export function fetchCreateBook(formData: FormData) {
  return http.post('/books', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// PATCH /books
export function fetchUpdateBook(id: number | string, formData: FormData) {
  return http.patch(`/books/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
