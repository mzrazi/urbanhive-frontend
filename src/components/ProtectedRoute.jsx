import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={userType === 'vendor' ? '/vendor/login' : '/login'} replace />
  }

  // Check if user type matches the required type
  if (userType && user.userType !== userType) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute