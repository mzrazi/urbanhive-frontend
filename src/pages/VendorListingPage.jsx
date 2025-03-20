import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VendorListingPage = () => {
  const [vendorsByCategory, setVendorsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendors = async (coordinates) => {
    try {
      // Fetch vendors based on coordinates (replace with your API endpoint)
      const response = await axios.get(
        `http://localhost:5000/api/users/nearby?lat=${coordinates.latitude}&lng=${coordinates.longitude}`
      );
      const vendors = response.data;
                // const vendors=[
                //     {
                //       "id": 1,
                //       "name": "Tech Haven",
                //       "location": "New York, USA",
                //       "rating": 4.5,
                //       "logo": "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg",
                //       "category": "Electronics"
                //     },
                //     {
                //       "id": 2,
                //       "name": "Gadget Galaxy",
                //       "location": "San Francisco, USA",
                //       "rating": 4.7,
                //       "logo": "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg",
                //       "category": "Electronics"
                //     },
                //     {
                //       "id": 3,
                //       "name": "Organic Bites",
                //       "location": "London, UK",
                //       "rating": 4.2,
                //       "logo": "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg",
                //       "category": "Restaurants"
                //     }
                //   ]
      // Group vendors by category
      const groupedVendors = vendors.reduce((acc, vendor) => {
        if (!acc[vendor.category]) {
          acc[vendor.category] = [];
        }
        acc[vendor.category].push(vendor);
        return acc;
      }, {});

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
    // Automatically fetch vendors when the component mounts
    handleUseCurrentLocation();
  }, []);

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
                        src={vendor.logo||"https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg"}
                        alt={`${vendor.storeName} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{vendor.storeName}</h3>
                          <p className="text-sm text-gray-500">
                          {vendor.storeAddress}
                        </p>

                        <div className="flex justify-center items-center mt-2">
                          <span className="mr-2 text-yellow-500">
                            {'★'.repeat(Math.floor(vendor.rating))}
                          </span>
                          <span className="text-gray-600">({vendor.rating})</span>
                        </div>
                      </div>
                      {/* <Link to={`/products/${vendor.id}`}> */}

                      <Link to={`/products/${vendor._id}`}>
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