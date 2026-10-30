import { useCartStore } from '../store/cartStore'

function CartItemsList() {
  const cartItems = useCartStore((state) => state.cartItems)
  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity,
  )
  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity,
  )
  const removeFromCart = useCartStore(
    (state) => state.removeFromCart,
  )

  if (cartItems.length === 0) {
    return <p className="empty-cart">Your cart is empty.</p>
  }

  return (
    <div className="cart-items-list">
      {cartItems.map((item) => (
        <article className="cart-item" key={item.product.id}>
          <img
            src={item.product.image}
            alt={item.product.name}
          />

          <div className="cart-item-info">
            <h3>{item.product.name}</h3>

            <p>
              ₹{item.product.price.toLocaleString('en-IN')}
            </p>

            <div className="quantity-controls">
              <button
                type="button"
                onClick={() => decreaseQuantity(item.product.id)}
                aria-label={`Decrease ${item.product.name} quantity`}
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                type="button"
                onClick={() => increaseQuantity(item.product.id)}
                disabled={item.quantity >= item.product.stock}
                aria-label={`Increase ${item.product.name} quantity`}
              >
                +
              </button>
            </div>

            <p>
              Subtotal: ₹
              {(item.product.price * item.quantity).toLocaleString('en-IN')}
            </p>

            <button
              type="button"
              onClick={() => removeFromCart(item.product.id)}
            >
              Remove
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default CartItemsList