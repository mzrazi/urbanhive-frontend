import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { useToast } from '../hooks/use-toast'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import axios from 'axios'

const EditProductPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({})
  const [formData, setFormData] = useState({ name: '', price: '', category: '', description: '' })
  const getErrors = (data) => {
    const errors = {}
    if (!data.name.trim()) errors.name = 'Product name is required.'
    if (!data.price && data.price !== 0) errors.price = 'Price is required.'
    else if (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0) errors.price = 'Enter a price greater than zero.'
    if (!data.category.trim()) errors.category = 'Category is required.'
    return errors
  }
  const errors = getErrors(formData)
  useEffect(() => { axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/getproduct/${productId}`).then(({ data }) => setFormData({ name: data.product.name || '', price: data.product.price || '', category: data.product.category || '', description: data.product.description || '' })).catch(() => setError('Failed to fetch product details.')) }, [productId])
  const update = (event) => { setFormData((data) => ({ ...data, [event.target.name]: event.target.value })); setError('') }
  const blur = (event) => setTouched((fields) => ({ ...fields, [event.target.name]: true }))
  const submit = async (event) => {
    event.preventDefault()
    setTouched({ name: true, price: true, category: true })
    if (Object.keys(errors).length) return setError('Please correct the highlighted fields.')
    setLoading(true)
    try { await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/update-product/${productId}`, formData); toast({ title: 'Product updated successfully!' }); navigate('/vendor/home') } catch { setError('Failed to update product. Please try again.') } finally { setLoading(false) }
  }
  const message = (field) => touched[field] ? errors[field] : ''
  return <div className="container mx-auto px-4 py-12"><div className="mx-auto max-w-md"><Card><CardHeader className="space-y-1"><CardTitle className="text-2xl font-bold">Edit Product</CardTitle><CardDescription>Modify the product details below.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-4">{error && <p className="text-center text-sm text-red-500">{error}</p>}<div className="space-y-2"><Label>Product Name</Label><input name="name" value={formData.name} onChange={update} onBlur={blur} className="mt-1 block w-full rounded-md border border-gray-300 p-2" /><p className="text-xs text-red-500">{message('name')}</p></div><div className="space-y-2"><Label>Price</Label><input type="number" min="0" step="0.01" name="price" value={formData.price} onChange={update} onBlur={blur} className="mt-1 block w-full rounded-md border border-gray-300 p-2" /><p className="text-xs text-red-500">{message('price')}</p></div><div className="space-y-2"><Label>Category</Label><input name="category" value={formData.category} onChange={update} onBlur={blur} className="mt-1 block w-full rounded-md border border-gray-300 p-2" /><p className="text-xs text-red-500">{message('category')}</p></div><div className="space-y-2"><Label>Description <span className="text-gray-500">(optional)</span></Label><textarea name="description" value={formData.description} onChange={update} className="mt-1 block w-full rounded-md border border-gray-300 p-2" /></div><Button type="submit" className="w-full" disabled={loading}>{loading ? 'Updating...' : 'Update Product'}</Button></form></CardContent><CardFooter className="text-center text-sm text-gray-500"><p>Update only the details that need changing.</p></CardFooter></Card></div></div>
}

export default EditProductPage
