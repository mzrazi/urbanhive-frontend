import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'  // Importing useAuth
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'

const VendorLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const { loginVendor } = useAuth()  // Using the login function from the AuthContext
  const validationErrors = {
    ...(email && !/^\S+@\S+\.\S+$/.test(email) ? { email: 'Enter a valid email address.' } : {}),
    ...(password && password.length < 6 ? { password: 'Password must be at least 6 characters.' } : {}),
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!email || !password || Object.keys(validationErrors).length) return setErrors({ general: 'Please correct the highlighted fields.' })
    setErrors({})
    setIsLoading(true)

    try {
      await loginVendor(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <Card className="overflow-hidden rounded-[26px] border-[#e7e4dd] shadow-xl shadow-[#352c1d]/5">
          <div className="bg-[#182018] px-7 py-7 text-white">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a8d5b4]">UrbanHive for business</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em]">Welcome back.</h1>
            <p className="mt-2 text-sm text-white/65">Manage your local store in one place.</p>
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-extrabold">Sign in to your store</CardTitle>
            <CardDescription>
              Enter your email and password to access your vendor dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && <p className="text-center text-sm text-[#b64437]">{errors.general}</p>}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({}) }}
                  onBlur={() => setTouched((fields) => ({ ...fields, email: true }))}
                />
                {touched.email && <p className="text-xs font-medium text-[#b64437]">{!email ? 'Email is required.' : validationErrors.email}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/vendor/forgot-password" className="text-sm text-urbanhive-600 hover:text-urbanhive-700">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({}) }}
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
              Don't have a vendor account?{' '}
              <Link to="/vendor/register" className="text-urbanhive-600 hover:text-urbanhive-700 font-medium">
                Register as a Vendor
              </Link>
            </div>
            <div className="text-sm text-center text-gray-500">
              Are you a customer?{' '}
              <Link to="/login" className="text-urbanhive-600 hover:text-urbanhive-700 font-medium">
                Customer Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default VendorLoginPage
