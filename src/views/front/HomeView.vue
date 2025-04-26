<script setup lang="ts">
import BookCard from '@/components/BookCard.vue'
import NoDataFound from '@/components/NoDataFound.vue'

import { computed, onMounted, ref, watch } from 'vue'
import { useBookStore, useSearchStore } from '@/stores'

const bookStore = useBookStore()
const { getBooks, setKeyword } = bookStore
const books = computed(() => bookStore.books)
const totalPages = computed(() => bookStore.pagination.totalPages)
const currentPage = ref(bookStore.pagination.page)
const searchStore = useSearchStore()

// 滾動到頁面頂部
const scrollToTop = () => window.scrollTo({ top: 0 })

onMounted(async () => {
  await getBooks()
})

const handlePageChange = async (newPage: number) => {
  // 底層自動幫忙改變 currentPage
  await getBooks({ page: newPage })
  scrollToTop()
}

watch(
  () => searchStore.keyword,
  async (keyword) => {
    currentPage.value = 1
    setKeyword(keyword)
    await getBooks({ page: 1 })
    scrollToTop()
  },
)
</script>

<template>
  <v-container v-if="books && books.length" fluid>
    <v-row>
      <v-col v-for="book in books" :key="book.id" cols="12" sm="4" md="3" lg="2">
        <BookCard :book></BookCard>
      </v-col>
    </v-row>
    <!-- 分頁 -->
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      circle
      class="mt-4"
      @update:model-value="handlePageChange"
      :total-visible="10"
    ></v-pagination>
  </v-container>
  <NoDataFound v-else />
</template>
