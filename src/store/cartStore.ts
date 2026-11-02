import { create } from 'zustand'
import type { CartItem, Product } from '../types'

interface CartStore {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  increaseQuantity: (productId: number) => void
  decreaseQuantity: (productId: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
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
}))