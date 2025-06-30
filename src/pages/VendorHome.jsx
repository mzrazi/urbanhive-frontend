import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const VendorHome = () => {
  const [vendorProducts, setVendorProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const storedVendor = JSON.parse(localStorage.getItem("urbanhive_user"));
        console.log(storedVendor);
        
        if (!storedVendor) {
          console.error("Vendor ID not found in storage.");
          return;
        }
        const vendorId=storedVendor._id
    
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/products/${vendorId}`);
    
        setVendorProducts(res.data);
      } catch (error) {
        console.error("Error fetching vendor products:", error);
      } finally {
        setLoading(false);
      }
    };
   

    // Simulate API call delay
    setTimeout(() => {
      fetchVendorProducts();
    }, 1000);
  }, []);
  const handleDelete = async (productid) => {
    setLoading(true);  // Show loading indicator
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/delete-product/${productid}`);

      if (response.status === 200) {
        // Product successfully deleted, show success message
        alert('Product deleted successfully');
        // Optionally, navigate back to the product list or refresh the page
        navigate(`/vendor/products`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert('Failed to delete the product');
    } finally {
      setLoading(false);  // Hide loading indicator
    }
  };

  

  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-white">Welcome to UrbanHive</h1>
        <p className="text-lg text-gray-200 mt-2">
          Manage and showcase your products with ease
        </p>
        <div className="flex space-x-6 justify-center">
        <Link
          to="/vendor/add-product"
          className="mt-6 inline-block bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
        >
          Add New Product
        </Link>

        <Link
          to="/vendor/add-product"
          className="mt-6 inline-block bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
        >
          update product
        </Link>



        <Link
          to="/vendor/orders"
          className="mt-6 inline-block bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
        >
         orders recieved
        </Link>

        </div>
      </section>

      {/* Loading State */}
      {loading ? (
        <div className="text-center mt-12">
          <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your products...</p>
        </div>
      ) : (
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vendorProducts.length > 0 ? (
              vendorProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mt-2">₹{product.price}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <Link
                        to={`/vendor/edit-product/${product._id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <button
         onClick={() => handleDelete(product._id)}
          className="text-red-500 hover:text-red-700"
          disabled={loading}  // Disable button while deleting
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No products found. Add your first product!</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default VendorHome;