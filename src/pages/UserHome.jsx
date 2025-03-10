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

          const data2 = [
            {
              id: 1,
              name: "Tech Haven",
              location: "New York, USA",
              rating: 4.5,
              logo: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg", // Futuristic tech-themed image
            },
            {
              id: 2,
              name: "Gadget Galaxy",
              location: "San Francisco, USA",
              rating: 4.7,
              logo: "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg", // Modern gadget-themed image
            },
            {
              id: 3,
              name: "Electro World",
              location: "London, UK",
              rating: 4.2,
              logo: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg", // Tech-themed image with circuit boards
            },
            {
              id: 4,
              name: "Smart Solutions",
              location: "Berlin, Germany",
              rating: 4.8,
              logo: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg", // Smart device-themed image
            },
            {
              id: 5,
              name: "Future Tech",
              location: "Tokyo, Japan",
              rating: 4.6,
              logo: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg", // Futuristic tech-themed image
            },
            {
              id: 6,
              name: "Innovate Inc.",
              location: "Sydney, Australia",
              rating: 4.4,
              logo: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg", // Innovation-themed image
            },
            {
              id: 7,
              name: "Tech Titans",
              location: "Toronto, Canada",
              rating: 4.3,
              logo: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg", // Tech-themed image
            },
            {
              id: 8,
              name: "Digital Dreams",
              location: "Paris, France",
              rating: 4.9,
              logo: "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg", // Digital-themed image
            },
          ];
       
          
          setFeaturedProducts(data)
        setPopularVendors(data2);
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
        <img 
          src={vendor.logo} 
          alt={`${vendor.name} logo`} 
          className="w-24 h-24 object-contain mx-auto" 
        />
        <h3 className="mt-2 font-semibold">{vendor.name}</h3>
        <p className="text-gray-600">{vendor.location}</p>
        <div className="flex justify-center items-center mt-2">
          <span className="mr-2 text-yellow-500">{'★'.repeat(Math.floor(vendor.rating))}</span>
          <span className="text-gray-600">({vendor.rating})</span>
        </div>
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