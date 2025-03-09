import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const VendorHome = () => {
    const [vendorProducts, setVendorProducts] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchVendorProducts = async () => {
        try {
          const res = await axios.get("/api/vendor/products");
          setVendorProducts(res.data);
        } catch (error) {
          console.error("Error fetching vendor products:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVendorProducts();
    }, []);
  
    return (
      <div className="container mx-auto p-6">
        <section className="text-center py-12 bg-blue-100 rounded-lg">
          <h1 className="text-4xl font-bold text-gray-800">Vendor Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">Manage and showcase your products</p>
        </section>
  
        {loading ? (
          <p className="text-center mt-6">Loading...</p>
        ) : (
          <section className="mt-12">
            <h2 className="text-2xl font-bold">Your Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {vendorProducts.map((product) => (
                <div key={product.id} className="border p-4 rounded-lg">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                  <h3 className="mt-2 font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };
export default VendorHome;  