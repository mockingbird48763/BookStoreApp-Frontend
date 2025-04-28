<template>
  <v-container class="d-flex flex-column align-center justify-start" style="min-height: 100vh">
    <v-table
      height="auto"
      fixed-header
      class="elevation-1"
      style="
        max-width: 960px;
        width: 100%;
        background-color: white;
        border-radius: 12px;
        overflow: hidden;
      "
    >
      <thead class="cart-table-header">
        <tr>
          <!-- 單獨設定圖片欄位 -->
          <th style="width: 160px" class="text-center"></th>
          <th v-for="(thead, index) in theads.slice(1)" :key="index" class="text-center">
            {{ thead }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- 如果 cartItems 為空，顯示一張圖片，並合併所有欄位 -->
        <tr v-if="Object.keys(cartItems).length === 0">
          <td colspan="7" class="text-center">
            <v-img :src="noDataUrl" width="300" height="300" contain class="mx-auto"></v-img>
            <div class="mb-4">購物車目前沒有任何商品</div>
          </td>
        </tr>
        <!-- 如果 cartItems 有內容，顯示正常的商品列表 -->
        <tr v-for="(item, id) in cartItems" :key="id" class="text-center">
          <td style="width: 160px; cursor: pointer" @click="goBooks(item.id)">
            <v-img
              v-if="cartItemDetails[id]?.imagePath"
              :src="`/images/${cartItemDetails[id]?.imagePath}`"
              width="128"
              height="128"
              contain
              class="mx-auto"
            ></v-img>
          </td>
          <td>
            <span @click="goBooks(item.id)" class="link-text">{{
              cartItemDetails[id]?.title
            }}</span>
          </td>
          <td>{{ cartItemDetails[id]?.unitPrice }}</td>
          <td>
            <v-text-field
              v-model.number="item.quantity"
              type="number"
              min="1"
              :max="cartItemDetails[id]?.stock"
              outlined
              dense
              hide-details
              style="max-width: 80px"
              class="mx-auto"
              @change="handleUpdateQuantity(id, item.quantity, cartItemDetails[id]?.stock)"
              :disabled="cartItemDetails[id]?.stock === 0"
            ></v-text-field>
          </td>
          <td>{{ item.quantity * cartItemDetails[id]?.unitPrice }}</td>
          <td>
            <v-chip
              :color="cartItemDetails[id]?.stock > 0 ? 'success' : 'error'"
              text-color="white"
            >
              {{ cartItemDetails[id]?.stock > 0 ? `有貨 (${cartItemDetails[id]?.stock})` : '無貨' }}
            </v-chip>
          </td>
          <td>
            <v-btn icon color="error" @click="handleDelete(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-divider class="my-6" style="width: 100%; max-width: 960px"></v-divider>

    <div style="max-width: 960px; width: 100%">
      <div class="mb-2">共 {{ totalItems }} 項商品，數量 {{ totalQuantity }} 個</div>
      <div class="text-h6 font-weight-bold text-primary">金額小計: NT$ {{ totalAmount }} 元</div>
      <v-btn
        color="primary"
        size="large"
        class="mt-4"
        :disabled="Object.keys(cartItems).length === 0"
      >
        <v-icon left>mdi-cart-arrow-right</v-icon>
        前往結帳
      </v-btn>
    </div>
  </v-container>
</template>
<script setup lang="ts">
import { useSnackbar } from '@/composables/useSnackbar'
import { useCartStore } from '@/stores'
import { computed, onMounted } from 'vue'
import noDataUrl from '@/assets/no-data.svg'
import router from '@/router'
import { RouteNames } from '@/router/const'

const theads = ['', '商品名稱', '優惠價', '數量', '小計', '庫存', '']

const cartStore = useCartStore()
const snackbar = useSnackbar()
const { loadCartItems, removeFromCart } = cartStore
// computed 不可以解構，需要直接使用 store 獲取，保持 ref
const cartItems = computed(() => cartStore.cartItems)
const cartItemDetails = computed(() => cartStore.cartItemDetails)
const totalQuantity = computed(() => cartStore.totalQuantity)
const totalItems = computed(() => cartStore.totalItems)
const totalAmount = computed(() => cartStore.totalAmount)

onMounted(async () => {
  await loadCartItems()
})

const handleDelete = (id: number) => {
  removeFromCart(id)
  snackbar.show('商品已刪除', 'success')
  return
}

const goBooks = async (id: number) => {
  await router.push({ name: RouteNames.BOOK_DETAIL, params: { id } })
}

const handleUpdateQuantity = (id: number, newQuantity: number, stock: number) => {
  if (newQuantity > stock) {
    newQuantity = stock
    snackbar.show('數量超過庫存', 'error')
    cartStore.updateQuantity(id, newQuantity)
    return
  }
  if (newQuantity <= 0) {
    newQuantity = 1
    snackbar.show('數量不能小於 0', 'error')
    cartStore.updateQuantity(id, newQuantity)
    return
  }
  cartStore.updateQuantity(id, newQuantity)
  snackbar.show('數量已更新', 'success')
}
</script>
<style scoped>
.v-table thead {
  background-color: #bbdefb;
}

.v-table th,
.v-table td {
  border-bottom: 1px solid #dbe4f0;
  padding: 12px;
  color: #1e3a8a;
  font-weight: 500;
  font-size: 15px;
}

.v-table th {
  font-weight: 700;
  font-size: 16px;
}

.v-table tbody tr:hover {
  background-color: #eef6fc;
}

.v-table.v-table--fixed-header > .v-table__wrapper > table > thead.cart-table-header > tr > th {
  background-color: #e4e4e4; /* 表頭明顯的淺藍色 */
  color: #2a2a2a;
}

.link-text {
  text-decoration: none;
  cursor: pointer; /* 顯示手勢圖標 */
}

.link-text:hover {
  text-decoration: underline; /* hover 時顯示底線 */
}
</style>
