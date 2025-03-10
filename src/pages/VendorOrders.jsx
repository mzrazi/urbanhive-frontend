import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";
import OrderTimeline from "../components/OrderTimeline"; // Import the OrderTimeline component
import OrderStatusBadge from "../components/OrderStatusBadge"; // Import the OrderStatusBadge component

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch vendor orders
  useEffect(() => {
    const fetchVendorOrders = async () => {
      try {
        // const res = await axios.get("/api/vendor/orders");
        // setOrders(res.data);

        const mockOrders = [
            {
              id: 1,
              customerName: "John Doe",
              customerEmail: "john.doe@example.com",
              customerPhone: "+1234567890",
              totalAmount: 49.99,
              items: 3,
              orderDate: "2023-10-15",
              status: "Processing",
              events: [
                {
                  id: 1,
                  status: "Pending",
                  title: "Order Placed",
                  description: "Your order has been placed.",
                  date: "2023-10-15 10:00 AM",
                },
                {
                  id: 2,
                  status: "Processing",
                  title: "Order Confirmed",
                  description: "Your order is being processed.",
                  date: "2023-10-15 11:00 AM",
                },
              ],
            },
            {
              id: 2,
              customerName: "Jane Smith",
              customerEmail: "jane.smith@example.com",
              customerPhone: "+0987654321",
              totalAmount: 99.99,
              items: 5,
              orderDate: "2023-10-14",
              status: "Delivered",
              events: [
                {
                  id: 1,
                  status: "Pending",
                  title: "Order Placed",
                  description: "Your order has been placed.",
                  date: "2023-10-14 09:00 AM",
                },
                {
                  id: 2,
                  status: "Processing",
                  title: "Order Confirmed",
                  description: "Your order is being processed.",
                  date: "2023-10-14 10:00 AM",
                },
                {
                  id: 3,
                  status: "out for delivery",
                  title: "Order is out for delivery",
                  description: "Your order has been shipped.",
                  date: "2023-10-14 12:00 PM",
                },
                {
                  id: 4,
                  status: "Delivered",
                  title: "Order Delivered",
                  description: "Your order has been delivered.",
                  date: "2023-10-15 03:00 PM",
                },
              ],
            },
          ];
          
          // Replace the API call with:
          setOrders(mockOrders);
          setLoading(false);
      } catch (error) {
        console.error("Error fetching vendor orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorOrders();
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
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order #{order.id}
                </h2>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Customer Details
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span> {order.customerName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {order.customerEmail}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {order.customerPhone}
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
                    <span className="font-medium">Items:</span> {order.items.length}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Order Date:</span> {order.orderDate}
                  </p>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Order Status Timeline
                </h3>
                <OrderTimeline status={order.status} events={order.events} />
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

export default VendorOrdersPage;