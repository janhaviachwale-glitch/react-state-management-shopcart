import { useCartStore } from '../store/cartStore'

interface CartBadgeProps {
  onClick: () => void
}

function CartBadge({ onClick }: CartBadgeProps) {
  const cartCount = useCartStore((state) =>
    state.cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
  )

  return (
    <button
      type="button"
      className="cart-badge"
      onClick={onClick}
      aria-label={`Open cart, ${cartCount} items`}
    >
      <span>Cart</span>
      <span className="cart-count">{cartCount}</span>
    </button>
  )
}

export default CartBadge