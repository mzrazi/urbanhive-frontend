import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import exp from "constants";

const UserHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularVendors, setPopularVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [productsRes, vendorsRes] = await Promise.all([
        //   axios.get("/api/products/featured"),
        //   axios.get("/api/vendors/popular"),
        // ]);
        const data = [
            {
              id: '1',
              name: 'Organic Vegetables Bundle',
              vendor: 'Fresh Farms',
              price: 24.99,
              originalPrice: 29.99,
              discount: 17,
              image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1789&q=80',
              inStock: true
            },
            {
              id: '2',
              name: 'Handcrafted Leather Wallet',
              vendor: 'Artisan Goods',
              price: 49.99,
              originalPrice: 49.99,
              discount: 0,
              image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
              inStock: true
            },
            {
              id: '3',
              name: 'Wireless Bluetooth Headphones',
              vendor: 'Tech World',
              price: 79.99,
              originalPrice: 99.99,
              discount: 20,
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
              inStock: true
            },
            {
              id: '4',
              name: 'Handmade Ceramic Mug Set',
              vendor: 'Pottery Studio',
              price: 34.99,
              originalPrice: 34.99,
              discount: 0,
              image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
              inStock: true
            }
          ]
          
          setFeaturedProducts(data)
        setPopularVendors(vendorsRes.data);
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
      <section className="text-center text-white py-12 bg-gradient-to-r from-urbanhive-800 to-urbanhive-600 rounded-lg ">
        <h1 className="text-4xl font-bold ">Welcome to UrbanHive</h1>
        <p className="text-lg mt-2">Your one-stop shop for local businesses</p>
        <div className="mt-6">
          
          
        </div>
      </section>

      {loading ? (
        <p className="text-center mt-6">Loading...</p>
      ) : (
        <>
          <section className="mt-12">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="border p-4 rounded-lg">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                  <h3 className="mt-2 font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold">Popular Vendors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {popularVendors.map((vendor) => (
                <div key={vendor.id} className="border p-4 rounded-lg text-center">
                  <h3 className="mt-2 font-semibold">{vendor.name}</h3>
                  <p className="text-gray-600">{vendor.location}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default UserHome;