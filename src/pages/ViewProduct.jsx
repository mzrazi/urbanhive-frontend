import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '../hooks/use-toast'
import { resolveProductImage } from '../lib/images'
import { useCart } from '../context/CartContext'

const ViewProduct = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const { refreshCart } = useCart()
  const [product, setProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [quantity, setQuantity] = useState(1)

  useEffect(() => { const load = async () => { try { const user = JSON.parse(localStorage.getItem('urbanhive_user')); const [productResponse, cartResponse] = await Promise.all([axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/view-product/${id}`), axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/${user?.id}`)]); setProduct(productResponse.data); setCart(cartResponse.data) } catch { toast({ title: 'Could not load product', variant: 'destructive' }) } }; load() }, [id, toast])

  const addToCart = async () => { const user = JSON.parse(localStorage.getItem('urbanhive_user')); if (!user?.id || !product) return; try { const existing = cart.find((item) => item?.product?._id === product._id); const currentVendor = cart[0]?.product?.vendor?.toString(); if (currentVendor && currentVendor !== product.vendor.toString()) { if (!window.confirm('Your cart contains items from another store. Replace them with this item?')) return; await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/clear`, { userid: user.id }); setCart([]) } if (existing) { await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/update`, { userid: user.id, productid: product._id, quantity: existing.quantity + quantity }); setCart((items) => items.map((item) => item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item)) } else { const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/add`, { userid: user.id, productId: product._id, quantity }); setCart((items) => [...items, data]) } await refreshCart(); toast({ title: 'Added to cart', description: `${quantity} ${product.name} added.` }) } catch { toast({ title: 'Could not update cart', variant: 'destructive' }) } }

  if (!product) return <div className="page-shell py-10"><div className="h-[440px] animate-pulse rounded-[26px] bg-[#eee8dd]" /></div>
  return <div className="min-h-screen bg-[#faf8f3] pb-14"><div className="page-shell py-7 sm:py-10"><Link to={`/customer/products/${product.vendor}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#697168] hover:text-[#e86f32]"><ArrowLeft className="h-4 w-4" /> Back to store</Link><div className="mt-5 grid gap-8 rounded-[26px] border border-[#e7e4dd] bg-white p-5 sm:p-8 lg:grid-cols-2 lg:gap-12"><div className="overflow-hidden rounded-2xl bg-[#f4efe6]"><img src={resolveProductImage(product.image)} alt={product.name} className="aspect-square h-full w-full object-cover" /></div><div className="flex flex-col justify-center"><span className="w-fit rounded-full bg-[#e8f3ec] px-2.5 py-1 text-xs font-bold text-[#2f7d4a]">Fresh from a local store</span><p className="mt-5 text-sm font-bold text-[#697168]">{product.category}</p><h1 className="mt-1 text-4xl font-extrabold tracking-[-0.05em] text-[#182018]">{product.name}</h1><p className="mt-4 text-3xl font-extrabold text-[#182018]">₹{product.price}</p><p className="mt-5 leading-7 text-[#697168]">{product.description || 'Carefully selected by a trusted neighbourhood store.'}</p><div className="mt-6 flex items-center gap-2 rounded-xl bg-[#e8f3ec] px-4 py-3 text-sm font-bold text-[#2f7d4a]"><Truck className="h-4 w-4" /> Delivery in 25–35 minutes</div><div className="mt-6 flex items-center gap-4"><span className="text-sm font-bold text-[#4c564b]">Quantity</span><div className="flex items-center rounded-xl border border-[#e7e4dd]"><button className="p-2.5" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus className="h-4 w-4" /></button><span className="min-w-8 text-center text-sm font-bold">{quantity}</span><button className="p-2.5" onClick={() => setQuantity((value) => value + 1)}><Plus className="h-4 w-4" /></button></div></div><Button size="lg" onClick={addToCart} className="mt-7 w-full rounded-xl"><ShoppingBag className="mr-2 h-4 w-4" /> Add {quantity} to cart</Button><p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#697168]"><Check className="h-3.5 w-3.5 text-[#2f7d4a]" /> Secure payments · Easy order tracking</p></div></div></div></div>
}

export default ViewProduct
