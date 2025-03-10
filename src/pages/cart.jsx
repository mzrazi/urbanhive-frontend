import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Simulate fetching cart items from localStorage or an API
    const cartData = [
      {
        id: '1',
        name: 'Organic Vegetables Bundle',
        price: 24.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1789&q=80',
      },
      {
        id: '2',
        name: 'Handcrafted Leather Wallet',
        price: 49.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      },
    ];

    // Set cart items and calculate total price
    setCartItems(cartData);
    setTotal(cartData.reduce((acc, item) => acc + item.price * item.quantity, 0));
    setLoading(false);
  }, []);

  const handleQuantityChange = (id, action) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === id) {
        if (action === 'increase') {
          item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
          item.quantity -= 1;
        }
      }
      return item;
    });

    setCartItems(updatedCartItems);
    setTotal(updatedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
  };

  const handleRemoveItem = (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
    setTotal(updatedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
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
                            onClick={() => handleQuantityChange(item.id, 'decrease')}
                            className="px-2 py-1 bg-gray-300 rounded-md text-sm"
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 'increase')}
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
              <div className="flex justify-between items-center border-t pt-6">
                <h3 className="text-xl font-semibold">Total: ${total.toFixed(2)}</h3>
                <Link to="/checkout" className="px-6 py-2 bg-urbanhive-600 text-white rounded-md">
                  Proceed to Checkout
                </Link>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
