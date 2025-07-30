import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const VendorListingPage = () => {
  const [vendorsByCategory, setVendorsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  const fetchVendors = async (coordinates) => {
    try {
      
      
      // Fetch vendors based on coordinates (replace with your API endpoint)
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/nearby?lat=${coordinates.latitude}&lng=${coordinates.longitude}`
      );
      const vendors = response.data;
              

      
      const groupedVendors = vendors.reduce((acc, vendor) => {
        if (!acc[vendor.category]) {
          acc[vendor.category] = [];
        }
        acc[vendor.category].push(vendor);
        return acc;
      }, {});
      console.log(groupedVendors);
      
      setVendorsByCategory(groupedVendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Failed to fetch vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError("");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchVendors({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Failed to get your current location.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    
    handleUseCurrentLocation();
  }, []);

  const categoryDefaultImages = {
    Clothing: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg",
    Grocery: "https://images.pexels.com/photos/5945721/pexels-photo-5945721.jpeg",
    "Sports Goods": "https://images.pexels.com/photos/3997982/pexels-photo-3997982.jpeg",
    Furniture: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
    "Spare Parts": "https://images.pexels.com/photos/4488647/pexels-photo-4488647.jpeg",
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
  

  return (
    <div className="container mx-auto p-6">
      <section className="text-center text-white py-12 bg-gradient-to-r from-urbanhive-800 to-urbanhive-600 rounded-lg">
        <h1 className="text-4xl font-bold">Find Vendors Near You</h1>
        <p className="text-lg mt-2">Discover local businesses in your area</p>
        <div className="mt-6 flex justify-center">
          <Button onClick={handleUseCurrentLocation}>
            Use My Current Location
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </section>

      {loading ? (
        <p className="text-center mt-6">Loading...</p>
      ) : (
        <>
          {Object.entries(vendorsByCategory).map(([category, vendors]) => (
            <section key={category} className="mt-12">
              <h2 className="text-2xl font-bold">{category}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {vendors.map((vendor) => (
                 <Card key={vendor.id} className="p-4 flex flex-col gap-2 h-[300px]">
                 <div className="w-full h-32 overflow-hidden rounded-lg">
                   <img
                     src={vendor.logo || categoryDefaultImages[vendor.category] || "https://via.placeholder.com/150"}
                     alt={`${vendor.storeName} logo`}
                     className="w-full h-full object-cover"
                   />
                 </div>
                 <CardContent className="p-2 flex-1 flex flex-col justify-between">
                   <div>
                     <h3 className="font-semibold text-lg">{vendor.storeName}</h3>
                     <p className="text-sm text-gray-500">{vendor.storeAddress}</p>
                     

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
                   <Link to={`/customer/products/${vendor._id}`}>
                     <Button className="mt-2 w-full">Visit Store</Button>
                   </Link>
                 </CardContent>
               </Card>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
};

export default VendorListingPage;