<template>
  <v-card class="book-card mx-auto" max-width="300" :to="`/books/${props.book.id}`">
    <div class="position-relative">
      <v-img :src="`/images/${props.book.imagePath}`" height="400" class="rounded-t" cover />
      <!-- 斜角標籤 -->
      <div class="discount-ribbon" v-if="props.book.discount > 0">
        {{ Math.round(props.book.discount) }} 折
      </div>
    </div>

    <v-card-text class="pb-1">
      <div class="text-subtitle-1 font-weight-medium">
        {{ props.book.title }}
      </div>
      <div class="text-caption text-grey mt-1">
        原價：<s>{{ props.book.listPrice }} 元</s>
      </div>
      <div class="text-body-1 text-primary font-weight-bold">
        售價：{{ Math.round((props.book.listPrice * props.book.discount) / 100) }} 元
      </div>
    </v-card-text>

    <!-- 調整 v-card-actions 使按鈕靠右 -->
    <v-card-actions class="d-flex justify-end p-0">
      <v-btn
        color="primary"
        @click.stop.prevent="emitAddToCart(props.book.id)"
        block
        class="mt-1 rounded-lg book-card-add-to-cart-btn"
      >
        <v-icon size="24">mdi-cart</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { type BookSummary } from '@/api/types'
const props = defineProps<{
  book: BookSummary
}>()

const emit = defineEmits<{
  (event: 'addToCart', id: number): void
}>()

const emitAddToCart = (id: number) => {
  emit('addToCart', id)
}
</script>

<style>
.discount-ribbon {
  position: absolute;
  top: 12px;
  left: -40px;
  background-color: #e53935; /* 紅色 */
  color: white;
  padding: 4px 50px;
  font-weight: bold;
  font-size: 0.75rem;
  transform: rotate(-45deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 1;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
  cursor: pointer;
}

.discount-ribbon:hover {
  transform: rotate(-45deg) scale(1.1);
  filter: brightness(1.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.book-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.book-card-add-to-cart-btn {
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.book-card-add-to-cart-btn:hover {
  background-color: rgba(146, 219, 255, 0.5);
}

.book-card-add-to-cart-btn .v-icon {
  transition: color 0.2s ease;
}

.book-card-add-to-cart-btn:hover .v-icon {
  color: #f3f8ff;
}
</style>
