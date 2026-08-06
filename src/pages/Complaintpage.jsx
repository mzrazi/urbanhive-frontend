import { useEffect, useState } from 'react'
import axios from 'axios'
import { MessageSquarePlus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { useToast } from '../hooks/use-toast'

const tone = { Open: 'bg-[#fff0e7] text-[#c95722]', 'In Progress': 'bg-[#e8eef8] text-[#4775b6]', Resolved: 'bg-[#e8f3ec] text-[#2f7d4a]' }
const ComplaintPage = () => {
  const { toast } = useToast()
  const [description, setDescription] = useState('')
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError] = useState('')
  const validationError = !description.trim() ? 'Please describe the issue.' : description.trim().length < 10 ? 'Please add a little more detail.' : ''
  const loadHistory = async () => { try { const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/complaints`); setHistory(data) } catch { setError('Could not load your complaint history.') } finally { setHistoryLoading(false) } }
  useEffect(() => { loadHistory() }, [])
  const submit = async (event) => { event.preventDefault(); setTouched(true); if (validationError) return; setLoading(true); setError(''); try { await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/complaint`, { description }); toast({ title: 'Complaint raised successfully!' }); setDescription(''); setTouched(false); setHistoryLoading(true); await loadHistory() } catch { setError('Failed to submit complaint. Please try again.') } finally { setLoading(false) } }
  return <div className="min-h-screen bg-[#faf8f3]"><div className="page-shell max-w-4xl py-7 sm:py-10"><section className="rounded-[26px] bg-[#182018] p-7 text-white sm:p-9"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#a8d5b4]">Support centre</p><h1 className="mt-2 text-3xl font-extrabold">How can we help?</h1><p className="mt-2 text-sm text-white/65">Tell us what happened and track every update here.</p></section><div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]"><section className="rounded-2xl border border-[#e7e4dd] bg-white p-5 sm:p-6"><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0e7] text-[#e86f32]"><MessageSquarePlus className="h-4 w-4" /></span><h2 className="font-extrabold">Raise a complaint</h2></div><form onSubmit={submit} className="mt-5 space-y-4">{error && <p className="rounded-xl bg-[#fff0ef] p-3 text-sm text-[#b64437]">{error}</p>}<div><Label htmlFor="description">What happened?</Label><textarea id="description" value={description} onChange={(event) => { setDescription(event.target.value); setError('') }} onBlur={() => setTouched(true)} placeholder="Add your order or delivery issue in detail" className="mt-1.5 min-h-32 w-full rounded-xl border border-input p-3 text-sm" />{touched && <p className="mt-1.5 text-xs font-medium text-[#b64437]">{validationError}</p>}</div><Button type="submit" className="w-full rounded-xl" disabled={loading}>{loading ? 'Submitting…' : 'Submit complaint'}</Button></form></section><section className="rounded-2xl border border-[#e7e4dd] bg-white p-5 sm:p-6"><h2 className="font-extrabold">Your requests</h2>{historyLoading ? <div className="mt-5 space-y-3">{[1,2].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-[#eee8dd]" />)}</div> : history.length ? <div className="mt-5 space-y-3">{history.map((complaint) => <article key={complaint._id} className="rounded-xl border border-[#eee8dd] p-4"><div className="flex items-start justify-between gap-3"><p className="line-clamp-2 text-sm font-semibold text-[#4c564b]">{complaint.description}</p><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${tone[complaint.status] || tone.Open}`}>{complaint.status}</span></div><p className="mt-3 text-xs text-[#697168]">Submitted {new Date(complaint.createdAt).toLocaleDateString()}</p></article>)}</div> : <p className="mt-5 rounded-xl bg-[#faf8f3] p-5 text-sm text-[#697168]">You have not raised any support requests yet.</p>}</section></div></div></div>
}
export default ComplaintPage
