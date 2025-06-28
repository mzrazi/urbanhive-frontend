import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import SearchBar from '../components/SearchBar'
import ProductGrid from '../components/ProductGrid'
import { ArrowRight, ShoppingBag, Truck, Shield } from 'lucide-react'

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [popularVendors, setPopularVendors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('https://api.example.com/products/featured')
        // const data = await response.json()
        
        // Simulated data
        const data = [
          {
            id: '1',
            name: 'Organic Vegetables Bundle',
            vendor: 'Fresh Farms',
            price: 24.99,
            originalPrice: 29.99,
            discount: 17,
            image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1789&q=80',
            inStock: true
          },
          {
            id: '2',
            name: 'Handcrafted Leather Wallet',
            vendor: 'Artisan Goods',
            price: 49.99,
            originalPrice: 49.99,
            discount: 0,
            image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
            inStock: true
          },
          {
            id: '3',
            name: 'Wireless Bluetooth Headphones',
            vendor: 'Tech World',
            price: 79.99,
            originalPrice: 99.99,
            discount: 20,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            inStock: true
          },
          {
            id: '4',
            name: 'Handmade Ceramic Mug Set',
            vendor: 'Pottery Studio',
            price: 34.99,
            originalPrice: 34.99,
            discount: 0,
            image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            inStock: true
          }
        ]
        
        setFeaturedProducts(data)
      } catch (error) {
        console.error('Error fetching featured products:', error)
      }
    }

    // Fetch popular vendors
    const fetchPopularVendors = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('https://api.example.com/vendors/popular')
        // const data = await response.json()
        
        // Simulated data
        const data = [
          {
            id: '1',
            name: 'Fresh Farms',
            category: 'Grocery',
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            rating: 4.8
          },
          {
            id: '2',
            name: 'Tech World',
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80',
            rating: 4.6
          },
          {
            id: '3',
            name: 'Fashion Hub',
            category: 'Clothing',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            rating: 4.7
          },
          {
            id: '4',
            name: 'Home Essentials',
            category: 'Home & Kitchen',
            image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            rating: 4.5
          }
        ]
        
        setPopularVendors(data)
      } catch (error) {
        console.error('Error fetching popular vendors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
    fetchPopularVendors()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urbanhive-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className=" bg-gradient-to-r from-urbanhive-800 to-urbanhive-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Local Marketplace Delivered to Your Door
              </h1>
              <p className="text-lg mb-8 text-urbanhive-100">
                Shop from your favorite local businesses and get everything delivered in one order.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-urbanhive-800 hover:bg-urbanhive-100">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/vendor/register">
                  <Button size="lg" variant="outline" className="bg-white text-urbanhive-800 hover:bg-urbanhive-100">
                    Become a Vendor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="UrbanHive Delivery" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Find What You Need</h2>
            <SearchBar className="mx-auto" />
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose UrbanHive?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-urbanhive-100 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-urbanhive-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Shop Local</h3>
              <p className="text-gray-600">
                Support your local businesses and discover unique products from vendors in your community.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-urbanhive-100 rounded-full mb-4">
                <Truck className="h-8 w-8 text-urbanhive-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get all your items delivered together, quickly and efficiently to your doorstep.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-urbanhive-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-urbanhive-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">
                Shop with confidence with our secure payment system and satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-urbanhive-600 hover:text-urbanhive-700 flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section> */}

      {/* Popular Vendors */}
      {/* <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Vendors</h2>
            <Link to="/vendors" className="text-urbanhive-600 hover:text-urbanhive-700 flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {popularVendors.map(vendor => (
              <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video relative">
                    <img 
                      src={vendor.image} 
                      alt={vendor.name} 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <h3 className="font-semibold text-lg">{vendor.name}</h3>
                        <p className="text-sm opacity-90">{vendor.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm font-medium">{vendor.rating}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-urbanhive-100 text-urbanhive-800 rounded-full">
                      {vendor.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community of vendors and reach more customers in your area.
          </p>
          <Link to="/vendor/register">
            <Button size="lg" className="bg-urbanhive-800 text-white hover:bg-white hover:text-urbanhive-800">
              Become a Vendor Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage