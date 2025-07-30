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
import UserLayout from './layouts/UserLayout'
import PublicRoute from './components/PublicRoute'

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
      
      <Route path="/" element={<PublicRoute><MainLayout /></PublicRoute>}>
       <Route index element={<LandingPage />} />
      <Route path="/vendor/login" element={<VendorLoginPage />} />
      <Route path="/vendor/register" element={<VendorRegisterPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      </Route>
      
      <Route path="/customer" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
       <Route index element={<UserHome/>}/>
        <Route path="products/:vendorId" element={<ProductPage />} />
        <Route path="view-product/:id" element={<ViewProduct />} />
        <Route path="complaint" element={<ComplaintPage />} />
        <Route path='cart' element={<CartPage/>}/>
        <Route path='edit-profile' element={<EditProfile/>}/>
        <Route path='orders' element={<UserOrders/>}/>
        <Route path="vendors" element={<VendorListingPage />} />
        <Route path="order-success" element={<SuccessPage />} />
         </Route>

        


        <Route path="/vendor" element={<DashboardLayout userType={'vendor'}/>} >
        <Route index element={<VendorDashboard />} />
        <Route path="home" element={<VendorHome />} />
        <Route path='orders' element={<VendorOrdersPage/>}/>
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="edit-product/:productId" element={<EditProductPage />} />
        </Route>
        

        
     
    </Routes>
  )
}

export default App