import { useEffect, useState } from 'react'
import axios from 'axios'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

const EditProfile = () => {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' })
  const [touched, setTouched] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const getErrors = (data) => {
    const errors = {}
    if (!data.name.trim()) errors.name = 'Name is required.'
    if (!data.email.trim()) errors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Enter a valid email address.'
    if (!data.phone.trim()) errors.phone = 'Phone number is required.'
    else if (data.phone.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a 10-digit phone number.'
    if (!data.address.trim()) errors.address = 'Address is required.'
    return errors
  }
  const errors = getErrors(formData)
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('urbanhive_user') || 'null')
    if (!currentUser) return
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile/${currentUser.id}`).then(({ data }) => { setUser(data); setFormData({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '' }) }).catch(() => setGeneralError('Failed to load your profile.'))
  }, [])
  const change = (event) => { setFormData((data) => ({ ...data, [event.target.name]: event.target.value })); setGeneralError('') }
  const blur = (event) => setTouched((fields) => ({ ...fields, [event.target.name]: true }))
  const submit = async (event) => {
    event.preventDefault()
    setTouched({ name: true, email: true, phone: true, address: true })
    if (Object.keys(errors).length) return setGeneralError('Please correct the highlighted fields.')
    setIsLoading(true)
    try { await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile/update`, { userid: user._id, ...formData }); alert('Profile updated successfully!') } catch { setGeneralError('Failed to update profile.') } finally { setIsLoading(false) }
  }
  if (!user) return <p className="p-6 text-center">Loading...</p>
  const message = (field) => touched[field] ? errors[field] : ''
  return <div className="mt-10 flex justify-center px-4"><div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md"><h2 className="text-xl font-bold">Edit Profile</h2><form onSubmit={submit} className="mt-5 space-y-4">{generalError && <p className="text-center text-sm text-red-500">{generalError}</p>}<div className="space-y-2"><Label>Full Name</Label><Input name="name" value={formData.name} onChange={change} onBlur={blur} /><p className="text-xs text-red-500">{message('name')}</p></div><div className="space-y-2"><Label>Email</Label><Input name="email" type="email" value={formData.email} onChange={change} onBlur={blur} /><p className="text-xs text-red-500">{message('email')}</p></div><div className="space-y-2"><Label>Phone Number</Label><Input name="phone" type="tel" value={formData.phone} onChange={change} onBlur={blur} /><p className="text-xs text-red-500">{message('phone')}</p></div><div className="space-y-2"><Label>Delivery Address</Label><Input name="address" value={formData.address} onChange={change} onBlur={blur} /><p className="text-xs text-red-500">{message('address')}</p></div><Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Updating Profile...' : 'Update Profile'}</Button></form></div></div>
}

export default EditProfile
