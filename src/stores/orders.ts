import { fetchOrderById, fetchOrders } from '@/api'
import type { OrderDetail, OrderListResponse, OrdersQueryParams, OrderSummary } from '@/api/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrdersStore = defineStore('ordersStore', () => {
  const orders = ref<OrderSummary[]>([])
  const orderDetail = ref<OrderDetail>({} as OrderDetail)
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

  const getOrderDetailById = async (id: number | string) => {
    const data = await fetchOrderById(id)
    orderDetail.value = data
  }

  return {
    orders,
    orderDetail,
    pagination,
    getOrders,
    getOrderDetailById,
  }
})
