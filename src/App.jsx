import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Public Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductPage from './pages/ProductPage'
import VendorLoginPage from './pages/VendorLoginPage'
import VendorRegisterPage from './pages/VendorRegisterPage'
import VendorHome from './pages/VendorHome'
// import NotFoundPage from './pages/NotFoundPage'

// Customer Pages
import UserHome from './pages/UserHome'
// // import CustomerDashboard from './pages/customer/Dashboard'
// import CustomerOrders from './pages/customer/Orders'
// import CustomerOrderDetails from './pages/customer/OrderDetails'
// import CustomerProfile from './pages/customer/Profile'
// import CustomerCart from './pages/customer/Cart'
// import CustomerCheckout from './pages/customer/Checkout'
// import CustomerOrderTracking from './pages/customer/OrderTracking'

// // Vendor Pages
// import VendorDashboard from './pages/vendor/Dashboard'
// import VendorProducts from './pages/vendor/Products'
// import VendorAddProduct from './pages/vendor/AddProduct'
// import VendorEditProduct from './pages/vendor/EditProduct'
// import VendorOrders from './pages/vendor/Orders'
// import VendorOrderDetails from './pages/vendor/OrderDetails'
// import VendorProfile from './pages/vendor/Profile'

// Protected Routes
import ProtectedRoute from './components/ProtectedRoute'
import CartPage from './pages/cart'
import VendorOrdersPage from './pages/vendorOrders'
import VendorListingPage from './pages/VendorListingPage'
import AddProductPage from './pages/AddProductPage'
import VendorDashboard from './pages/VendorDashboard'
import EditProductPage from './pages/EditProductPage'
import OrderSuccessPage from './pages/succespage'
import UserOrders from './pages/UserOrders'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urbanhive-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/products/:vendorId" element={<ProductPage />} />
        <Route path="vendor/login" element={<VendorLoginPage />} />
        <Route path="vendor/register" element={<VendorRegisterPage />} />
        <Route path="vendor/home" element={<VendorHome />} />
        <Route path='/home' element={<UserHome/>}/>
        <Route path='/cart' element={<CartPage/>}/>
        <Route path='/vendor/orders' element={<VendorOrdersPage/>}/>
        <Route path='/orders' element={<UserOrders/>}/>
        <Route path="/vendor/add-product" element={<AddProductPage />} />
        <Route path="/vendors" element={<VendorListingPage />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/edit-product/:productId" element={<EditProductPage />} /> 
        <Route path="/order-success" element={<OrderSuccessPage />} />

        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>

      {/* Customer Routes
      <Route path="/customer" element={
        <ProtectedRoute userType="customer">
          <DashboardLayout userType="customer" />
        </ProtectedRoute>
      }>
        <Route index element={<CustomerDashboard />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="orders/:id" element={<CustomerOrderDetails />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="cart" element={<CustomerCart />} />
        <Route path="checkout" element={<CustomerCheckout />} />
        <Route path="track/:id" element={<CustomerOrderTracking />} />
      </Route> */}

      {/* Vendor Routes
      <Route path="/vendor" element={
        <ProtectedRoute userType="vendor">
          <DashboardLayout userType="vendor" />
        </ProtectedRoute>
      }>
        <Route index element={<VendorDashboard />} />
        <Route path="products" element={<VendorProducts />} />
        <Route path="products/add" element={<VendorAddProduct />} />
        <Route path="products/edit/:id" element={<VendorEditProduct />} />
        <Route path="orders" element={<VendorOrders />} />
        <Route path="orders/:id" element={<VendorOrderDetails />} />
        <Route path="profile" element={<VendorProfile />} />
      </Route> */}
    </Routes>
  )
}

export default App