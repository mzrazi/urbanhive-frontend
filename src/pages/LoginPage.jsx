import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const [touched, setTouched] = useState({})

  const { loginUser } = useAuth() // Access the login function for customers
  const navigate = useNavigate()
  const validationErrors = {
    ...(email && !/^\S+@\S+\.\S+$/.test(email) ? { email: 'Enter a valid email address.' } : {}),
    ...(password && password.length < 6 ? { password: 'Password must be at least 6 characters.' } : {}),
  }
  const validate = () => {
    const nextErrors = {}
    if (!email) nextErrors.email = 'Email is required.'
    else if (validationErrors.email) nextErrors.email = validationErrors.email
    if (!password) nextErrors.password = 'Password is required.'
    else if (validationErrors.password) nextErrors.password = validationErrors.password
    return nextErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setTouched({ email: true, password: true })
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    setIsLoading(true)
    const formData = { email, password }

    try {
      const success = await loginUser(email, password) // Directly pass email and password to the login function
      if (success) {
        navigate('/customer') // Redirect on successful login
      } else {
        setErrors({ general: 'Invalid email or password' }) // Handle invalid login
      }
    } catch (error) {
      setErrors({ general: error.message }) // Handle any errors from the login function
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <Card className="overflow-hidden rounded-[26px] border-[#e7e4dd] shadow-xl shadow-[#352c1d]/5">
          <div className="bg-[#f4eadb] px-7 py-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#2f7d4a]">Shop local, live better</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em]">Welcome back.</h1><p className="mt-2 text-sm text-[#697168]">Your neighbourhood favourites are waiting.</p></div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Customer Login</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors?.general && (
                <p className="text-red-500 text-sm text-center">{errors.general}</p>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((current) => ({ ...current, general: '' })) }}
                  onBlur={() => setTouched((fields) => ({ ...fields, email: true }))}
                />
                {touched.email && <p className="text-xs font-medium text-[#b64437]">{!email ? 'Email is required.' : validationErrors.email}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-urbanhive-600 hover:text-urbanhive-700">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((current) => ({ ...current, general: '' })) }}
                  onBlur={() => setTouched((fields) => ({ ...fields, password: true }))}
                />
                {touched.password && <p className="text-xs font-medium text-[#b64437]">{!password ? 'Password is required.' : validationErrors.password}</p>}
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-urbanhive-600 hover:text-urbanhive-700 font-medium">
                Sign up
              </Link>
            </div>
            <div className="text-sm text-center text-gray-500">
              Are you a vendor?{' '}
              <Link to="/vendor/login" className="text-urbanhive-600 hover:text-urbanhive-700 font-medium">
                Vendor Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage;
