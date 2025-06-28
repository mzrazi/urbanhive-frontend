import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isAuthenticated, userType } = useAuth();

  return (
    <footer className="bg-urbanhive-800 text-white text-sm py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Brand Description */}
          <div>
            <h3 className="text-lg font-bold">UrbanHive</h3>
            <p className="text-gray-300">Your one-stop multi-vendor delivery platform.</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold">Contact Us</h4>
            <p className="text-gray-300">urbanhiveonlinee@gmail.com</p>
            <p className="text-gray-300">+919212345678</p>
          </div>

          {/* Links */}
          <div className="flex flex-col space-y-2">
            <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
            
            {/* Show Raise Complaint link only for authenticated customers */}
            {isAuthenticated && userType === "customer" && (
              <Link to="/complaint" className="text-gray-400 hover:text-white">Raise a Complaint</Link>
            )}
          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-400">
          © 2025 UrbanHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
