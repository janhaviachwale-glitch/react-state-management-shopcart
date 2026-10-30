import { create } from 'zustand'
import type {
  CartItem,
  CheckoutResult,
  Order,
  Product,
} from '../types'

interface CartStore {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  increaseQuantity: (productId: number) => void
  decreaseQuantity: (productId: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  checkout: (signal: AbortSignal) => Promise<CheckoutResult>
}

export const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],

  addToCart: (product) => {
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.product.id === product.id,
      )

      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity + 1,
                    product.stock,
                  ),
                }
              : item,
          ),
        }
      }

      if (product.stock <= 0) {
        return state
      }

      return {
        cartItems: [
          ...state.cartItems,
          { product, quantity: 1 },
        ],
      }
    })
  },

  increaseQuantity: (productId) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                item.product.stock,
              ),
            }
          : item,
      ),
    }))
  },

  decreaseQuantity: (productId) => {
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    }))
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => item.product.id !== productId,
      ),
    }))
  },

  clearCart: () => {
    set({ cartItems: [] })
  },

  checkout: async (signal) => {
    const { cartItems } = get()

    if (cartItems.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty.',
      }
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    )

    const order: Order = {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      total,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
      signal,
    })

    if (!response.ok) {
      throw new Error('Checkout failed. Please try again.')
    }

    const savedOrder: Order = await response.json()

    set({ cartItems: [] })

    return {
      success: true,
      message: 'Order placed successfully!',
      order: savedOrder,
    }
  },
}))