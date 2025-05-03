import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with an empty cart', () => {
    const cartStore = useCartStore()
    expect(cartStore.cartItems).toEqual([])
  })

  it('should add an item to the cart', () => {
    const cartStore = useCartStore()
    cartStore.addToCart(1, 2)
    expect(cartStore.cartItems).toEqual([{ id: 1, quantity: 2 }])
  })

  it('should not add the same item twice', () => {
    const cartStore = useCartStore()
    cartStore.addToCart(1, 2)
    cartStore.addToCart(1, 3)
    expect(cartStore.cartItems).toEqual([{ id: 1, quantity: 2 }])
  })
})
