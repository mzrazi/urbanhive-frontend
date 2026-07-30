import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Edit3, PackagePlus, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { resolveProductImage } from '../lib/images'
import { useToast } from '../hooks/use-toast'

const VendorHome = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const load = async () => { try { const vendor = JSON.parse(localStorage.getItem('urbanhive_user')); const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/products/${vendor?._id}`); setProducts(data) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const remove = async (id) => { if (!window.confirm('Delete this product?')) return; try { await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/delete-product/${id}`); setProducts((items) => items.filter((item) => item._id !== id)); toast({ title: 'Product deleted' }) } catch { toast({ title: 'Could not delete product', variant: 'destructive' }) } }
  return <div className="min-h-full bg-[#faf8f3]"><div className="mx-auto max-w-[1280px] py-3"><div className="flex flex-col justify-between gap-5 rounded-[26px] border border-[#e7e4dd] bg-[#f4eadb] p-7 sm:flex-row sm:items-center sm:p-8"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#2f7d4a]">Store catalogue</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em]">Your products</h1><p className="mt-2 text-sm text-[#697168]">Keep your local storefront fresh and easy to shop.</p></div><Link to="/vendor/add-product"><Button className="rounded-xl"><PackagePlus className="mr-2 h-4 w-4" /> Add product</Button></Link></div>{loading ? <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-[#eee8dd]" />)}</div> : products.length ? <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{products.map((product) => <article key={product._id} className="overflow-hidden rounded-2xl border border-[#ebe5d9] bg-white"><img src={resolveProductImage(product.image)} alt={product.name} className="aspect-[4/3] w-full object-cover" /><div className="p-4"><p className="text-[11px] font-bold text-[#2f7d4a]">{product.category}</p><h2 className="mt-1 truncate font-extrabold">{product.name}</h2><p className="mt-2 text-lg font-extrabold">₹{product.price}</p><div className="mt-4 flex justify-between border-t border-[#eee8dd] pt-3"><Link to={`/vendor/edit-product/${product._id}`} className="inline-flex items-center gap-1 text-sm font-bold text-[#4775b6]"><Edit3 className="h-3.5 w-3.5" /> Edit</Link><button onClick={() => remove(product._id)} className="inline-flex items-center gap-1 text-sm font-bold text-[#c95722]"><Trash2 className="h-3.5 w-3.5" /> Delete</button></div></div></article>)}</div> : <div className="mt-6 rounded-2xl bg-white p-10 text-center"><h2 className="text-xl font-extrabold">No products yet</h2><Link to="/vendor/add-product" className="mt-3 inline-block text-sm font-bold text-[#e86f32]">Add your first product</Link></div>}</div></div>
}
export default VendorHome
