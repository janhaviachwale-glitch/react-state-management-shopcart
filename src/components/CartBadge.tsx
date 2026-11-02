import { useAtomValue } from 'jotai'
import { cartCountAtom } from '../store/cartAtoms'

interface CartBadgeProps {
  onClick: () => void
}

function CartBadge({ onClick }: CartBadgeProps) {
  const cartCount = useAtomValue(cartCountAtom)

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