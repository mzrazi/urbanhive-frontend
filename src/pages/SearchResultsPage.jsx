import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Search, Store } from 'lucide-react'
import { resolveProductImage } from '../lib/images'

const SearchResultsPage = () => {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [results, setResults] = useState({ products: [], vendors: [] })
  const [loading, setLoading] = useState(true)
  const term = params.get('q') || ''
  const category = params.get('category') || ''
  useEffect(() => {
    setLoading(true)
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/search`, { params: { q: term, category } }).then(({ data }) => setResults(data)).catch(() => setResults({ products: [], vendors: [] })).finally(() => setLoading(false))
  }, [term, category])
  const submit = (event) => { event.preventDefault(); setParams(query.trim() ? { q: query.trim() } : {}) }
  const heading = category ? category : term ? `Results for “${term}”` : 'Search UrbanHive'
  return <div className="min-h-screen bg-[#faf8f3] pb-14"><div className="page-shell py-7 sm:py-10"><Link to="/customer" className="inline-flex items-center gap-2 text-sm font-bold text-[#697168] hover:text-[#e86f32]"><ArrowLeft className="h-4 w-4" /> Back to home</Link><section className="mt-5 rounded-[26px] border border-[#e7e4dd] bg-[#f4eadb] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#2f7d4a]">Find what you need</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-[#182018]">{heading}</h1><form onSubmit={submit} className="relative mt-5 max-w-xl"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9189]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-xl border border-[#e7e4dd] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#e86f32]" placeholder="Search products and stores" /></form></section>{loading ? <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-[#eee8dd]" />)}</div> : <><section className="mt-9"><h2 className="text-xl font-extrabold">Products <span className="text-sm font-semibold text-[#697168]">({results.products.length})</span></h2>{results.products.length ? <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{results.products.map((product) => <Link key={product._id} to={`/customer/view-product/${product._id}`} className="overflow-hidden rounded-2xl border border-[#ebe5d9] bg-white transition hover:-translate-y-0.5 hover:shadow-lg"><img src={resolveProductImage(product.image)} alt={product.name} className="aspect-[4/3] w-full object-cover" /><div className="p-3"><p className="truncate text-xs font-bold text-[#2f7d4a]">{product.vendor?.storeName || 'Local store'}</p><h3 className="mt-1 truncate font-extrabold">{product.name}</h3><p className="mt-2 text-lg font-extrabold">₹{product.price}</p></div></Link>)}</div> : <p className="mt-4 rounded-2xl bg-white p-5 text-sm text-[#697168]">No products found.</p>}</section><section className="mt-10"><h2 className="text-xl font-extrabold">Stores <span className="text-sm font-semibold text-[#697168]">({results.vendors.length})</span></h2>{results.vendors.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.vendors.map((vendor) => <Link key={vendor._id} to={`/customer/products/${vendor._id}`} className="flex items-center gap-4 rounded-2xl border border-[#ebe5d9] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f3ec] text-[#2f7d4a]"><Store className="h-5 w-5" /></span><div className="min-w-0"><h3 className="truncate font-extrabold">{vendor.storeName}</h3><p className="mt-1 truncate text-xs text-[#697168]">{vendor.category} · {vendor.storeAddress}</p></div></Link>)}</div> : <p className="mt-4 rounded-2xl bg-white p-5 text-sm text-[#697168]">No stores found.</p>}</section></>}</div></div>
}

export default SearchResultsPage
