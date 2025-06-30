import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search } from "lucide-react";
import { Link, useParams ,useNavigate} from "react-router-dom";
import { useToast } from '../hooks/use-toast'


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { vendorId } = useParams();
  const [cart, setCart] = useState([]);
  const { toast } = useToast()
   const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/products/${vendorId}`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCart = async () => {
      try {
        const userData = localStorage.getItem("urbanhive_user");
        if (!userData) return console.warn("User not logged in");
    
        const user = JSON.parse(userData); // Parse stored user data
        console.log(user);
        
        if (!user.id) return console.warn("Invalid user data");
    
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/${user.id}`);
       console.log(res.data)
        setCart(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    

    fetchProducts();
    fetchCart();
  }, [vendorId]);

  // Add to Cart Function
  const handleAddToCart = async (product) => {

    
    if (!product || !product._id) return;
    
    
    
    // Check if cart contains items from another store
    if (cart.length > 0 && cart[0].product.vendor !== product.vendor) {

      const confirmClear = window.confirm(
        "Your cart contains items from another store. Do you want to remove them and add this item?"
      );

      if (!confirmClear) return;
      const userData = localStorage.getItem("urbanhive_user");
      const user = JSON.parse(userData);

     
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/cart/clear`, { userid: user.id });
      setCart([]);
    }

    try {
     
    
      // 2️⃣ Use optional chaining to safely access `_id`
      const existingProduct = cart.find((item) => item?.product?._id === product._id);
    

      if (existingProduct) {
        const userData = localStorage.getItem("urbanhive_user");
        const user = JSON.parse(userData);
        // Increase quantity if product already exists in cart
        const res = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/cart/update`,
          {userid:user.id,productid:existingProduct.product._id, quantity: existingProduct.quantity + 1 },
       
        );
        setCart((prev) =>
          prev.map((item) =>
            item.product._id === existingProduct.product._id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {

        const userData = localStorage.getItem("urbanhive_user");
        const user = JSON.parse(userData);
        
        // Add new product to cart
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/cart/add`,
          {userid:user.id, productId: product._id, vendorId: product.vendorId, quantity: 1 }
          
        );
        setCart([...cart, res.data]);
        toast({
          title: 'added to cart',
          description: `item added to cart succesfully`,
        })
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast({
        title: 'couldnt add to cart',
        description: `something went wrong`,
        variant: "destructive",
        
      })
    }
  };

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
            <Card key={product._id} className="p-4 flex flex-col gap-2"  onClick={() => navigate(`/view-product/${product._id}`)}>
              <img
                src={
                  product.image.startsWith("http")
                    ? product.image
                    : `${import.meta.env.VITE_API_BASE_URL}${product.image}`
                }
                alt={product.name}
                className="rounded-lg h-40 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/noimage.png";
                }}
              />
              <CardContent className="p-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-xl font-bold mt-1">₹{product.price}</p>
                <Button
                  className="mt-2 w-full flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering card click event
                    handleAddToCart(product);
                  }}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
