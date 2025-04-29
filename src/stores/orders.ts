import { fetchOrders } from '@/api'
import type { OrderListResponse, OrdersQueryParams, OrderSummary } from '@/api/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrdersStore = defineStore('ordersStore', () => {
  const orders = ref<OrderSummary[]>([])
  const pagination = ref({
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  })

  const _updatePagination = (data: OrderListResponse) => {
    pagination.value.totalCount = data.totalCount
    pagination.value.page = data.page
    pagination.value.pageSize = data.pageSize
    pagination.value.totalPages = data.totalPages
  }

  const getOrders = async (externalParams: OrdersQueryParams = {}) => {
    // 確保前端頁面分頁的顯示
    const queryParams: OrdersQueryParams = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }

    const data: OrderListResponse = await fetchOrders({
      ...queryParams,
      ...externalParams,
    })

    orders.value = data.items
    _updatePagination(data)
  }

  // const getOrderDetail = async (id: string | number) => {
  //   orderDetail.value = await fetchOrderById(id)
  // }

  return {
    orders,
    pagination,
    getOrders,
    // getOrderDetail,
  }
})
