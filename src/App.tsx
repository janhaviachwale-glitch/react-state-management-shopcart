import { useEffect, useState } from 'react'
import type { Product } from './types'
import './App.css'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        <h1>ShopCart</h1>
        <p>Simple shopping, smarter checkout.</p>
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
                <article className="product-card" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <span className="category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <strong>₹{product.price.toLocaleString('en-IN')}</strong>
                    <p>Available stock: {product.stock}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>ShopCart State Management Assignment</p>
      </footer>
    </div>
  )
}

export default App
