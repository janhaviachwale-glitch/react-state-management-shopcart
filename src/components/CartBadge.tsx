import { useCart } from '../context/CartContext'

interface CartBadgeProps {
  onClick: () => void
}

function CartBadge({ onClick }: CartBadgeProps) {
  const { cartCount } = useCart()

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