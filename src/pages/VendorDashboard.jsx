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
  const [vendorProducts, setVendorProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const stats = {
    totalOrders: '1,234',
    totalVendors: '56',
    totalUsers: '2,345',
    revenue: '$45,678'
  };


  // Mock data for demonstration (replace with actual API call)
  // useEffect(() => {
  //   const fetchVendorProducts = async () => {
  //     try {
  //       // Replace with your actual API endpoint
  //       const res = await axios.get("/api/vendor/products");
  //       setVendorProducts(res.data);
  //     } catch (error) {
  //       console.error("Error fetching vendor products:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Simulate API call delay
  //   setTimeout(() => {
  //     fetchVendorProducts();
  //   }, 1000);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [productsRes, vendorsRes] = await Promise.all([
        //   axios.get("/api/products/featured"),
        //   axios.get("/api/vendors/popular"),
        // ]);
       
          
          setVendorProducts(data)
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          className="mt-6 inline-block bg-white  text-urbanhive-800 hover:bg-urbanhive-100 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
        >
          Add New Product
        </Link>


        <Link
          to="/vendor/orders"
          className="mt-6 inline-block bg-white  text-urbanhive-800 hover:bg-urbanhive-100 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
        >
         orders recieved
        </Link>

        </div>
      </section>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard
          title="Total products"
          value={stats.totalVendors}
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
          value={stats.revenue}
          icon={DollarSign}
          color="bg-yellow-500"
        />
      </div>
    </div>
  );
};

export default VendorDashboard;