import { http } from './http'
import type { BookDetail, BookListResponse, BooksQueryParams, CartItemDetail } from './types'

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

export function fetchBooksForCartById(ids: number[]): Promise<CartItemDetail[]> {
  const queryString = ids.map((id) => `ids=${id}`).join('&')
  return http.get(`/books/cart?${queryString}`)
}

export function fetchCreateBook(data: BookPayload) {
  return data
} // POST /books
export function fetchUpdateBook(id: string, data: BookUpdatePayload) {
  return { id, data }
} // PATCH /books/{id}
export function fetchUpdateBookVisibility(data: BookVisibilityPayload) {
  return data
} // PATCH /books/visibility

interface BookPayload {
  _: undefined
}
interface BookUpdatePayload {
  _: undefined
}
interface BookVisibilityPayload {
  _: undefined
}
