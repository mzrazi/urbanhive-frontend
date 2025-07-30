import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Button } from './ui/button'
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu'
import { Menu, X, ShoppingCart, User } from 'lucide-react'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, userType, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

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
  

  return (
    <header className="bg-white shadow-sm border-b  border-urbanhive-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8  ">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={getHomeLink()} className="flex-shrink-0 flex items-center">
              <span className="text-urbanhive-600 font-bold text-xl">UrbanHive</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to={getHomeLink()}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                   {isAuthenticated ?
                  <NavigationMenuItem>
                    <Link to={getOrdersLink()}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        orders
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>:null}
                  {/* <NavigationMenuItem>
                    <Link to="/vendors">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Vendors
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem> */}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center">
  {isAuthenticated ? (
    <>
      {/* Show cart icon only for customers */}
      {userType === 'customer' && (
        <Link to="/customer/cart" className="relative mr-4">
          <ShoppingCart className="h-6 w-6 text-gray-600" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-urbanhive-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      )}

      {/* Show dashboard button only for vendors */}
      {userType === 'vendor' && (
        <Link to={getDashboardLink()}>
          <Button variant="outline" size="sm" className="mr-2">
            <User className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
      )}

      {/* Logout button for all authenticated users */}
      <Button variant="ghost" size="sm" onClick={logout}>
        Logout
      </Button>
    </>
  ) : (
    <>
      {/* Show login buttons for unauthenticated users */}
      <Link to="/login">
        <Button variant="outline" size="sm" className="mr-2">
          Customer Login
        </Button>
      </Link>
      <Link to="/vendor/login">
        <Button size="sm">
          Vendor Login
        </Button>
      </Link>
    </>
  )}
</div>
          
          <div className="flex items-center md:hidden">
            {isAuthenticated && userType === 'customer' && (
              <Link to="/customer/cart" className="relative mr-4">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-urbanhive-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-urbanhive-500"
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
      
    {/* Mobile menu */}
<div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
    <Link
      to={getHomeLink()}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
      onClick={() => setMobileMenuOpen(false)}
    >
      Home
    </Link>

    {isAuthenticated && (
      <Link
        to={getOrdersLink()}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        onClick={() => setMobileMenuOpen(false)}
      >
        Orders
      </Link>
    )}

    {isAuthenticated && userType === 'vendor' && (
      <Link
        to={getDashboardLink()}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        onClick={() => setMobileMenuOpen(false)}
      >
        Dashboard
      </Link>
    )}

    {isAuthenticated && userType === 'customer' && (
      <Link
        to="/cart"
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        onClick={() => setMobileMenuOpen(false)}
      >
        Cart ({totalItems})
      </Link>
    )}

    {isAuthenticated ? (
      <button
        className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
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
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          Customer Login
        </Link>
        <Link
          to="/vendor/login"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
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