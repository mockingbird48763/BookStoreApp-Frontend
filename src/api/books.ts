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
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQ1ODIwMDUwLCJpc3MiOiJCb29rU3RvcmVBcGkiLCJhdWQiOiJCb29rU3RvcmVDbGllbnQifQ.r1VIzIVczY0zaAW_DEoIbX1cRWGoe-Wp3khDP0pq7B4'
  return http.get(`/books/cart?${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
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
