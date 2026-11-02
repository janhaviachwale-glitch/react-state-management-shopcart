import { useAtomValue, useSetAtom } from 'jotai'
import { useRef, useState } from 'react'
import {
  cartItemsAtom,
  cartTotalAtom,
  checkoutAtom,
} from '../store/cartAtoms'
import CartItemsList from './CartItemsList'

interface CartDrawerProps {
  onClose: () => void
}

function CartDrawer({ onClose }: CartDrawerProps) {
  const cartItems = useAtomValue(cartItemsAtom)
  const cartTotal = useAtomValue(cartTotalAtom)
  const checkout = useSetAtom(checkoutAtom)

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const controllerRef = useRef<AbortController | null>(null)

  const handleCheckout = async () => {
    const controller = new AbortController()
    controllerRef.current = controller

    setIsCheckingOut(true)
    setMessage('')
    setError('')

    try {
      const result = await checkout(controller.signal)

      if (result.success) {
        setMessage(result.message)
      } else {
        setError(result.message)
      }
    } catch (err) {
      if (controller.signal.aborted) {
        setMessage('Checkout cancelled.')
      } else {
        setError(
          err instanceof Error ? err.message : 'Checkout failed.',
        )
      }
    } finally {
      setIsCheckingOut(false)
      controllerRef.current = null
    }
  }

  const handleCancelCheckout = () => {
    controllerRef.current?.abort()
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(event) => event.stopPropagation()}
        aria-label="Shopping cart"
      >
        <div className="cart-drawer-header">
          <h2>Your Cart</h2>

          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <CartItemsList />

        <div className="cart-drawer-footer">
          <h3>
            Total: ₹{cartTotal.toLocaleString('en-IN')}
          </h3>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || isCheckingOut}
          >
            {isCheckingOut ? 'Processing...' : 'Checkout'}
          </button>

          {isCheckingOut && (
            <button
              type="button"
              onClick={handleCancelCheckout}
            >
              Cancel Checkout
            </button>
          )}
        </div>
      </aside>
    </div>
  )
}

export default CartDrawer