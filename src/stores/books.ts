import { fetchBooks } from '@/api'
import type { BookListResponse, BooksQueryParams, BookSummary } from '@/api/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookStore = defineStore('booksStore', () => {
  const books = ref<BookSummary[]>([])
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

  const getBooks = async (params: BooksQueryParams = {}) => {
    const data: BookListResponse = await fetchBooks({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      ...params,
    })

    books.value = data.items
    _updatePagination(data)
  }

  // const resetBooks = () => {
  //   page.value = 1
  //   keyword.value = ''
  //   getBooks({ page: page.value, pageSize: pageSize.value })
  // }

  return {
    getBooks,
    books,
    pagination,
  }
})
