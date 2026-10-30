import type { Product } from '../types'
import { useCartStore } from '../store/cartStore'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart)

  const cartItem = useCartStore((state) =>
    state.cartItems.find(
      (item) => item.product.id === product.id,
    ),
  )

  const isOutOfStock = product.stock === 0
  const isLimitReached =
    (cartItem?.quantity ?? 0) >= product.stock

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />

      <div className="product-info">
        <span className="category">{product.category}</span>

        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <strong>
          ₹{product.price.toLocaleString('en-IN')}
        </strong>

        <p>Available stock: {product.stock}</p>

        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={isOutOfStock || isLimitReached}
        >
          {isOutOfStock
            ? 'Out of Stock'
            : isLimitReached
              ? 'Stock Limit Reached'
              : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard