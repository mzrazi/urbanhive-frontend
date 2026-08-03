import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const ForgotPasswordPage = () => {
  const vendor = useLocation().pathname.startsWith('/vendor/')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event) => { event.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.'); setLoading(true); setError(''); try { const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/${vendor ? 'vendors' : 'users'}/forgot-password`, { email, accountType: vendor ? 'vendor' : 'customer' }); setMessage(data.message) } catch (requestError) { setError(requestError.response?.data?.message || 'Could not send a reset email.') } finally { setLoading(false) } }
  return <div className="min-h-screen bg-[#faf8f3] px-4 py-12"><Card className="mx-auto max-w-md rounded-[26px] border-[#e7e4dd]"><CardHeader><CardTitle className="text-2xl font-extrabold">Reset your password</CardTitle><CardDescription>Enter the email used for your {vendor ? 'vendor' : 'customer'} account. We’ll send a reset link that expires in 15 minutes.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-4">{message && <p className="rounded-xl bg-[#e8f3ec] p-3 text-sm text-[#2f7d4a]">{message}</p>}{error && <p className="rounded-xl bg-[#fff0ef] p-3 text-sm text-[#b64437]">{error}</p>}<div><Label>Email address</Label><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 rounded-xl" placeholder="name@example.com" /></div><Button className="w-full rounded-xl" disabled={loading}>{loading ? 'Sending link...' : 'Send reset link'}</Button><p className="text-center text-sm text-[#697168]">Remembered it? <Link className="font-bold text-[#e86f32]" to={vendor ? '/vendor/login' : '/login'}>Back to sign in</Link></p></form></CardContent></Card></div>
}
export default ForgotPasswordPage
