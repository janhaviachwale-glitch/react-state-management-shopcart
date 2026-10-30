import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type {
  CartItem,
  CheckoutResult,
  Order,
  Product,
} from '../types'

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product) => void
  increaseQuantity: (productId: number) => void
  decreaseQuantity: (productId: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  checkout: (signal: AbortSignal) => Promise<CheckoutResult>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = useCallback((product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.stock),
              }
            : item,
        )
      }

      if (product.stock <= 0) return currentItems

      return [...currentItems, { product, quantity: 1 }]
    })
  }, [])

  const increaseQuantity = useCallback((productId: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
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
    )
  }, [])

  const decreaseQuantity = useCallback((productId: number) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ),
    [cartItems],
  )

  const checkout = useCallback(
    async (signal: AbortSignal): Promise<CheckoutResult> => {
      if (cartItems.length === 0) {
        return { success: false, message: 'Your cart is empty.' }
      }

      const order: Order = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        total: cartTotal,
        status: 'completed',
        createdAt: new Date().toISOString(),
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
        signal,
      })

      if (!response.ok) {
        throw new Error('Checkout failed. Please try again.')
      }

      const savedOrder: Order = await response.json()
      setCartItems([])

      return {
        success: true,
        message: 'Order placed successfully!',
        order: savedOrder,
      }
    },
    [cartItems, cartTotal],
  )

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      checkout,
    }),
    [
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      checkout,
    ],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}