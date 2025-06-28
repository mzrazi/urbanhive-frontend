import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const ViewProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/view-product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product:", err));

    const fetchCart = async () => {
      try {
        const userData = localStorage.getItem("urbanhive_user");
        if (!userData) return console.warn("User not logged in");

        const user = JSON.parse(userData);
        if (!user.id) return console.warn("Invalid user data");

        const res = await axios.get(`http://localhost:5000/api/users/cart/${user.id}`);
        setCart(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [id]);

  // ✅ Add to Cart Function (Copied from ProductsPage)
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
      await axios.put("http://localhost:5000/api/users/cart/clear", { userid: user.id });
      setCart([]);
    }

    try {
      const userData = localStorage.getItem("urbanhive_user");
      const user = JSON.parse(userData);
      const existingProduct = cart.find((item) => item?.product?._id === product._id);

      if (existingProduct) {
        // Increase quantity if product already exists in cart
        await axios.put(`http://localhost:5000/api/users/cart/update`, {
          userid: user.id,
          productid: existingProduct.product._id,
          quantity: existingProduct.quantity + 1,
        });

        setCart((prev) =>
          prev.map((item) =>
            item.product._id === existingProduct.product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        // Add new product to cart
        const res = await axios.post("http://localhost:5000/api/users/cart/add", {
          userid: user.id,
          productId: product._id,
          vendorId: product.vendorId,
          quantity: 1,
        });

        setCart([...cart, res.data]);
        toast({
          title: "Added to Cart",
          description: "Item added to cart successfully",
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast({
        title: "Couldn't Add to Cart",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (!product) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            className="w-[400px] h-[400px] object-cover rounded-xl shadow-lg border border-gray-200"
          />
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-2xl text-gray-600 my-2 font-semibold">₹{product.price}</p>
          <p className="text-gray-700 text-md leading-relaxed">{product.description}</p>

          {/* ✅ Add to Cart Button with function */}
          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-md transition-all duration-300 flex items-center gap-2"
            onClick={() => handleAddToCart(product)}
          >
            <ShoppingCart size={20} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
