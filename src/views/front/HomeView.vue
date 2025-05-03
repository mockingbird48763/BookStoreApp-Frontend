<script setup lang="ts">
import BookCard from '@/components/BookCard.vue'
import NoDataFound from '@/components/NoDataFound.vue'

import { computed, onMounted, ref, watch } from 'vue'
import { useBookStore, useCartStore, useSearchStore } from '@/stores'
import { useSnackbar } from '@/composables/useSnackbar'
import { useGlobalLoading } from '@/composables/useGlobalLoading'

const bookStore = useBookStore()
const cartStore = useCartStore()
const snackbar = useSnackbar()
const { getBooks, setKeyword } = bookStore
const books = computed(() => bookStore.books)
const totalPages = computed(() => bookStore.pagination.totalPages)
const currentPage = ref(bookStore.pagination.page)
const searchStore = useSearchStore()
const { addToCart } = cartStore

// 滾動到頁面頂部
const scrollToTop = () => window.scrollTo({ top: 0 })
const { startLoading, stopLoading } = useGlobalLoading()

onMounted(async () => {
  startLoading()
  setKeyword('')
  currentPage.value = 1
  await getBooks({ page: 1 })
  stopLoading()
})

const handlePageChange = async (newPage: number) => {
  startLoading()
  // 底層自動幫忙改變 currentPage
  await getBooks({ page: newPage })
  scrollToTop()
  stopLoading()
}

const handleAddToCart = (id: number) => {
  if (addToCart(id, 1)) {
    snackbar.show('商品添加成功', 'success')
  } else {
    snackbar.show('商品已加入', 'warning')
  }
}

watch(
  () => searchStore.keyword,
  async (keyword) => {
    console.log('watch')
    currentPage.value = 1
    setKeyword(keyword)
    await getBooks({ page: currentPage.value })
    scrollToTop()
  },
)
</script>

<template>
  <v-container v-if="books && books.length" fluid>
    <v-row>
      <v-col v-for="book in books" :key="book.id" cols="12" sm="4" md="3" lg="2">
        <BookCard :book @addToCart="handleAddToCart"></BookCard>
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
