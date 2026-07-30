import { useRef, useState } from 'react'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { useToast } from '../hooks/use-toast'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import axios from 'axios'

const FieldError = ({ message }) => message ? <p className="text-xs font-medium text-red-500">{message}</p> : null

const AddProductPage = () => {
  const { toast } = useToast()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({ name: '', price: '', category: '', description: '', image: null })
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const getErrors = (data) => {
    const errors = {}
    if (!data.name.trim()) errors.name = 'Product name is required.'
    if (!data.price && data.price !== 0) errors.price = 'Price is required.'
    else if (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0) errors.price = 'Enter a price greater than zero.'
    if (!data.category.trim()) errors.category = 'Category is required.'
    if (!data.image) errors.image = 'Add a product image.'
    return errors
  }
  const errors = getErrors(formData)
  const update = (event) => { const { name, value, type, files } = event.target; setFormData((data) => ({ ...data, [name]: type === 'file' ? files[0] : value })); setError('') }
  const blur = (event) => setTouched((fields) => ({ ...fields, [event.target.name]: true }))
  const submit = async (event) => {
    event.preventDefault()
    setTouched({ name: true, price: true, category: true, image: true })
    if (Object.keys(errors).length) return setError('Please correct the highlighted fields.')
    const storedVendor = JSON.parse(localStorage.getItem('urbanhive_user'))
    if (!storedVendor?._id) return setError('Your vendor session is missing. Please sign in again.')
    setLoading(true)
    const productFormData = new FormData()
    Object.entries({ ...formData, id: storedVendor._id }).forEach(([key, value]) => productFormData.append(key, value))
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/add-product`, productFormData, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (response.status === 201) { toast({ title: 'Product added successfully!' }); setFormData({ name: '', price: '', category: '', description: '', image: null }); setTouched({}); fileInputRef.current.value = '' }
    } catch { setError('Failed to add product. Please try again.') } finally { setLoading(false) }
  }
  const message = (field) => touched[field] ? errors[field] : ''
  return <div className="container mx-auto px-4 py-12"><div className="mx-auto max-w-md"><Card><CardHeader className="space-y-1"><CardTitle className="text-2xl font-bold">Add Product</CardTitle><CardDescription>Enter product details and upload an image.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-4">{error && <p className="text-center text-sm text-red-500">{error}</p>}<div className="space-y-2"><Label>Product Name</Label><input name="name" value={formData.name} onChange={update} onBlur={blur} className="mt-1 block w-full rounded-md border border-gray-300 p-2" /><FieldError message={message('name')} /></div><div className="space-y-2"><Label>Price</Label><input type="number" min="0" step="0.01" name="price" value={formData.price} onChange={update} onBlur={blur} className="mt-1 block w-full rounded-md border border-gray-300 p-2" /><FieldError message={message('price')} /></div><div className="space-y-2"><Label>Category</Label><input name="category" value={formData.category} onChange={update} onBlur={blur} className="mt-1 block w-full rounded-md border border-gray-300 p-2" /><FieldError message={message('category')} /></div><div className="space-y-2"><Label>Description <span className="text-gray-500">(optional)</span></Label><textarea name="description" value={formData.description} onChange={update} className="mt-1 block w-full rounded-md border border-gray-300 p-2" /></div><div className="space-y-2"><Label>Image</Label><input type="file" name="image" accept="image/*" ref={fileInputRef} onChange={update} onBlur={blur} className="mt-1 block w-full rounded-md border border-gray-300 p-2" /><FieldError message={message('image')} /></div><Button type="submit" className="w-full" disabled={loading}>{loading ? 'Adding Product...' : 'Add Product'}</Button></form></CardContent><CardFooter className="text-center text-sm text-gray-500"><p>Product name, price, category, and image are required.</p></CardFooter></Card></div></div>
}

export default AddProductPage
