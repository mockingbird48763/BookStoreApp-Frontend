<template>
  <v-container class="py-8">
    <template v-if="book">
      <v-row align="center" justify="center">
        <v-col cols="12" md="12" lg="9">
          <v-card class="rounded-2xl elevation-3 overflow-hidden">
            <v-row no-gutters>
              <!-- 書籍圖片 -->
              <v-col cols="12" md="5">
                <v-img
                  :src="`/images/${book.imagePath}`"
                  :alt="book.title"
                  height="100%"
                  class="h-100 w-100 rounded-0"
                  cover
                />
              </v-col>

              <!-- 書籍詳情 -->
              <v-col cols="12" md="7" class="pa-8 d-flex flex-column justify-space-between">
                <div>
                  <v-card-title class="text-h4 font-weight-bold mb-4">
                    {{ book.title }}
                  </v-card-title>

                  <v-card-subtitle class="text-subtitle-2 mb-6 text-grey-darken-2">
                    <span class="d-block mt-2">作者：{{ book.authorName }}<br /></span>
                    <span class="d-block mt-2">出版社：{{ book.publisherName }}<br /></span>
                    <span class="d-block mt-2">出版日期：{{ book.publicationDate }}</span>
                  </v-card-subtitle>

                  <v-card-text class="text-body-1 mb-6">
                    {{ book.description }}
                  </v-card-text>

                  <v-divider class="my-4"></v-divider>

                  <v-card-text class="text-body-1 mb-6">
                    <div class="mb-2">
                      <strong>定價：</strong>
                      <span class="text-decoration-line-through">{{ book.listPrice }} 元</span>
                    </div>
                    <div class="mb-2">
                      <strong class="display-1">優惠價：</strong>
                      <span class="text-red-accent-3 font-weight-bold" style="font-size: 1.2rem">
                        {{ Math.round(book.listPrice * (book.discount / 100)) }} 元
                      </span>
                    </div>
                    <div class="mb-2"><strong>庫存：</strong> {{ book.stock }} 本</div>
                  </v-card-text>
                </div>

                <v-card-actions class="mt-6 d-flex justify-end">
                  <v-btn color="green" size="large" variant="flat" @click="goBack()"
                    >返回上頁</v-btn
                  >
                  <v-btn
                    v-if="book.stock > 0"
                    color="primary"
                    size="large"
                    variant="flat"
                    @click="handleAddToCart(book.id)"
                  >
                    加入購物車
                  </v-btn>
                  <v-btn v-else color="error" size="large" variant="flat" disabled> 完售 </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <NoDataFound />
    </template>
  </v-container>
</template>
<script setup lang="ts">
import NoDataFound from '@/components/NoDataFound.vue'
import { useBookStore, useCartStore } from '@/stores'
import { computed, onMounted } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useRouter } from 'vue-router'
import { useGlobalLoading } from '@/composables/useGlobalLoading'

const props = defineProps<{
  id: string
}>()
const bookStore = useBookStore()
const cartStore = useCartStore()
const { startLoading, stopLoading } = useGlobalLoading()
const router = useRouter()
const { addToCart } = cartStore
const snackbar = useSnackbar()
const book = computed(() => bookStore.bookDetail)
const handleAddToCart = async (id: number) => {
  if (addToCart(id, 1)) {
    snackbar.show('商品添加成功', 'success')
  } else {
    snackbar.show('商品已加入', 'warning')
  }
}
const goBack = async () => {
  await router.back()
}

onMounted(async () => {
  startLoading()
  await bookStore.getBookDetail(props.id)
  stopLoading()
})
</script>

<style scoped></style>
