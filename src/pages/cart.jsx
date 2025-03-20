import { useState, useEffect } from "react";
import { Link,useNavigate  } from "react-router-dom";
import axios from "axios";


const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(5); // Example delivery charge
  const [discount, setDiscount] = useState(10); // Example discount
  const [grandTotal, setGrandTotal] = useState(0);
   const navigate = useNavigate()

  useEffect(() => {
    // Simulate fetching cart items from localStorage or an API
    const cartData = [
      {
        id: "1",
        name: "Organic Vegetables Bundle",
        price: 24.99,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1789&q=80",
      },
      {
        id: "2",
        name: "Handcrafted Leather Wallet",
        price: 49.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      },
    ];

    // Set cart items and calculate subtotal
    setCartItems(cartData);
    const subtotal = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(subtotal);
    setGrandTotal(subtotal + deliveryCharge - discount);
    setLoading(false);
  }, []);

  const handleQuantityChange = (id, action) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === id) {
        if (action === "increase") {
          item.quantity += 1;
        } else if (action === "decrease" && item.quantity > 1) {
          item.quantity -= 1;
        }
      }
      return item;
    });

    setCartItems(updatedCartItems);
    const subtotal = updatedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(subtotal);
    setGrandTotal(subtotal + deliveryCharge - discount);
  };

  const handleRemoveItem = (id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
    const subtotal = updatedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(subtotal);
    setGrandTotal(subtotal + deliveryCharge - discount);
  };

  const handleSubmit = async () => {
 
  
    setError('');
    setLoading(true);
  
    try {
      // 1. Request backend to create order
      const response = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(amount) * 100 }) // Convert to paise
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
  
      const orderData = await response.json();
  
  
      // 2. Check if Razorpay SDK is loaded
      if (!window.Razorpay) {
        setError('Razorpay SDK failed to load. Are you online?');
        resetMessage(setError);
        setLoading(false);
        return;
      }
  
      // 3. Setup Razorpay options
      const options = {
        key: "rzp_test_6i5nQKZQNF4RNj",
        amount: orderData.orderAmount,
        currency: "INR",
        name: "Masjid Donation",
        description: "Support our Masjid",
        order_id: orderData.orderId,
        handler: async function (response) {
          console.log(response);
  
          const paymentDetails = {
            userId,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: orderData.orderAmount,
            paymentDate: new Date().toISOString()
          };
  
          setLoading(true);
          try {
            const verifyResponse = await fetch('http://localhost:5000/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(paymentDetails)
            });
  
            const verifyData = await verifyResponse.json();
            if (verifyData.status === 'success') {
              setSuccess('Donation successful. Thank you!');
              resetMessage(setSuccess);
              setAmount('');
            } else {
              setError('Payment verification failed. Please try again.');
              resetMessage(setError);
            }
          } catch (error) {
            setError('Error sending payment details. Please try again.');
            resetMessage(setError);
          } finally {
            setLoading(false);
          }
        },
        theme: {
          color: "#3399cc"
        }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
  
      setTimeout(() => {
        if (!rzp._modal) {
          setError('Payment modal failed to open. Please try again.');
          resetMessage(setError);
          setLoading(false);
        }
      }, 5000); // 5 seconds
    } catch (error) {
      setError(error.message || 'Error initiating payment. Please try again later.');
      resetMessage(setError);
    } finally {
      setLoading(false);
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
      ) : (
        <>
          {cartItems.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-2xl font-bold">Cart Items</h2>
              <div className="space-y-4 mt-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                      <div className="ml-4">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">${item.price} each</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, "decrease")}
                            className="px-2 py-1 bg-gray-300 rounded-md text-sm"
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, "increase")}
                            className="px-2 py-1 bg-gray-300 rounded-md text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="mt-12 text-center">
              <p>Your cart is empty.</p>
              <Link to="/" className="text-urbanhive-600 hover:text-urbanhive-700 font-medium mt-4 block">
                Continue Shopping
              </Link>
            </section>
          )}

          {cartItems.length > 0 && (
            <section className="mt-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Delivery Charges</p>
                    <p>${deliveryCharge.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Discount</p>
                    <p className="text-green-600">-${discount.toFixed(2)}</p>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <p>Grand Total</p>
                      <p>${grandTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <button
                  
                  className="w-full mt-6 px-6 py-2 bg-urbanhive-600 text-white rounded-md hover:bg-urbanhive-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;