import { fetchBooksForCartById, fetchCreateOrder } from '@/api'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import type { CartItemDetail, CreateOrderPayload } from '@/api/types'

export interface CartItem {
  id: number
  quantity: number
}

export const useCartStore = defineStore('cartStore', () => {
  const cartItems = reactive<Record<number, CartItem>>({})
  const cartItemDetails = reactive<Record<number, CartItemDetail>>({})
  const CART_ITEMS_KEY = 'cartItems' // 定義 storage key

  const addToCart = (id: number, quantity: number): boolean => {
    if (isInCart(id)) return false
    cartItems[id] = { id, quantity }
    saveCartItems(cartItems)
    return true
  }

  const isInCart = (id: number) => {
    return id in cartItems
  }

  const saveCartItems = (cartItems: Record<number, CartItem>) => {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems))
  }

  const getCartItems = (): Record<number, CartItem> | null => {
    const storedCartItems = localStorage.getItem(CART_ITEMS_KEY)
    return storedCartItems ? JSON.parse(storedCartItems) : null
  }

  const loadCartItems = async () => {
    const storedCartItems = getCartItems()
    if (storedCartItems) {
      Object.assign(cartItems, storedCartItems)
      const ids = Object.keys(cartItems).map((id) => parseInt(id))
      if (ids.length === 0) return
      const dataArray = await fetchBooksForCartById(ids)
      const data: Record<number, CartItemDetail> = Object.fromEntries(
        dataArray.map((item) => [item.id, item]),
      )
      Object.assign(cartItemDetails, data)
    }
  }

  const removeFromCart = (id: number) => {
    // 從 cartItems 中刪除指定 id 的商品
    delete cartItems[id]
    saveCartItems(cartItems)
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    const cartItem = cartItems[id]
    cartItem.quantity = newQuantity
    saveCartItems(cartItems)
  }

  const totalItems = computed(() => Object.keys(cartItems).length)
  const totalQuantity = computed(() =>
    Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0),
  )

  const totalAmount = computed(() => {
    return Object.keys(cartItems).reduce((total, id) => {
      const item = cartItems[+id]
      const itemDetail = cartItemDetails[+id]
      if (itemDetail) {
        return total + item.quantity * itemDetail.unitPrice
      }
      return total
    }, 0)
  })

  const createOrder = async (payload: CreateOrderPayload) => {
    await fetchCreateOrder(payload)
  }

  const clearCart = () => {
    // 清空物件內容
    Object.keys(cartItems).forEach((key) => delete cartItems[Number(key)])
    Object.keys(cartItemDetails).forEach((key) => delete cartItemDetails[Number(key)])
    localStorage.removeItem(CART_ITEMS_KEY)
  }

  return {
    addToCart,
    cartItems,
    cartItemDetails,
    loadCartItems,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalQuantity,
    totalAmount,
    createOrder,
    clearCart,
  }
})
