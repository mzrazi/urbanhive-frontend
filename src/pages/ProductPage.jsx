import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Filter, Search } from "lucide-react";
import { useParams } from "react-router-dom";


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { vendorId } = useParams();
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
       
        const response = await axios.get(`http://localhost:5000/api/vendors/products/${vendorId}`);
        
        console.log(response);
        
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Search Section */}
      {/* <div className="flex justify-between mb-4 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            placeholder="Search for products..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div> */}

      {/* Loading and Error Messages */}
      {loading && <p className="text-center text-gray-600">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-center col-span-full">No products found.</p>
        )}

        {!loading &&
          !error &&
          filteredProducts.map((product) => (
            <Card key={product._id} className="p-4 flex flex-col gap-2">
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="rounded-lg h-40 object-cover"
              />
              <CardContent className="p-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.vendor}</p>
                <p className="text-xl font-bold mt-1">₹{product.price}</p>
                <Button className="mt-2 w-full flex items-center gap-2">
                  <ShoppingCart size={16} /> Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
