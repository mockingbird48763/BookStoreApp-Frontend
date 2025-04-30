import { fetchOrderById, fetchOrderReport, fetchOrders, fetchUpdateOrder } from '@/api'
import type {
  OrderDetail,
  OrderListResponse,
  OrdersQueryParams,
  OrderSummary,
  OrderUpdatePayload,
} from '@/api/types'
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
    // 清除空字串或 undefined/null 的欄位
    const cleanedParams = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(externalParams).filter(([_, value]) => value !== '' && value != null),
    ) as OrdersQueryParams

    // 確保前端頁面分頁的顯示
    const queryParams: OrdersQueryParams = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }

    const data: OrderListResponse = await fetchOrders({
      ...queryParams,
      ...cleanedParams,
    })

    orders.value = data.items
    _updatePagination(data)
  }

  const getOrderDetailById = async (id: number | string) => {
    const data = await fetchOrderById(id)
    orderDetail.value = data
  }

  const updateOrderById = async (id: number, payload: OrderUpdatePayload) => {
    await fetchUpdateOrder(id, payload)
  }

  const downloadOrderReport = async (payload: OrdersQueryParams = {}) => {
    const cleanedParams = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(payload).filter(([_, value]) => value !== '' && value != null),
    ) as OrdersQueryParams
    const data = await fetchOrderReport({ ...cleanedParams })

    // 創建一個 URL 來指向 Blob
    const url = window.URL.createObjectURL(new Blob([data]))

    // 創建一個虛擬的 <a> 標籤
    const link = document.createElement('a')
    link.href = url

    // 設置下載文件名（根據需要改變）
    link.setAttribute('download', 'order_report.csv')

    // 觸發點擊事件，開始下載
    document.body.appendChild(link)
    link.click()

    // 清理 URL 對象
    window.URL.revokeObjectURL(url)
  }

  return {
    orders,
    orderDetail,
    pagination,
    getOrders,
    getOrderDetailById,
    updateOrderById,
    downloadOrderReport,
  }
})
