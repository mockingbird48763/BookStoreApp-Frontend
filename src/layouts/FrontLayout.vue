<template>
  <FrontNav @search="handleSearch" @clear="handleClear"></FrontNav>
  <v-main>
    <v-container fluid>
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
  </v-main>
  <FrontFooter></FrontFooter>
</template>

<script setup lang="ts">
import FrontFooter from '@/components/front/FrontFooter.vue'
import BookCard from '@/components/BookCard.vue'
import FrontNav from '@/components/front/FrontNav.vue'
import { computed, onMounted, ref } from 'vue'
import { useBookStore } from '@/stores'

const bookStore = useBookStore()
const { getBooks, setKeyword, resetBooks } = bookStore
const books = computed(() => bookStore.books)
const totalPages = computed(() => bookStore.pagination.totalPages)
const currentPage = ref(bookStore.pagination.page)

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

const handleSearch = async (keyword: string) => {
  if (!keyword.trim()) return
  setKeyword(keyword)
  currentPage.value = 1
  await getBooks({ page: currentPage.value, keyword })
  scrollToTop()
}

const handleClear = async () => {
  currentPage.value = 1
  await resetBooks()
  scrollToTop()
}
</script>

<style scoped></style>
