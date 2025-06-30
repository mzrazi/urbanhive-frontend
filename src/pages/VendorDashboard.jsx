import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Users, Store, ShoppingBag, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenue: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  // Call the API to fetch the vendor stats
  useEffect(() => {
    const fetchVendorStats = async () => {
      try {
        const userData = localStorage.getItem("urbanhive_user");
        if (!userData) {
          console.warn("User not logged in");
          setLoading(false);
          return;
        }
    
        const user = JSON.parse(userData);
        if (!user._id) {
          console.warn("Invalid user data");
          setLoading(false);
          return;
        }

        console.log('Fetching data for vendor:', user._id);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/dashboard/${user._id}`); // Assuming your API endpoint is this
        
        console.log('API Response:', response.data);
        const data = response.data;
        
        // Check if the data is valid before setting it
        if (data) {
          setStats({
            totalOrders: data.totalOrders || 0,
            totalProducts: data.totalProducts || 0,
            totalUsers: data.totalUsers || 0,
            revenue: data.totalRevenue || 0,
            averageRating: data.averageRating || 0,
          });
        } else {
          console.warn('No data received');
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching vendor stats:", error);
        setLoading(false);
      }
    };

    fetchVendorStats();
  }, []);

  // If loading, display loading spinner or skeleton
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-800">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-urbanhive-800 to-urbanhive-600 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-white">Welcome to Your Vendor Dashboard</h1>
        <p className="text-lg text-gray-200 mt-2">
          Manage and showcase your products with ease
        </p>
        <div className="flex space-x-6 justify-center">
          <Link
            to="/vendor/add-product"
            className="mt-6 inline-block bg-white text-urbanhive-800 hover:bg-urbanhive-100 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
          >
            Add New Product
          </Link>

          <Link
            to="/vendor/orders"
            className="mt-6 inline-block bg-white text-urbanhive-800 hover:bg-urbanhive-100 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
          >
            Orders Received
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Store}
          color="bg-green-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`} // Format as currency
          icon={DollarSign}
          color="bg-yellow-500"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating.toFixed(1)} // Show one decimal for average rating
          icon={ShoppingBag}
          color="bg-red-500"
        />
      </div>
    </div>
  );
};

export default VendorDashboard;
