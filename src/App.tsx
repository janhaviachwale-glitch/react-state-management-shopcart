import { useEffect, useState } from 'react'
import type { Product } from './types'
import ProductCard from './components/ProductCard'
import CartBadge from './components/CartBadge'
import CartDrawer from './components/CartDrawer'
import './App.css'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data: Product[] = await response.json()
        setProducts(data)
      } catch {
        setError('Could not load products. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>ShopCart</h1>
          <p>Simple shopping, smarter checkout.</p>
        </div>

        <CartBadge onClick={() => setIsCartOpen(true)} />
      </header>

      <main className="main">
        <section className="welcome">
          <h2>Welcome to ShopCart</h2>
          <p>Explore our products and add your favourites to the cart.</p>
        </section>

        <section className="products-section">
          <h2>Products</h2>

          {loading && <p>Loading products...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      {isCartOpen && (
        <CartDrawer onClose={() => setIsCartOpen(false)} />
      )}

      <footer className="footer">
        <p>ShopCart State Management</p>
      </footer>
    </div>
  )
}

export default App