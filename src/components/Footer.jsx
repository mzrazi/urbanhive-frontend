import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-urbanhive-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">UrbanHive</h3>
            <p className="text-gray-300">
              Your one-stop multi-vendor delivery platform for local businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white">Products</Link>
              </li>
              <li>
                <Link to="/vendors" className="text-gray-300 hover:text-white">Vendors</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">For Vendors</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/vendor/login" className="text-gray-300 hover:text-white">Vendor Login</Link>
              </li>
              <li>
                <Link to="/vendor/register" className="text-gray-300 hover:text-white">Become a Vendor</Link>
              </li>
              <li>
                <Link to="/vendor-guide" className="text-gray-300 hover:text-white">Vendor Guide</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: support@urbanhive.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Market St, San Francisco, CA 94103</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2025 UrbanHive. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer