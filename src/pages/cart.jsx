import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Check, ChevronLeft, LockKeyhole, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useToast } from '../hooks/use-toast'
import { resolveProductImage } from '../lib/images'
import { useCart } from '../context/CartContext'
import { getDeliveryLocation } from '../lib/deliveryLocation'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [totals, setTotals] = useState({ subtotal: 0, deliveryCharge: 0, discount: 0, grandTotal: 0 })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { refreshCart } = useCart()

  const user = () => JSON.parse(localStorage.getItem('urbanhive_user'))
  const loadCart = async () => {
    try {
      const currentUser = user()
      let { lat, lng } = getDeliveryLocation()
      try { const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject)); lat = position.coords.latitude; lng = position.coords.longitude } catch { /* standard delivery fallback */ }
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/details`, { userid: currentUser?.id, lat, lng })
      setCartItems(data.cart || [])
      setTotals(data)
    } catch { toast({ title: 'Could not load cart', variant: 'destructive' }) } finally { setLoading(false) }
  }
  useEffect(() => { loadCart() }, [])
  const updateQuantity = async (item, change) => { const quantity = item.quantity + change; if (quantity < 1) return; await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/update`, { userid: user()?.id, productid: item.product._id, quantity }); await refreshCart(); loadCart() }
  const removeItem = async (productId) => { await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/remove`, { data: { userid: user()?.id, productId } }); await refreshCart(); toast({ title: 'Removed from cart' }); loadCart() }
  const checkout = async () => { try { const currentUser = user(); let { lat, lng } = getDeliveryLocation(); try { const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject)); lat = position.coords.latitude; lng = position.coords.longitude } catch { /* Uses the saved delivery location or the standard fallback. */ }; const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/create-order`, { lat, lng }); const rzp = new Razorpay({ key: data.razorpayPaymentKey, amount: data.totalAmount * 100, currency: 'INR', order_id: data.razorpayOrderId, name: 'UrbanHive Store', handler: async (payment) => { await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/save-order`, payment); await refreshCart(); navigate('/customer/order-success') }, prefill: { name: currentUser?.name, email: currentUser?.email } }); rzp.open() } catch { toast({ title: 'Checkout could not start', variant: 'destructive' }) } }

  if (loading) return <div className="page-shell py-10"><div className="h-72 animate-pulse rounded-[26px] bg-[#eee8dd]" /></div>
  if (!cartItems.length) return <div className="page-shell py-16 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f3ec] text-[#2f7d4a]"><ShoppingBag /></div><h1 className="mt-5 text-3xl font-extrabold">Your cart is empty</h1><p className="mt-2 text-[#697168]">Find something lovely from a nearby store.</p><Link to="/customer/vendors"><Button className="mt-6 rounded-xl">Explore stores</Button></Link></div>
  return <div className="min-h-screen bg-[#faf8f3] pb-14"><div className="page-shell py-7 sm:py-10"><Link to="/customer/vendors" className="inline-flex items-center gap-2 text-sm font-bold text-[#697168] hover:text-[#e86f32]"><ChevronLeft className="h-4 w-4" /> Continue shopping</Link><div className="mt-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#2f7d4a]">Almost there</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.04em]">Your cart <span className="text-[#697168]">({cartItems.length} items)</span></h1></div></div><div className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]"><section className="space-y-4">{cartItems.map((item) => <article key={item.product._id} className="flex gap-4 rounded-2xl border border-[#ebe5d9] bg-white p-4 sm:p-5"><img src={resolveProductImage(item.product.image)} alt={item.product.name} className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" /><div className="min-w-0 flex-1"><p className="text-xs font-bold text-[#2f7d4a]">Local store</p><h2 className="mt-1 truncate font-extrabold text-[#182018]">{item.product.name}</h2><p className="mt-1 text-sm text-[#697168]">₹{item.product.price} each</p><div className="mt-4 flex items-center justify-between gap-3"><div className="flex items-center rounded-xl border border-[#e7e4dd]"><button onClick={() => updateQuantity(item, -1)} className="p-2 text-[#697168]"><Minus className="h-4 w-4" /></button><span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => updateQuantity(item, 1)} className="p-2 text-[#697168]"><Plus className="h-4 w-4" /></button></div><div className="flex items-center gap-4"><p className="font-extrabold">₹{item.product.price * item.quantity}</p><button onClick={() => removeItem(item.product._id)} className="text-[#c95722] hover:text-[#a94319]" aria-label="Remove item"><Trash2 className="h-4 w-4" /></button></div></div></div></article>)}</section><aside className="h-fit rounded-[22px] border border-[#ebe5d9] bg-white p-5 shadow-lg shadow-[#352c1d]/5 lg:sticky lg:top-24"><h2 className="text-lg font-extrabold">Order summary</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between text-[#697168]"><span>Subtotal</span><span>₹{totals.subtotal}</span></div><div className="flex justify-between text-[#697168]"><span>Delivery</span><span>₹{totals.deliveryCharge}</span></div><div className="flex justify-between text-[#2f7d4a]"><span>Local savings</span><span>-₹{totals.discount}</span></div><div className="border-t border-[#e7e4dd] pt-4"><div className="flex justify-between text-lg font-extrabold"><span>Total</span><span>₹{totals.grandTotal}</span></div></div></div><Button size="lg" onClick={checkout} className="mt-6 w-full rounded-xl"><LockKeyhole className="mr-2 h-4 w-4" /> Secure checkout</Button><p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#697168]"><Check className="h-3.5 w-3.5 text-[#2f7d4a]" /> Secure payments powered by Razorpay</p><div className="mt-5 flex items-center gap-2 rounded-xl bg-[#e8f3ec] p-3 text-xs font-bold text-[#2f7d4a]"><Truck className="h-4 w-4" /> Delivery charge is calculated from your location.</div></aside></div></div></div>
}

export default CartPage
