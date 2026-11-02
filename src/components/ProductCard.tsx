import { useAtomValue, useSetAtom } from 'jotai'
import type { Product } from '../types'
import {
  addToCartAtom,
  cartItemsAtom,
} from '../store/cartAtoms'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const addToCart = useSetAtom(addToCartAtom)
  const cartItems = useAtomValue(cartItemsAtom)

  const cartItem = cartItems.find(
    (item) => item.product.id === product.id,
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