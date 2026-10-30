export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  productId: number
  name: string
  price: number
  quantity: number
}

export interface Order {
  id?: number
  items: OrderItem[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
}

export interface CheckoutResult {
  success: boolean
  message: string
  order?: Order
}
