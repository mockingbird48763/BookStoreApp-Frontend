import { fetchBooks } from '@/api'
import type { BookListResponse, BooksQueryParams, BookSummary } from '@/api/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookStore = defineStore('booksStore', () => {
  const books = ref<BookSummary[]>([])
  const _keyword = ref('')
  const pagination = ref({
    totalCount: 0,
    page: 1,
    pageSize: 12,
    totalPages: 1,
  })

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

  const setKeyword = (newKeyword: string) => {
    _keyword.value = newKeyword
  }

  const resetBooks = async () => {
    setKeyword('')
    await getBooks({ page: 1 })
  }

  return {
    getBooks,
    books,
    pagination,
    setKeyword,
    resetBooks,
  }
})
