import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const ResetPasswordPage = () => {
  const [params] = useSearchParams()
  const vendor = params.get('account') === 'vendor'
  const token = params.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event) => { event.preventDefault(); if (!token) return setError('This reset link is invalid.'); if (password.length < 6) return setError('Use at least 6 characters.'); if (password !== confirmPassword) return setError('Passwords do not match.'); setLoading(true); setError(''); try { const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/${vendor ? 'vendors' : 'users'}/reset-password`, { token, password, accountType: vendor ? 'vendor' : 'customer' }); setMessage(data.message) } catch (requestError) { setError(requestError.response?.data?.message || 'Could not reset your password.') } finally { setLoading(false) } }
  return <div className="min-h-screen bg-[#faf8f3] px-4 py-12"><Card className="mx-auto max-w-md rounded-[26px] border-[#e7e4dd]"><CardHeader><CardTitle className="text-2xl font-extrabold">Choose a new password</CardTitle><CardDescription>Use at least 6 characters. This link can only be used once.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-4">{message ? <p className="rounded-xl bg-[#e8f3ec] p-3 text-sm text-[#2f7d4a]">{message} <Link className="font-bold underline" to={vendor ? '/vendor/login' : '/login'}>Sign in</Link></p> : <><>{error && <p className="rounded-xl bg-[#fff0ef] p-3 text-sm text-[#b64437]">{error}</p>}</><div><Label>New password</Label><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 rounded-xl" /></div><div><Label>Confirm new password</Label><Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1.5 rounded-xl" /></div><Button className="w-full rounded-xl" disabled={loading}>{loading ? 'Resetting password...' : 'Reset password'}</Button></>}</form></CardContent></Card></div>
}
export default ResetPasswordPage
