import { Home, Package, Search, ShoppingCart, UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const MobileBottomNav = () => {
  const { pathname } = useLocation()
  const { totalItems } = useCart()
  const items = [
    { label: 'Home', to: '/customer', icon: Home },
    { label: 'Stores', to: '/customer/vendors', icon: Search },
    { label: 'Cart', to: '/customer/cart', icon: ShoppingCart },
    { label: 'Orders', to: '/customer/orders', icon: Package },
    { label: 'Profile', to: '/customer/edit-profile', icon: UserRound },
  ]
  return <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e7e4dd] bg-[#faf8f3]/95 px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg md:hidden" aria-label="Customer navigation"><div className="mx-auto flex max-w-lg items-center justify-around">{items.map(({ label, to, icon: Icon }) => { const active = to === '/customer' ? pathname === to : pathname.startsWith(to); return <Link key={to} to={to} className={`relative flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-bold transition ${active ? 'text-[#e86f32]' : 'text-[#697168]'}`}><span className={`relative flex h-7 w-8 items-center justify-center rounded-lg ${active ? 'bg-[#fde9dc]' : ''}`}><Icon className="h-[18px] w-[18px]" />{label === 'Cart' && totalItems > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e86f32] px-1 text-[9px] text-white">{totalItems}</span>}</span>{label}</Link> })}</div></nav>
}

export default MobileBottomNav
