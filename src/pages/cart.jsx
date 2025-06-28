import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../hooks/use-toast";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
    try {
      const userData = localStorage.getItem("urbanhive_user");
      if (!userData) return console.warn("User not logged in");

      const user = JSON.parse(userData);
      if (!user.id) return console.warn("Invalid user data");

      // Wrap geolocation in a promise
      const getPosition = () =>
        new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );

      try {
        const position = await getPosition();
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const { data } = await axios.post(
          "http://localhost:5000/api/users/cart/details",
          { userid: user.id, lat, lng }
        );

        setCartItems(data.cart);
        setSubtotal(data.subtotal);
        setDiscount(data.discount);
        setDeliveryCharge(data.deliveryCharge);
        setGrandTotal(data.grandTotal);
      } catch (geoError) {
        console.warn("Location denied or error, falling back");
        await fetchCartWithoutLocation(user.id);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  const fetchCartWithoutLocation = async (userid) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/cart/details", { userid });
      setCartItems(data.cart);
      setSubtotal(data.subtotal);
      setDiscount(data.discount);
      setDeliveryCharge(data.deliveryCharge);
      setGrandTotal(data.grandTotal);
    } catch (error) {
      console.error("Error fetching cart without location:", error);
      // toast({
      //   title: "Cart fetch failed",
      //   description: "Unable to fetch cart. Please try again.",
      //   variant: "destructive",
      // });
    }
  };

  const handleQuantityChange = async (productId, action) => {
    try {
      const userData = localStorage.getItem("urbanhive_user");
      const user = JSON.parse(userData);
      const updatedItem = cartItems.find((item) => item.product._id === productId);
      if (!updatedItem) return;

      let newQuantity = updatedItem.quantity;
      if (action === "increase") newQuantity++;
      if (action === "decrease" && newQuantity > 1) newQuantity--;

      await axios.put("http://localhost:5000/api/users/cart/update", {
        userid: user.id,
        productid: productId,
        quantity: newQuantity,
      });

      fetchCartDetails();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const userData = localStorage.getItem("urbanhive_user");
      const user = JSON.parse(userData);

      await axios.delete("http://localhost:5000/api/users/cart/remove", {
        data: { userid: user.id, productId },
      });

      fetchCartDetails();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      const userData = localStorage.getItem("urbanhive_user");
      const user = JSON.parse(userData);

      await axios.put("http://localhost:5000/api/users/cart/clear", { userid: user.id });
      setCartItems([]);
      setSubtotal(0);
      setDiscount(0);
      setDeliveryCharge(0);
      setGrandTotal(0);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const userData = localStorage.getItem("urbanhive_user");
      if (!userData) return console.warn("User not logged in");

      const user = JSON.parse(userData);
      if (!user.id) return console.warn("Invalid user data");

      const orderData = {
        userId: user.id,
        vendorId: cartItems[0]?.product.vendor,
        products: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount: grandTotal,
      };

      const response = await axios.post("http://localhost:5000/api/users/create-order", orderData);
      const { razorpayOrderId, razorpayPaymentKey } = response.data;

      const options = {
        key: razorpayPaymentKey,
        amount: grandTotal * 100,
        currency: "INR",
        order_id: razorpayOrderId,
        name: "UrbanHive Store",
        description: "Order Payment",
        image: "https://example.com/logo.png",
        handler: async function (response) {
          try {
            if (!response.razorpay_payment_id) {
              console.warn("Payment failed, order not saved.");
              return;
            }

            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            await axios.post("http://localhost:5000/api/users/save-order", paymentData);
            navigate("/order-success");
          } catch (error) {
            console.error("Error saving order:", error);
            toast({
              title: "Payment failed",
              description: "Could not save order. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <section className="text-center text-white py-12 bg-gradient-to-r from-urbanhive-800 to-urbanhive-600 rounded-lg">
        <h1 className="text-4xl font-bold">Your Cart</h1>
        <p className="text-lg mt-2">Review your items before checkout</p>
      </section>

      {loading ? (
        <p className="text-center mt-6">Loading...</p>
      ) : cartItems.length > 0 ? (
        <>
          <section className="mt-12">
            <h2 className="text-2xl font-bold">Cart Items</h2>
            <div className="space-y-4 mt-4">
              {cartItems.map((item) => (
                <div key={item.product._id} className="border p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={`http://localhost:5000${item.product.image}`}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-gray-600">₹{item.product.price} each</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, "decrease")}
                          className="px-2 py-1 bg-gray-300 rounded-md text-sm"
                        >
                          -
                        </button>
                        <span className="text-lg font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, "increase")}
                          className="px-2 py-1 bg-gray-300 rounded-md text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => handleRemoveItem(item.product._id)} className="text-red-500 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>₹{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Delivery Charges</p>
                  <p>₹{deliveryCharge.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Discount</p>
                  <p className="text-green-600">-₹{discount.toFixed(2)}</p>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <p>Grand Total</p>
                    <p>₹{grandTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <button onClick={handleSubmit} className="w-full mt-6 px-6 py-2 bg-urbanhive-600 text-white rounded-md hover:bg-urbanhive-700">
                Proceed to Checkout
              </button>
              <button onClick={handleClearCart} className="w-full mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-700">
                Clear Cart
              </button>
            </div>
          </section>
        </>
      ) : (
        <p className="text-center mt-12">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
