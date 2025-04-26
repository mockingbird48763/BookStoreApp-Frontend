<template>
  <FrontNav></FrontNav>
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
const books = computed(() => bookStore.books)
const totalPages = computed(() => bookStore.pagination.totalPages)
const currentPage = ref(bookStore.pagination.page)

onMounted(async () => {
  await bookStore.getBooks()
})

const handlePageChange = async (newPage: number) => {
  currentPage.value = newPage
  await bookStore.getBooks({ page: newPage })
  // 滾動到頁面頂部
  window.scrollTo({
    top: 0,
  })
}
</script>

<style scoped></style>
