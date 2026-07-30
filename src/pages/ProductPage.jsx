import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Search, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '../hooks/use-toast'
import { resolveProductImage } from '../lib/images'
import { useCart } from '../context/CartContext'

export default function ProductsPage() {
  const { vendorId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { refreshCart } = useCart()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [productsResponse, cartResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/products/${vendorId}`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/${JSON.parse(localStorage.getItem('urbanhive_user'))?.id}`),
        ])
        setProducts(productsResponse.data)
        setCart(cartResponse.data)
      } catch (requestError) {
        setError('We could not load this store right now.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [vendorId])

  const handleAddToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem('urbanhive_user'))
    if (!user?.id) return
    const existing = cart.find((item) => item?.product?._id === product._id)
    try {
      if (cart.length && cart[0].product.vendor !== product.vendor) {
        if (!window.confirm('Your cart contains another store’s items. Replace them with this item?')) return
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/clear`, { userid: user.id })
        setCart([])
      }
      if (existing) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/update`, { userid: user.id, productid: product._id, quantity: existing.quantity + 1 })
        setCart((items) => items.map((item) => item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/add`, { userid: user.id, productId: product._id, quantity: 1 })
        setCart((items) => [...items, data])
      }
      toast({ title: 'Added to cart', description: `${product.name} is ready for checkout.` })
      refreshCart()
    } catch {
      toast({ title: 'Could not update cart', description: 'Please try again.', variant: 'destructive' })
    }
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))

  return <div className="min-h-screen bg-[#faf8f3] pb-14"><div className="page-shell py-7 sm:py-10">
    <Link to="/customer/vendors" className="inline-flex items-center gap-2 text-sm font-bold text-[#697168] hover:text-[#e86f32]"><ArrowLeft className="h-4 w-4" /> All nearby stores</Link>
    <div className="mt-5 flex flex-col justify-between gap-5 rounded-[26px] border border-[#e7e4dd] bg-[#f4eadb] p-6 sm:flex-row sm:items-end sm:p-8"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#2f7d4a]">Neighbourhood store</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#182018]">Fresh from this local store</h1><p className="mt-2 text-sm text-[#697168]">Browse products and add everything you need in one order.</p></div><div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9189]" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-11 w-full rounded-xl border border-[#e7e4dd] bg-white !pl-10 pr-3 text-sm outline-none focus:border-[#e86f32]" placeholder="Search this store" /></div></div>
    {loading ? <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-72 animate-pulse rounded-2xl bg-[#eee8dd]" />)}</div> : error ? <p className="mt-8 rounded-2xl bg-white p-6 text-center font-semibold text-[#9b332a]">{error}</p> : <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{filteredProducts.map((product) => <article key={product._id} className="group overflow-hidden rounded-2xl border border-[#ebe5d9] bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#352c1d]/8"><button type="button" onClick={() => navigate(`/customer/view-product/${product._id}`)} className="block w-full text-left"><img src={resolveProductImage(product.image)} alt={product.name} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" /></button><div className="p-3.5"><p className="text-[11px] font-bold text-[#2f7d4a]">{product.category}</p><h2 className="mt-1 truncate text-sm font-extrabold text-[#182018]">{product.name}</h2><div className="mt-3 flex items-center justify-between gap-2"><span className="text-base font-extrabold">₹{product.price}</span><Button size="sm" className="rounded-xl px-3" onClick={() => handleAddToCart(product)}><ShoppingBag className="mr-1 h-3.5 w-3.5" />Add</Button></div></div></article>)}</div>}
    {!loading && !error && !filteredProducts.length && <p className="mt-8 rounded-2xl bg-white p-6 text-center text-sm text-[#697168]">No products match your search.</p>}
  </div></div>
}
