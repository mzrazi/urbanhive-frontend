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


// Protected Routes
import ProtectedRoute from './components/ProtectedRoute'
import CartPage from './pages/cart'
import VendorOrdersPage from './pages/VendorOrders'
import VendorListingPage from './pages/VendorListingPage'
import AddProductPage from './pages/AddProductPage'
import VendorDashboard from './pages/VendorDashboard'
import EditProductPage from './pages/EditProductPage'

import UserOrders from './pages/UserOrders'
import EditProfile from './pages/EditProfile'
import ViewProduct from './pages/ViewProduct'
import ComplaintPage from './pages/Complaintpage'
import SuccessPage from './pages/SuccessPage'
import SearchResultsPage from './pages/SearchResultsPage'
import LegalPage from './pages/LegalPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VendorSettingsPage from './pages/VendorSettingsPage'
import CustomerLocationPage from './pages/CustomerLocationPage'
import UserLayout from './layouts/UserLayout'
import PublicRoute from './components/PublicRoute'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf8f3] px-6 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e8f3ec] border-t-[#e86f32]"></div>
        <div><p className="font-extrabold text-[#182018]">Getting UrbanHive ready…</p><p className="mt-1 max-w-sm text-sm leading-6 text-[#697168]">The first request can take up to a minute while our free server wakes up. Thanks for your patience.</p></div>
      </div>
    )
  }

  return (
    <Routes>

      {/* Public Routes */}
      
      <Route path="/" element={<PublicRoute><MainLayout /></PublicRoute>}>
       <Route index element={<LandingPage />} />
      <Route path="/vendor/login" element={<VendorLoginPage />} />
      <Route path="/vendor/register" element={<VendorRegisterPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="vendor/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route path="/privacy" element={<LegalPage />} />
      <Route path="/terms" element={<LegalPage />} />
      
      <Route path="/customer" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
       <Route index element={<UserHome/>}/>
        <Route path="products/:vendorId" element={<ProductPage />} />
        <Route path="view-product/:id" element={<ViewProduct />} />
        <Route path="complaint" element={<ComplaintPage />} />
        <Route path='cart' element={<CartPage/>}/>
        <Route path='edit-profile' element={<EditProfile/>}/>
        <Route path='orders' element={<UserOrders/>}/>
        <Route path="vendors" element={<VendorListingPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="location" element={<CustomerLocationPage />} />
        <Route path="order-success" element={<SuccessPage />} />
         </Route>

        


        <Route path="/vendor" element={<DashboardLayout userType={'vendor'}/>} >
        <Route index element={<VendorDashboard />} />
        <Route path="home" element={<VendorHome />} />
        <Route path='orders' element={<VendorOrdersPage/>}/>
        <Route path="settings" element={<VendorSettingsPage />} />
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="edit-product/:productId" element={<EditProductPage />} />
        </Route>
        

        
     
    </Routes>
  )
}

export default App
