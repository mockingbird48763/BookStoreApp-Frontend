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
      <thead>
        <tr>
          <th colspan="4">
            訂單編號: {{ itemDetail.orderNumber }}
            <span style="margin-left: 2em">訂購時間: {{ itemDetail.createdAt }}</span>
          </th>
        </tr>
        <tr>
          <th v-for="(thead, index) in theads" :key="index" class="text-center">
            {{ thead }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="itemDetail.orderDetailItems.length === 0">
          <td colspan="4" class="text-center">
            <v-img :src="noDataUrl" width="300" height="300" contain class="mx-auto"></v-img>
            <div class="mb-4">目前沒有任何訂單</div>
          </td>
        </tr>
        <tr v-for="(item, id) in itemDetail.orderDetailItems" :key="id" class="text-center">
          <td>
            {{ item.bookName }}
          </td>
          <td>
            {{ item.unitPrice }}
          </td>
          <td>{{ item.quantity }}</td>
          <td>
            {{ item.unitPrice * item.quantity }}
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-container max-width="960px">
      <v-row>
        <!-- 上半部分（右對齊，佔滿剩餘空間） -->
        <v-col cols="12" md="6" class="d-flex justify-start">
          <div class="d-flex flex-column">
            <div>
              {{ itemDetail.orderStatus }}
            </div>
            <div>
              {{ itemDetail.paymentStatus }}
            </div>
            <div>
              {{ itemDetail.paymentMethod }}
            </div>
            <div>
              {{ itemDetail.shippingMethod }}
            </div>
            <div>
              {{ itemDetail.shippingAddress }}
            </div>
            <div>
              {{ itemDetail.shippingNote }}
            </div>
            <div>
              {{ itemDetail.memberEmail }}
            </div>
          </div>
        </v-col>

        <!-- 下半部分（左對齊，佔滿剩餘空間） -->
        <v-col cols="12" md="6" class="d-flex justify-end"
          ><div>金額小計: NT$ {{ 100 }} 元</div></v-col
        >
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import noDataUrl from '@/assets/no-data.svg'

const theads = ['商品名稱', '單價', '數量', '商品總額']

const itemDetail = {
  id: 22,
  orderNumber: '20250428_043712_6lmo',
  totalPrice: 190,
  orderStatus: 0,
  paymentStatus: 0,
  paymentMethod: 0,
  shippingMethod: 0,
  shippingAddress: '高雄市',
  shippingNote: '',
  createdAt: '2025-04-28T04:37:12.4189761',
  memberId: 1,
  memberEmail: 'admin@example.com',
  orderDetailItems: [
    {
      id: 66,
      unitPrice: 95,
      quantity: 2,
      bookId: 5,
      bookName: '深度學習基礎',
    },
    {
      id: 67,
      unitPrice: 95,
      quantity: 2,
      bookId: 5,
      bookName: '深度學習基礎',
    },
    {
      id: 68,
      unitPrice: 95,
      quantity: 2,
      bookId: 5,
      bookName: '深度學習基礎',
    },
    {
      id: 69,
      unitPrice: 95,
      quantity: 2,
      bookId: 5,
      bookName: '深度學習基礎',
    },
    {
      id: 66,
      unitPrice: 95,
      quantity: 2,
      bookId: 5,
      bookName: '深度學習基礎',
    },
  ],
}
</script>
