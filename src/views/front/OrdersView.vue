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
      <thead class="orders-table-header">
        <tr>
          <th v-for="(thead, index) in theads" :key="index" class="text-center">
            {{ thead }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- 如果 cartItems 為空，顯示一張圖片，並合併所有欄位 -->
        <tr v-if="items.length === 0">
          <td colspan="7" class="text-center">
            <v-img :src="noDataUrl" width="300" height="300" contain class="mx-auto"></v-img>
            <div class="mb-4">目前沒有任何訂單</div>
          </td>
        </tr>
        <!-- 如果 cartItems 有內容，顯示正常的商品列表 -->
        <tr
          v-for="(item, id) in items"
          :key="id"
          class="text-center"
          @click="handleViewDetails(item.id)"
        >
          <td>
            {{ item.orderNumber }}
          </td>
          <td>
            {{ item.totalPrice }}
          </td>
          <td>
            <StatusIconWithTooltip
              :icon="OrderStatusUtils.getIcon(item.orderStatus)"
              :color="OrderStatusUtils.getColor(item.orderStatus)"
              :label="OrderStatusUtils.getLabel(item.orderStatus)"
            ></StatusIconWithTooltip>
          </td>
          <td>
            <StatusIconWithTooltip
              :icon="PaymentStatusUtils.getIcon(item.paymentStatus)"
              :color="PaymentStatusUtils.getColor(item.paymentStatus)"
              :label="PaymentStatusUtils.getLabel(item.paymentStatus)"
            ></StatusIconWithTooltip>
          </td>
          <td>
            <StatusIconWithTooltip
              :icon="PaymentMethodUtils.getIcon(item.paymentMethod)"
              :color="PaymentMethodUtils.getColor(item.paymentMethod)"
              :label="PaymentMethodUtils.getLabel(item.paymentMethod)"
            ></StatusIconWithTooltip>
          </td>
          <td>
            <StatusIconWithTooltip
              :icon="ShippingMethodUtils.getIcon(item.shippingMethod)"
              :color="ShippingMethodUtils.getColor(item.shippingMethod)"
              :label="ShippingMethodUtils.getLabel(item.shippingMethod)"
            ></StatusIconWithTooltip>
          </td>
          <td>
            {{ formatDate(item.createdAt) }}
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      circle
      class="mt-4"
      @update:model-value="handlePageChange"
      :total-visible="10"
    ></v-pagination>

    <!-- Modal（根據路由決定是否打開）-->
    <OrderDetailDialog
      v-model:active="isModalOpen"
      v-model:order-detail="orderDetail"
    ></OrderDetailDialog>
  </v-container>
</template>

<script setup lang="ts">
import noDataUrl from '@/assets/no-data.svg'
import { computed, nextTick, onMounted, ref } from 'vue'
import OrderDetailDialog from '@/components/OrderDetailDialog.vue'
import { useOrdersStore } from '@/stores/orders'
import { scrollToTop } from '@/utils/ScrollUtils'
import { DateUtils } from '@/utils/TimeUtils'
import {
  OrderStatusUtils,
  PaymentStatusUtils,
  PaymentMethodUtils,
  ShippingMethodUtils,
} from '@/api/enums'
import StatusIconWithTooltip from '@/components/StatusIconWithTooltip.vue'

const isModalOpen = ref(false)
const ordersStore = useOrdersStore()
const { getOrders, getOrderDetailById } = ordersStore
const items = computed(() => ordersStore.orders)
const currentPage = computed(() => ordersStore.pagination.page)
const totalPages = computed(() => ordersStore.pagination.totalPages)
const orderDetail = computed(() => ordersStore.orderDetail)

const theads = [
  '訂單編號',
  '總金額',
  '訂單狀態',
  '付款狀態',
  '付款方式',
  '運送方式',
  '訂單成立時間',
]

const handleViewDetails = async (id: number | string) => {
  await getOrderDetailById(id)
  await nextTick()
  isModalOpen.value = true
}

const handlePageChange = async (newPage: number) => {
  await getOrders({ page: newPage })
  scrollToTop()
}

const formatDate = (dateStr: string) => {
  return DateUtils.formatDate(dateStr)
}

onMounted(async () => {
  await getOrders()
})
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

.v-table.v-table--fixed-header > .v-table__wrapper > table > thead.orders-table-header > tr > th {
  background-color: #e4e4e4;
  color: #2a2a2a;
}
</style>
