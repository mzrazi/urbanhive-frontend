import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { useToast } from '../hooks/use-toast'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'

const ComplaintPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [description, setDescription] = useState('')
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const validationError = !description.trim() ? 'Please describe the issue.' : description.trim().length < 10 ? 'Please add a little more detail.' : ''
  const submit = async (event) => {
    event.preventDefault()
    setTouched(true)
    if (validationError) return
    const user = JSON.parse(localStorage.getItem('urbanhive_user') || 'null')
    if (!user?.id) return setError('Your session has expired. Please sign in again.')
    setLoading(true); setError('')
    try { await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/complaint`, { description, id: user.id }); toast({ title: 'Complaint raised successfully!' }); setDescription(''); setTouched(false); navigate('/customer/complaint') } catch { setError('Failed to submit complaint. Please try again.') } finally { setLoading(false) }
  }
  return <div className="container mx-auto px-4 py-12"><div className="mx-auto max-w-md"><Card><CardHeader><CardTitle className="text-2xl font-bold">Raise a Complaint</CardTitle><CardDescription>Describe the issue you are facing.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-4">{error && <p className="text-center text-sm text-red-500">{error}</p>}<div className="space-y-2"><Label htmlFor="description">Complaint Description</Label><textarea id="description" name="description" value={description} onChange={(event) => { setDescription(event.target.value); setError('') }} onBlur={() => setTouched(true)} placeholder="Enter your complaint details" className="mt-1 block w-full rounded-md border border-gray-300 p-2" rows={4} />{touched && <p className="text-xs font-medium text-red-500">{validationError}</p>}</div><Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Complaint'}</Button></form></CardContent><CardFooter className="text-center text-sm text-gray-500"><p>Our team will review your complaint and update the status.</p></CardFooter></Card></div></div>
}

export default ComplaintPage
