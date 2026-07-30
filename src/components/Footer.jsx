import { Link } from 'react-router-dom'
import { MapPin, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Footer = () => {
  const { isAuthenticated, userType } = useAuth()
  const customer = isAuthenticated && userType === 'customer'
  return <footer className="mt-auto bg-[#182018] text-white">
    <div className="page-shell py-10 sm:py-12">
      <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div><Link to={customer ? '/customer' : '/'} className="inline-flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e86f32] text-sm font-black">U</span><span className="text-lg font-extrabold tracking-[-.04em]">Urban<span className="text-[#f28c54]">Hive</span></span></Link><p className="mt-4 max-w-xs text-sm leading-6 text-white/65">Your neighbourhood marketplace for trusted local stores and everyday essentials.</p><p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#a8d5b4]"><MapPin className="h-4 w-4" /> Made for local delivery</p></div>
        <div><h3 className="text-sm font-bold">Explore</h3><div className="mt-4 grid gap-3 text-sm text-white/65"><Link className="transition hover:text-white" to={customer ? '/customer' : '/'}>Home</Link>{customer && <><Link className="transition hover:text-white" to="/customer/vendors">Local stores</Link><Link className="transition hover:text-white" to="/customer/orders">Your orders</Link><Link className="transition hover:text-white" to="/customer/complaint">Help &amp; support</Link></>}</div></div>
        <div><h3 className="text-sm font-bold">For local businesses</h3><p className="mt-4 text-sm leading-6 text-white/65">Bring your store online and reach customers nearby.</p><Link to="/vendor/register" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#f28c54] transition hover:text-white"><Store className="h-4 w-4" /> Become a seller</Link></div>
      </div>
      <div className="mt-9 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} UrbanHive. Built for local commerce.</p><div className="flex gap-4"><Link to="/privacy" className="hover:text-white">Privacy</Link><Link to="/terms" className="hover:text-white">Terms</Link></div></div>
    </div>
  </footer>
}

export default Footer
