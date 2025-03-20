import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const VendorHome = () => {
  const [vendorProducts, setVendorProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration (replace with actual API call)
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
    
        const res = await axios.get(`http://localhost:5000/api/vendors/products/${vendorId}`);
    
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

  // useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     // const [productsRes, vendorsRes] = await Promise.all([
    //     //   axios.get("/api/products/featured"),
    //     //   axios.get("/api/vendors/popular"),
    //     // ]);
    //     const data = [
    //         {
    //           id: '1',
    //           name: 'Organic Vegetables Bundle',
    //           vendor: 'Fresh Farms',
    //           price: 24.99,
    //           originalPrice: 29.99,
    //           discount: 17,
    //           image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1789&q=80',
    //           inStock: true
    //         },
    //         {
    //           id: '2',
    //           name: 'Handcrafted Leather Wallet',
    //           vendor: 'Artisan Goods',
    //           price: 49.99,
    //           originalPrice: 49.99,
    //           discount: 0,
    //           image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    //           inStock: true
    //         },
    //         {
    //           id: '3',
    //           name: 'Wireless Bluetooth Headphones',
    //           vendor: 'Tech World',
    //           price: 79.99,
    //           originalPrice: 99.99,
    //           discount: 20,
    //           image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    //           inStock: true
    //         },
    //         {
    //           id: '4',
    //           name: 'Handmade Ceramic Mug Set',
    //           vendor: 'Pottery Studio',
    //           price: 34.99,
    //           originalPrice: 34.99,
    //           discount: 0,
    //           image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    //           inStock: true
    //         }
    //       ]

    //       const data2 = [
    //         {
    //           id: 1,
    //           name: "Tech Haven",
    //           location: "New York, USA",
    //           rating: 4.5,
    //           logo: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg", // Futuristic tech-themed image
    //         },
    //         {
    //           id: 2,
    //           name: "Gadget Galaxy",
    //           location: "San Francisco, USA",
    //           rating: 4.7,
    //           logo: "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg", // Modern gadget-themed image
    //         },
    //         {
    //           id: 3,
    //           name: "Electro World",
    //           location: "London, UK",
    //           rating: 4.2,
    //           logo: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg", // Tech-themed image with circuit boards
    //         },
    //         {
    //           id: 4,
    //           name: "Smart Solutions",
    //           location: "Berlin, Germany",
    //           rating: 4.8,
    //           logo: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg", // Smart device-themed image
    //         },
    //         {
    //           id: 5,
    //           name: "Future Tech",
    //           location: "Tokyo, Japan",
    //           rating: 4.6,
    //           logo: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg", // Futuristic tech-themed image
    //         },
    //         {
    //           id: 6,
    //           name: "Innovate Inc.",
    //           location: "Sydney, Australia",
    //           rating: 4.4,
    //           logo: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg", // Innovation-themed image
    //         },
    //         {
    //           id: 7,
    //           name: "Tech Titans",
    //           location: "Toronto, Canada",
    //           rating: 4.3,
    //           logo: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg", // Tech-themed image
    //         },
    //         {
    //           id: 8,
    //           name: "Digital Dreams",
    //           location: "Paris, France",
    //           rating: 4.9,
    //           logo: "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg", // Digital-themed image
    //         },
    //       ];
       
          
    //       setVendorProducts(data)
        
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();
  // }, []);

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
                    src={`http://localhost:5000${product.image}`}
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
                        to={`/vendor/edit-product/${product.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <button className="text-red-500 hover:text-red-700">
                        Delete
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