import {
  fetchAuthors,
  fetchBookById,
  fetchBooks,
  fetchBooksForManagement,
  fetchCreateBook,
  fetchPublishers,
  fetchUpdateBook,
  fetchUpdateBookVisibility,
} from '@/api'
import type {
  BookDetail,
  BookListResponse,
  BooksQueryParams,
  BookSummary,
  Author,
  Publisher,
  BookListForManagementResponse,
  BookForManagementSummary,
  BookVisibilityPayload,
} from '@/api/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookStore = defineStore('booksStore', () => {
  const books = ref<BookSummary[]>([])
  const booksForManagement = ref<BookForManagementSummary[]>([])
  const authors = ref<Author[]>([])
  const publishers = ref<Publisher[]>([])
  const _keyword = ref('')
  const pagination = ref({
    totalCount: 0,
    page: 1,
    pageSize: 12,
    totalPages: 1,
  })
  const bookDetail = ref<BookDetail>()

  const _updatePagination = (data: BookListResponse) => {
    pagination.value.totalCount = data.totalCount
    pagination.value.page = data.page
    pagination.value.pageSize = data.pageSize
    pagination.value.totalPages = data.totalPages
  }

  const getBooks = async (externalParams: BooksQueryParams = {}) => {
    const queryParams: BooksQueryParams = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }

    if (_keyword.value.trim()) {
      queryParams.keyword = _keyword.value
    }

    const data: BookListResponse = await fetchBooks({
      ...queryParams,
      ...externalParams,
    })

    books.value = data.items
    _updatePagination(data)
  }

  const getAuthors = async () => {
    const data: Author[] = await fetchAuthors()
    authors.value = data
  }

  const getPublishers = async () => {
    const data: Publisher[] = await fetchPublishers()
    publishers.value = data
  }

  const setKeyword = (newKeyword: string) => {
    _keyword.value = newKeyword
  }

  const resetBooks = async () => {
    setKeyword('')
    await getBooks({ page: 1 })
  }

  const getBookDetail = async (id: string | number) => {
    bookDetail.value = await fetchBookById(id)
  }

  const getBooksForManagement = async (externalParams: BooksQueryParams = {}) => {
    const queryParams: BooksQueryParams = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }

    if (_keyword.value.trim()) {
      queryParams.keyword = _keyword.value
    }

    const data: BookListForManagementResponse = await fetchBooksForManagement({
      ...queryParams,
      ...externalParams,
    })

    booksForManagement.value = data.items
    _updatePagination(data)
  }

  const updateVisibilityBatch = async (payload: BookVisibilityPayload[]) => {
    await fetchUpdateBookVisibility(payload)
  }

  const createBook = async (formData: FormData) => {
    await fetchCreateBook(formData)
  }

  const updateBook = async (id: number, formData: FormData) => {
    await fetchUpdateBook(id, formData)
  }

  return {
    getBooks,
    books,
    booksForManagement,
    authors,
    publishers,
    pagination,
    setKeyword,
    resetBooks,
    getBookDetail,
    bookDetail,
    getAuthors,
    getPublishers,
    getBooksForManagement,
    updateVisibilityBatch,
    createBook,
    updateBook,
  }
})
