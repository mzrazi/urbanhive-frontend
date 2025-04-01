import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
// Default category images for products (if category exists, else fallback to a default image)
const categoryDefaultImages = {
  Clothing: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg",
  Grocery: "https://images.pexels.com/photos/5945721/pexels-photo-5945721.jpeg",
  "Sports Goods": "https://images.pexels.com/photos/3997982/pexels-photo-3997982.jpeg",
  Furniture: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
  Electronics: "https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg",
  Books: "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg",
  "Beauty & Personal Care": "https://images.pexels.com/photos/6621180/pexels-photo-6621180.jpeg",
  "Toys & Games": "https://images.pexels.com/photos/3661190/pexels-photo-3661190.jpeg",
  "Home Appliances": "https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg",
  Automotive: "https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg",
  "Health & Wellness": "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg",
  Jewelry: "https://images.pexels.com/photos/1550048/pexels-photo-1550048.jpeg",
  "Pet Supplies": "https://images.pexels.com/photos/4588018/pexels-photo-4588018.jpeg",
  Others: "https://images.pexels.com/photos/357514/pexels-photo-357514.jpeg",
};

const UserHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularVendors, setPopularVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/homepage");
        console.log(response);

        // Fetch from backend
        setFeaturedProducts(response.data.featuredProducts);
        setPopularVendors(response.data.popularVendors);
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
      <section className="text-center text-white py-12 bg-gradient-to-r from-urbanhive-800 to-urbanhive-600 rounded-lg">
        <h1 className="text-4xl font-bold ">Welcome to UrbanHive</h1>
        <p className="text-lg mt-2">Your one-stop shop for local businesses</p>
      </section>

      {loading ? (
        <p className="text-center mt-6">Loading...</p>
      ) : (
        <>
          {/* Featured Products */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {featuredProducts.map((product) => (
                <Link to={'/vendors'}>
                  <Card className="p-4 flex flex-col gap-2 h-[400px]">
                    <div className="w-full h-48 overflow-hidden rounded-lg">
                      <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.vendor}</p>
                        <p className="text-xl font-bold mt-1">₹{product.price}</p>
                      </div>
                      <Button className="mt-2 w-full flex items-center gap-2">
                        <ShoppingCart size={16} /> Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
  <h2 className="text-2xl font-bold">Popular Vendors</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
    {popularVendors.map((vendor) => (
      <Card key={vendor.id} className="p-4 flex flex-col gap-2 h-[300px]">
        <div className="w-full h-32 overflow-hidden rounded-lg">
          <img
            src={vendor.logo || categoryDefaultImages[vendor.category] || "https://via.placeholder.com/150"}
            alt={`${vendor.name} logo`}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-2 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg">{vendor.name}</h3>
            <p className="text-sm text-gray-500">{vendor.address}</p>

            <div className="flex justify-center items-center mt-2">
              {/* Render 5 stars with possible half stars */}
              {Array.from({ length: 5 }, (_, index) => {
                const ratingFloor = Math.floor(vendor.averageRating);
                const ratingDecimal = vendor.averageRating - ratingFloor;

                // Full star
                if (index < ratingFloor) {
                  return (
                    <span key={index} className="mr-1 text-yellow-500">
                      <FaStar />
                    </span>
                  );
                }

                // Half star
                if (index === ratingFloor && ratingDecimal >= 0.5) {
                  return (
                    <span key={index} className="mr-1 text-yellow-500">
                      <FaStarHalfAlt />
                    </span>
                  );
                }

                // Empty star
                return (
                  <span key={index} className="mr-1 text-gray-300">
                    <FaRegStar />
                  </span>
                );
              })}
              <span className="text-gray-600 ml-2">({vendor.averageRating.toFixed(1)})</span>
            </div>
          </div>
          <Link to={'/vendors'}>
            <Button className="mt-2 w-full">Visit Store</Button>
          </Link>
        </CardContent>
      </Card>
    ))}
  </div>
</section>

        </>
      )}
    </div>
  );
};

export default UserHome;
