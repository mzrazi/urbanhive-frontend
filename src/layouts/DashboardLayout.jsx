import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Menu, X, User, Package, ShoppingCart, Truck, LogOut, Home, Settings } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'

const DashboardLayout = ({ userType }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  const customerLinks = [
    { name: 'Dashboard', href: '/customer', icon: Home },
    { name: 'Orders', href: '/customer/orders', icon: Package },
    { name: 'Cart', href: '/customer/cart', icon: ShoppingCart },
    { name: 'Profile', href: '/customer/profile', icon: User },
  ]

  const vendorLinks = [
    { name: 'Dashboard', href: '/vendor', icon: Home },
    { name: 'Products', href: '/vendor/products', icon: Package },
    { name: 'Orders', href: '/vendor/orders', icon: Truck },
    { name: 'Profile', href: '/vendor/profile', icon: User },
  ]

  const links = userType === 'vendor' ? vendorLinks : customerLinks

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-urbanhive-800 text-white">
          <div className="flex items-center justify-between h-16 px-6">
            <Link to="/" className="text-xl font-bold">UrbanHive</Link>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-urbanhive-700"
                  onClick={() => setSidebarOpen(false)}
                >
                  <link.icon className="mr-3 h-5 w-5" />
                  {link.name}
                </Link>
              ))}
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-3 text-sm rounded-md hover:bg-urbanhive-700"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-urbanhive-800 text-white">
            <div className="flex items-center h-16 px-6">
              <Link to="/" className="text-xl font-bold">UrbanHive</Link>
            </div>
            <div className="flex flex-col flex-grow px-4 py-4">
              <nav className="flex-1 space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-urbanhive-700"
                  >
                    <link.icon className="mr-3 h-5 w-5" />
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-3 text-sm rounded-md hover:bg-urbanhive-700"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 font-medium">
                  {userType === 'vendor' ? 'Vendor Dashboard' : 'Customer Dashboard'}
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                    {user?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout