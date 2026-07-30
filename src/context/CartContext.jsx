import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '../hooks/use-toast'
import { useAuth } from './AuthContext'
import axios from 'axios'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const { toast } = useToast()
  const { user, userType } = useAuth()

  const refreshCart = async () => {
    if (!user?.id || userType !== 'customer') return setCart([])
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/${user.id}`)
      setCart(data.map((item) => ({ id: item.product?._id, name: item.product?.name, price: item.product?.price, quantity: item.quantity })))
    } catch {
      setCart([])
    }
  }

  useEffect(() => {
    refreshCart()
  }, [user?.id, userType])

  useEffect(() => {
    // Update totals when cart changes
    const items = cart.reduce((total, item) => total + item.quantity, 0)
    const price = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    
    setTotalItems(items)
    setTotalPrice(price)
    
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedCart = prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        
        toast({
          title: "Cart updated",
          description: `${product.name} quantity updated in cart`,
        })
        
        return updatedCart
      } else {
        // Add new item
        toast({
          title: "Added to cart",
          description: `${product.name} added to your cart`,
        })
        
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.id === productId)
      
      if (item) {
        toast({
          title: "Removed from cart",
          description: `${item.name} removed from your cart`,
        })
      }
      
      return prevCart.filter(item => item.id !== productId)
    })
  }

  const clearCart = () => {
    setCart([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  const value = {
    cart,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
