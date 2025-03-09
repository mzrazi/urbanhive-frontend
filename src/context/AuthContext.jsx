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
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('urbanhive_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password, userType = 'customer') => {
    try {
      setIsLoading(true)
      // API call would go here
      // const response = await fetch('https://api.example.com/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, userType }),
      // })
      // const data = await response.json()
      
      // Simulating API response
      const data = {
        id: '123',
        name: userType === 'customer' ? 'John Doe' : 'Vendor Store',
        email,
        userType,
        token: 'fake-jwt-token'
      }
      
      setUser(data)
      localStorage.setItem('urbanhive_user', JSON.stringify(data))
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.name}!`,
      })
      
      navigate(userType === 'customer' ? '/customer' : '/vendor')
      return true
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData, userType = 'customer') => {
    try {
      setIsLoading(true)
      // API call would go here
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, userType }),
      })
      const data = await response.json()
      
      // Simulating API response
      // const data = {
      //   id: '123',
      //   name: userData.name,
      //   email: userData.email,
      //   userType,
      //   token: 'fake-jwt-token'
      // }
      
      setUser(data)
      localStorage.setItem('urbanhive_user', JSON.stringify(data))
      
      toast({
        title: "Registration successful",
        description: `Welcome to UrbanHive, ${data.name}!`,
      })
      
      navigate(userType === 'customer' ? '/customer' : '/vendor')
      return true
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('urbanhive_user')
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    navigate('/')
  }

  const updateProfile = async (userData) => {
    try {
      setIsLoading(true)
      // API call would go here
      // const response = await fetch('https://api.example.com/auth/profile', {
      //   method: 'PUT',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user.token}`
      //   },
      //   body: JSON.stringify(userData),
      // })
      // const data = await response.json()
      
      // Simulating API response
      const updatedUser = { ...user, ...userData }
      
      setUser(updatedUser)
      localStorage.setItem('urbanhive_user', JSON.stringify(updatedUser))
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
      
      return true
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message || "Could not update profile",
        variant: "destructive",
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
    login,
    register,
    logout,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}