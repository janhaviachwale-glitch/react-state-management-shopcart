import { useMachine } from '@xstate/react'
import { useCartStore } from '../store/cartStore'
import { checkoutMachine } from '../machines/checkoutMachine'
import CartItemsList from './CartItemsList'

interface CartDrawerProps {
  onClose: () => void
}

function CartDrawer({ onClose }: CartDrawerProps) {
  const [snapshot, send] = useMachine(checkoutMachine)

  const cartItems = useCartStore((state) => state.cartItems)

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0,
  )

  const isCheckingOut = snapshot.matches('processing')
  const isSuccessful = snapshot.matches('success')
  const isFailed = snapshot.matches('failure')
  const isCancelled = snapshot.matches('cancelled')

  const handleCheckout = () => {
    send({ type: 'CHECKOUT' })
  }

  const handleCancelCheckout = () => {
    send({ type: 'CANCEL' })
  }

  const handleRetry = () => {
    send({ type: 'RETRY' })
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

          {isCheckingOut && (
            <p>Processing your order...</p>
          )}

          {isSuccessful && (
            <p className="success">
              {snapshot.context.result?.message}
            </p>
          )}

          {isFailed && (
            <p className="error">
              {snapshot.context.error}
            </p>
          )}

          {isCancelled && (
            <p className="success">
              Checkout cancelled.
            </p>
          )}

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

          {isFailed && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={cartItems.length === 0}
            >
              Try Again
            </button>
          )}
        </div>
      </aside>
    </div>
  )
}

export default CartDrawer