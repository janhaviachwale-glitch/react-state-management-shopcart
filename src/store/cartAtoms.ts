import { atom } from 'jotai'
import type {
  CartItem,
  CheckoutResult,
  Order,
  Product,
} from '../types'

// Stores the cart items shared across components.
export const cartItemsAtom = atom<CartItem[]>([])

// Adds a product or increases its quantity.
export const addToCartAtom = atom(
  null,
  (get, set, product: Product) => {
    const cartItems = get(cartItemsAtom)
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id,
    )

    if (existingItem) {
      set(
        cartItemsAtom,
        cartItems.map((item) =>
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
      )
      return
    }

    if (product.stock <= 0) {
      return
    }

    set(cartItemsAtom, [
      ...cartItems,
      { product, quantity: 1 },
    ])
  },
)

// Increases quantity without exceeding stock.
export const increaseQuantityAtom = atom(
  null,
  (get, set, productId: number) => {
    const cartItems = get(cartItemsAtom)

    set(
      cartItemsAtom,
      cartItems.map((item) =>
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
  },
)

// Decreases quantity and removes an item at zero.
export const decreaseQuantityAtom = atom(
  null,
  (get, set, productId: number) => {
    const cartItems = get(cartItemsAtom)

    set(
      cartItemsAtom,
      cartItems
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  },
)

// Removes a product from the cart.
export const removeFromCartAtom = atom(
  null,
  (get, set, productId: number) => {
    set(
      cartItemsAtom,
      get(cartItemsAtom).filter(
        (item) => item.product.id !== productId,
      ),
    )
  },
)

// Clears the cart.
export const clearCartAtom = atom(null, (_get, set) => {
  set(cartItemsAtom, [])
})

// Derives the total quantity from the cart.
export const cartCountAtom = atom((get) =>
  get(cartItemsAtom).reduce(
    (total, item) => total + item.quantity,
    0,
  ),
)

// Derives the total price from the cart.
export const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0,
  ),
)

// Creates and submits an order to the local API.
export const checkoutAtom = atom(
  null,
  async (get, set, signal: AbortSignal): Promise<CheckoutResult> => {
    const cartItems = get(cartItemsAtom)

    if (cartItems.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty.',
      }
    }

    const total = get(cartTotalAtom)

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

    set(cartItemsAtom, [])

    return {
      success: true,
      message: 'Order placed successfully!',
      order: savedOrder,
    }
  },
)