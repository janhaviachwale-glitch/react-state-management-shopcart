import { assign, fromPromise, setup } from 'xstate'
import { useCartStore } from '../store/cartStore'
import type { CheckoutResult, Order } from '../types'

interface CheckoutContext {
  result: CheckoutResult | null
  error: string | null
}

type CheckoutEvent =
  | { type: 'CHECKOUT' }
  | { type: 'CANCEL' }
  | { type: 'RETRY' }
  | { type: 'RESET' }

const checkoutActor = fromPromise<CheckoutResult, void>(
  async ({ signal }) => {
    const cartItems = useCartStore.getState().cartItems

    if (cartItems.length === 0) {
      throw new Error('Your cart is empty.')
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

    return {
      success: true,
      message: 'Order placed successfully!',
      order: savedOrder,
    }
  },
)

export const checkoutMachine = setup({
  types: {
    context: {} as CheckoutContext,
    events: {} as CheckoutEvent,
  },
  actors: {
    checkoutActor,
  },
  guards: {
    hasCartItems: () =>
      useCartStore.getState().cartItems.length > 0,
  },
  actions: {
    clearCart: () => {
      useCartStore.getState().clearCart()
    },
    resetMessages: assign({
      result: null,
      error: null,
    }),
  },
}).createMachine({
  id: 'checkout',
  initial: 'idle',
  context: {
    result: null,
    error: null,
  },
  states: {
    idle: {
      on: {
        CHECKOUT: {
          target: 'validating',
          actions: 'resetMessages',
        },
      },
    },

    validating: {
      always: [
        {
          guard: 'hasCartItems',
          target: 'processing',
        },
        {
          target: 'failure',
          actions: assign({
            error: 'Your cart is empty.',
          }),
        },
      ],
    },

    processing: {
      invoke: {
        id: 'checkout',
        src: 'checkoutActor',
        onDone: {
          target: 'success',
          actions: assign({
            result: ({ event }) => event.output,
            error: null,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) =>
                event.error instanceof Error
                    ? event.error.message
                    : 'Checkout failed.',
            result: null,
          }),
        },
      },
      on: {
        CANCEL: {
          target: 'cancelled',
        },
      },
    },

    success: {
      entry: 'clearCart',
      on: {
        RESET: 'idle',
        CHECKOUT: {
          target: 'validating',
          actions: 'resetMessages',
        },
      },
    },

    failure: {
      on: {
        RETRY: {
          target: 'validating',
          actions: 'resetMessages',
        },
        CHECKOUT: {
          target: 'validating',
          actions: 'resetMessages',
        },
        RESET: 'idle',
      },
    },

    cancelled: {
      on: {
        RESET: 'idle',
        CHECKOUT: {
          target: 'validating',
          actions: 'resetMessages',
        },
      },
    },
  },
})