<template>
  <v-container class="pa-0">
    <v-card class="pa-4">
      <!-- 卡片標題 -->
      <v-card-title class="text-h6">過濾器</v-card-title>
      <!-- 分隔線 -->
      <v-divider class="mb-4" />
      <!-- 表單欄位 -->
      <!-- dense 讓 v-col 上下間距縮小 -->
      <v-row dense>
        <v-col cols="6" sm="4">
          <v-text-field label="會員 ID" v-model="orderFilter.memberId" />
        </v-col>

        <v-col cols="6" sm="4">
          <v-text-field label="起始日期" type="date" v-model="orderFilter.startDate" />
        </v-col>

        <v-col cols="6" sm="4">
          <v-text-field label="結束日期" type="date" v-model="orderFilter.endDate" />
        </v-col>

        <v-col v-for="field in selectFields" :key="field.key" cols="6" sm="3">
          <v-select
            :label="field.label"
            :items="field.items"
            v-model="orderFilter[field.key as keyof typeof orderFilter]"
            item-title="title"
            item-value="value"
          />
        </v-col>
      </v-row>

      <v-btn class="mt-2 mr-2" color="primary" @click="handleSerach()">搜尋</v-btn>

      <v-btn class="mt-2" color="error" @click="handleReset()">重置</v-btn>
    </v-card>
  </v-container>
  <v-container
    class="d-flex flex-column align-center justify-start pa-0 pt-4"
    style="min-height: 100vh"
  >
    <v-table
      height="auto"
      fixed-header
      class="elevation-1"
      style="width: 100%; background-color: white; border-radius: 12px; overflow: hidden"
    >
      <thead class="orders-table-header">
        <tr>
          <th
            v-for="(thead, index) in theads"
            :key="index"
            class="text-center"
            :style="index === 0 ? 'width: 120px' : ''"
          >
            {{ thead }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- 如果為空，顯示一張圖片，並合併所有欄位 -->
        <tr v-if="items.length === 0">
          <td :colspan="theads.length" class="text-center">
            <v-img :src="noDataUrl" width="300" height="300" contain class="mx-auto"></v-img>
            <div class="mb-4">查無結果</div>
          </td>
        </tr>
        <!-- 如果有內容，顯示正常內容 -->
        <tr
          v-for="(item, id) in items"
          :key="id"
          class="text-center cursor-pointer"
          @click="handleViewDetails(item.id)"
        >
          <td>{{ item.memberId }}</td>
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
import { computed, onMounted, ref } from 'vue'
import OrderDetailDialog from '@/components/OrderDetailDialog.vue'
import { useOrdersStore } from '@/stores/orders'
import { scrollToTop } from '@/utils/ScrollUtils'
import { DateUtils } from '@/utils/TimeUtils'
import {
  OrderStatusUtils,
  PaymentStatusUtils,
  PaymentMethodUtils,
  ShippingMethodUtils,
  OrderStatusDetails,
  PaymentMethodDetails,
  PaymentStatusDetails,
} from '@/api/enums'
import StatusIconWithTooltip from '@/components/StatusIconWithTooltip.vue'
import { ShippingMethodDetails, createOptionsFromDetails } from '@/api/enums'
import type { OrdersQueryParams } from '@/api/types'

const isModalOpen = ref(false)
const ordersStore = useOrdersStore()
const { getOrders, getOrderDetailById } = ordersStore
const items = computed(() => ordersStore.orders)
const currentPage = computed(() => ordersStore.pagination.page)
const totalPages = computed(() => ordersStore.pagination.totalPages)
const orderDetail = computed(() => ordersStore.orderDetail)

const orderFilter = ref({
  memberId: undefined,
  orderStatus: undefined,
  paymentStatus: undefined,
  paymentMethod: undefined,
  shippingMethod: undefined,
  startDate: undefined,
  endDate: undefined,
})

const selectFields = [
  {
    key: 'orderStatus',
    label: '訂單狀態',
    items: createOptionsFromDetails(OrderStatusDetails),
  },
  {
    key: 'paymentStatus',
    label: '付款狀態',
    items: createOptionsFromDetails(PaymentStatusDetails),
  },
  {
    key: 'paymentMethod',
    label: '付款方式',
    items: createOptionsFromDetails(PaymentMethodDetails),
  },
  {
    key: 'shippingMethod',
    label: '配送方式',
    items: createOptionsFromDetails(ShippingMethodDetails),
  },
]

const theads = [
  '會員編號',
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
  isModalOpen.value = true
}

const handlePageChange = async (newPage: number) => {
  await getOrders({ page: newPage })
  scrollToTop()
}

const handleSerach = async () => {
  await getOrders({
    page: 1,
    ...mapToOrdersQueryParams(orderFilter.value),
  })
  scrollToTop()
}

const handleReset = async () => {
  Object.assign(orderFilter.value, {
    memberId: undefined,
    orderStatus: undefined,
    paymentStatus: undefined,
    paymentMethod: undefined,
    shippingMethod: undefined,
    startDate: undefined,
    endDate: undefined,
  })
}

const formatDate = (dateStr: string) => {
  return DateUtils.formatDate(dateStr)
}

const mapToOrdersQueryParams = (filter: typeof orderFilter.value): OrdersQueryParams => {
  return {
    memberId: filter.memberId ? Number(filter.memberId) : undefined,
    orderStatus: filter.orderStatus || undefined,
    paymentStatus: filter.paymentStatus || undefined,
    paymentMethod: filter.paymentMethod || undefined,
    shippingMethod: filter.shippingMethod || undefined,
    startDate: filter.startDate || undefined,
    endDate: filter.endDate || undefined,
  }
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
