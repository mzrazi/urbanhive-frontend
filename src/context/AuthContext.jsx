import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/use-toast'


const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem('urbanhive_user');
   
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData); // This should update the user state with valid data
      } catch (error) {
        console.error('Error parsing stored user data:', error); // Log any errors in parsing
        setUser(null); // Optionally, set user to null if the data is corrupted
      }
    }
    setIsLoading(false);
  }, []);
  
  // User (Customer) Login
  const loginUser = async (email, password) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      setUser(data.user)
      localStorage.setItem('urbanhive_user', JSON.stringify(data.user))

      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.name}!`,
      })

      navigate('/customer') // Navigate to customer dashboard or home
      return true
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const loginVendor = async (email, password) => {
    try {
      setIsLoading(true);

    
      
  
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      // Handle 403 status (vendor not approved)
      if (response.status === 403) {
        throw new Error(data.message || "Your account is pending approval. Please contact the admin.");
      }
  
      // Handle other errors
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // Save the user data and token in localStorage
      setUser(data.user);
      localStorage.setItem("urbanhive_user", JSON.stringify(data.user));
  
      // Show success toast
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.storeName}!`,
      })

      // Navigate to the vendor home page
      navigate("/vendor/home");
  
      return {
        success: true,
        user: data.user, // Return the user data
      };
    } catch (error) {
      // Show error toast
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };


  // Customer Register
  const registerUser = async (userData) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // setUser(data.user)
      // localStorage.setItem('urbanhive_user', JSON.stringify(data.user))

      toast({
        title: "registered successfully!",
        description: "You can now log in with your credentials.",
        variant: "success",
      });

      navigate('/login')
      return true
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Could not create account',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Vendor Register
  const registerVendor = async (userData) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // setUser(data.user)
      // localStorage.setItem('urbanhive_user', JSON.stringify(data.user))

      toast({
        title: "Vendor registered successfully!",
        description: "sitback tight!! our team will get back to u soon for confirmation.",
      });

      navigate('/vendor/login')
      return true
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Could not create account',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('urbanhive_user')
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    })
    navigate('/')
  }

  // Update Profile
  const updateProfile = async (userData) => {
    try {
      setIsLoading(true)
      const updatedUser = { ...user, ...userData }

      setUser(updatedUser)
      localStorage.setItem('urbanhive_user', JSON.stringify(updatedUser))

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      })

      return true
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message || 'Could not update profile',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    userType: user?.userType,
    loginUser,
    loginVendor,
    registerUser,
    registerVendor,
    logout,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
