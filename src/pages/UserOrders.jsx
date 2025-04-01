import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";
import OrderTimeline from "../components/OrderTimeline"; // Import the OrderTimeline component
import OrderStatusBadge from "../components/OrderStatusBadge"; // Import the OrderStatusBadge component
import Rating from "../components/Rating"; // Import Rating Component

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  

  // Fetch user orders
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {

        const userData = localStorage.getItem("urbanhive_user");
        if (!userData) return console.warn("User not logged in");
    
        const user = JSON.parse(userData);
        if (!user.id) return console.warn("Invalid user data");
        const res = await axios.get(`http://localhost:5000/api/users/order-history/${user.id}`);

        console.log(res.data);
        
        setOrders(res.data);

        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user orders:", error);
        setLoading(false);
      }
    };

    fetchUserOrders();
    console.log(orders);
    
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-12">
        <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Orders</h1>

      {orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order #{order._id}
                </h2>
                <OrderStatusBadge status={order.orderStatus} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Customer Details
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span> {order.user.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {order.user.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {order.user.phone}
                  </p>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Order Summary
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Total Amount:</span> $
                    {order.totalAmount}
                  </p>
                  <p className="text-gray-600">
                 <span className="font-medium">Items:</span> {order.products.length}
                </p>

                  <p className="text-gray-600">
                    <span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Delivery Address:</span> {order.user.address}
                  </p>
                </div>
              </div>
                        {/* Ordered Items Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Ordered Items
            </h3>
            <div className="space-y-4">
                  {order.products.map((product) => {
                    if (!product.productId) return null; // Ensure productId exists

                    return (
                      <div key={product.productId._id} className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
                        {/* Product Image */}
                        <img
                          src={`http://localhost:5000${product.productId.image}` || "https://via.placeholder.com/100"}
                          alt={product.productId.name || "Product Image"} // Avoid undefined errors
                          className="w-16 h-16 object-cover rounded"
                        />

                        {/* Product Details */}
                        <div className="flex-1">
                          <h4 className="text-md font-medium text-gray-800">
                            {product.productId.name || "Unknown Product"}
                          </h4>
                          <p className="text-sm text-gray-600">Price: ${product.productId.price || "N/A"}</p>
                          <p className="text-sm text-gray-600">Quantity: {product.quantity || 1}</p>
                        </div>

                        {/* View Product Button */}
                        <a
                          href={`/product/${product.productId._id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Product
                        </a>
                      </div>
                    );
                  })}
                </div>


            
          </div>


              {/* Order Timeline */}
              {/* <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Order Status Timeline
                </h3>
                <OrderTimeline status={order.status} events={order.history} />
              </div> */}

              {/* Rating Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Your Rating
                </h3>
                <Rating rating={order.rating} orderId={order._id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No orders found.</p>
      )}
    </div>
  );
};

export default UserOrders;
