import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { useAuth } from '../context/AuthContext'

const FieldError = ({ message }) => message ? <p className="text-sm text-red-500">{message}</p> : null

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', address: '' })
  const [touched, setTouched] = useState({})
  const [generalError, setGeneralError] = useState('')
  const { registerUser, isLoading } = useAuth()
  const navigate = useNavigate()
  const getErrors = (data) => {
    const errors = {}
    if (!data.name.trim()) errors.name = 'Name is required'
    if (!data.email.trim()) errors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Enter a valid email address'
    if (!data.password) errors.password = 'Password is required'
    else if (data.password.length < 6) errors.password = 'Use at least 6 characters'
    if (!data.confirmPassword) errors.confirmPassword = 'Confirm your password'
    else if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (!data.phone.trim()) errors.phone = 'Phone number is required'
    else if (data.phone.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a 10-digit phone number'
    if (!data.address.trim()) errors.address = 'Address is required'
    return errors
  }
  const errors = getErrors(formData)
  const handleChange = (event) => { setFormData((data) => ({ ...data, [event.target.name]: event.target.value })); setGeneralError('') }
  const handleBlur = (event) => setTouched((fields) => ({ ...fields, [event.target.name]: true }))
  const submit = async (event) => {
    event.preventDefault()
    setTouched({ name: true, email: true, password: true, confirmPassword: true, phone: true, address: true })
    if (Object.keys(errors).length) return setGeneralError('Please correct the highlighted fields.')
    const success = await registerUser(formData)
    if (success) navigate('/login')
  }
  const message = (field) => touched[field] ? errors[field] : ''

  return <div className="min-h-screen bg-[#faf8f3] px-4 py-10 sm:py-16"><div className="mx-auto max-w-xl"><Card className="overflow-hidden rounded-[26px] border-[#e7e4dd] shadow-xl shadow-[#352c1d]/5"><div className="bg-[#f4eadb] px-7 py-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#2f7d4a]">Join your neighbourhood</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em]">Create your account.</h1><p className="mt-2 text-sm text-[#697168]">Start shopping from trusted local stores.</p></div><CardHeader className="space-y-1"><CardTitle className="text-2xl font-bold">Create an Account</CardTitle><CardDescription>Enter your information to create a customer account</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-4">{generalError && <p className="text-center text-sm text-red-500">{generalError}</p>}<div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} onBlur={handleBlur} /><FieldError message={message('name')} /></div><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} /><FieldError message={message('email')} /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" placeholder="At least 6 characters" value={formData.password} onChange={handleChange} onBlur={handleBlur} /><FieldError message={message('password')} /></div><div className="space-y-2"><Label htmlFor="confirmPassword">Confirm Password</Label><Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} /><FieldError message={message('confirmPassword')} /></div></div><div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" type="tel" placeholder="9876543210" value={formData.phone} onChange={handleChange} onBlur={handleBlur} /><FieldError message={message('phone')} /></div><div className="space-y-2"><Label htmlFor="address">Delivery Address</Label><Input id="address" name="address" placeholder="House, street, locality, city" value={formData.address} onChange={handleChange} onBlur={handleBlur} /><FieldError message={message('address')} /></div><Button type="submit" className="w-full rounded-xl" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Create Account'}</Button></form></CardContent><CardFooter className="flex flex-col space-y-4"><p className="text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="font-medium text-urbanhive-600 hover:text-urbanhive-700">Sign in</Link></p><p className="text-center text-sm text-gray-500">Want to sell on UrbanHive? <Link to="/vendor/register" className="font-medium text-urbanhive-600 hover:text-urbanhive-700">Register as a Vendor</Link></p></CardFooter></Card></div></div>
}

export default RegisterPage
