import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Button } from './ui/button'
import { LogOut, MapPin, Menu, Search, ShoppingCart, Store, X } from 'lucide-react'
import { useDeliveryLocation } from '../lib/deliveryLocation'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated, user, userType, logout } = useAuth()
  const { totalItems } = useCart()
  const { location, requestLocation } = useDeliveryLocation()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const getDashboardLink = () => {
 
    
    if (!isAuthenticated) return '/login'
    return userType === 'vendor' ? '/vendor' : '/customer'
  }
  const getHomeLink = () => {
   
    
    if (!isAuthenticated) return '/'; // Default landing page for unauthenticated users
    
    
    return userType === 'vendor' ? '/vendor' : '/customer'; // Specific home pages for vendors and customers
  };
  const getOrdersLink = () => {
   
    
    if (!isAuthenticated) return '/'; // Default landing page for unauthenticated users
    
    
    return userType === 'vendor' ? '/vendor/orders' : '/customer/orders'; // Specific home pages for vendors and customers
  };
  const submitSearch = (event) => {
    event.preventDefault()
    if (!searchQuery.trim()) return
    navigate(isAuthenticated && userType === 'customer' ? `/customer/search?q=${encodeURIComponent(searchQuery.trim())}` : '/login')
  }
  const updateLocation = async () => { try { await requestLocation() } catch (error) { window.alert(error.message) } }
  

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7e4dd]/80 bg-[#faf8f3]/90 backdrop-blur-xl">
      <div className="page-shell">
        <div className="flex h-[74px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 lg:gap-8">
            <Link to={getHomeLink()} className="flex shrink-0 items-center gap-2.5" aria-label="UrbanHive home">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e86f32] text-sm font-black text-white shadow-sm">U</span>
              <span className="text-lg font-extrabold tracking-[-0.04em] text-[#182018]">Urban<span className="text-[#e86f32]">Hive</span></span>
            </Link>
            {isAuthenticated && userType === 'customer' && <button type="button" onClick={updateLocation} title="Use your current location" className="hidden items-center gap-2 rounded-xl border border-[#e7e4dd] bg-white px-3 py-2 text-xs font-semibold text-[#4c564b] lg:flex">
              <MapPin className="h-4 w-4 text-[#2f7d4a]" /> {location.label}
            </button>}
            {isAuthenticated && userType === 'customer' && <form onSubmit={submitSearch} className="relative hidden w-full max-w-[320px] md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9189]" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-10 w-full rounded-xl border border-[#e7e4dd] bg-white pl-9 pr-3 text-xs outline-none transition focus:border-[#e86f32] focus:ring-2 focus:ring-[#e86f32]/15" placeholder="Search products & stores" />
            </form>}
          </div>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-[#4c564b] lg:flex">
            <Link to={getHomeLink()} className="transition hover:text-[#e86f32]">Home</Link>
            {isAuthenticated && <Link to={getOrdersLink()} className="transition hover:text-[#e86f32]">Orders</Link>}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                {userType === 'customer' && (
                  <Link to="/customer/cart" className="relative rounded-xl p-2 text-[#182018] transition hover:bg-[#f3ebdd]" aria-label="Open cart">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e86f32] px-1 text-[10px] font-bold text-white">{totalItems}</span>}
                  </Link>
                )}
                {userType === 'vendor' && <Link to={getDashboardLink()}><Button variant="outline" size="sm" className="rounded-xl"><Store className="mr-1.5 h-4 w-4" />Dashboard</Button></Link>}
                <Link to={userType === 'vendor' ? '/vendor' : '/customer/edit-profile'} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-[#4c564b] transition hover:bg-[#f3ebdd]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dfeee3] text-xs font-bold text-[#2f7d4a]">{user?.name?.charAt(0) || 'U'}</span>
                  <span className="max-w-20 truncate">{user?.name || 'Profile'}</span>
                </Link>
                <button onClick={logout} className="rounded-xl p-2 text-[#697168] transition hover:bg-[#f3ebdd] hover:text-[#c95722]" title="Log out" aria-label="Log out"><LogOut className="h-4 w-4" /></button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm" className="rounded-xl">Sign in</Button></Link>
                <Link to="/register"><Button size="sm" className="rounded-xl">Start shopping</Button></Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 md:hidden">
            {isAuthenticated && userType === 'customer' && (
              <Link to="/customer/cart" className="relative rounded-xl p-2" aria-label="Open cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e86f32] px-1 text-[10px] font-bold text-white">{totalItems}</span>}
              </Link>
            )}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-[#182018] hover:bg-[#f3ebdd] focus:outline-none focus:ring-2 focus:ring-[#e86f32]"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
          </div>
      <div className={`border-t border-[#e7e4dd] bg-[#faf8f3] px-4 py-3 md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
  <div className="space-y-1">
    <Link
      to={getHomeLink()}
      className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#4c564b] hover:bg-[#f3ebdd]"
      onClick={() => setMobileMenuOpen(false)}
    >
      Home
    </Link>

    {isAuthenticated && (
      <Link
        to={getOrdersLink()}
        className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#4c564b] hover:bg-[#f3ebdd]"
        onClick={() => setMobileMenuOpen(false)}
      >
        Orders
      </Link>
    )}

    {isAuthenticated && userType === 'vendor' && (
      <Link
        to={getDashboardLink()}
        className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#4c564b] hover:bg-[#f3ebdd]"
        onClick={() => setMobileMenuOpen(false)}
      >
        Dashboard
      </Link>
    )}

    {isAuthenticated && userType === 'customer' && (
      <Link
        to="/customer/edit-profile"
        className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#4c564b] hover:bg-[#f3ebdd]"
        onClick={() => setMobileMenuOpen(false)}
      >
        Profile
      </Link>
    )}

    {isAuthenticated && userType === 'customer' && (
      <Link
        to="/customer/cart"
        className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#4c564b] hover:bg-[#f3ebdd]"
        onClick={() => setMobileMenuOpen(false)}
      >
        Cart ({totalItems})
      </Link>
    )}

    {isAuthenticated ? (
      <button
        className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#4c564b] hover:bg-[#f3ebdd]"
        onClick={() => {
          logout()
          setMobileMenuOpen(false)
        }}
      >
        Logout
      </button>
    ) : (
      <>
        <Link
          to="/login"
          className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#4c564b] hover:bg-[#f3ebdd]"
          onClick={() => setMobileMenuOpen(false)}
        >
          Customer Login
        </Link>
        <Link
          to="/vendor/login"
          className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#4c564b] hover:bg-[#f3ebdd]"
          onClick={() => setMobileMenuOpen(false)}
        >
          Vendor Login
        </Link>
      </>
    )}
  </div>
</div>

    </header>
  )
}

export default Navbar
