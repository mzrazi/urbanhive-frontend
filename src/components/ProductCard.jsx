import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter } from './ui/card'
import { ShoppingCart } from 'lucide-react'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount}% OFF
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{product.vendor}</p>
            </div>
            <div className="text-right">
              {product.discount > 0 ? (
                <div>
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="ml-1 font-semibold text-red-600">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-semibold">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="text-sm">
            {product.inStock ? (
              <span className="text-urbanhive-600">In Stock</span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </div>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}

export default ProductCard