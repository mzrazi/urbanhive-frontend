import React, { useEffect, useState } from "react";
import OrderProductsModal from "../components/OrderProductsModal";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = localStorage.getItem("urbanhive_user");
      if (!storedUser) {
        console.error("Vendor ID not found in localStorage");
        return;
      }

      const vendorData = JSON.parse(storedUser);
      const vendorId = vendorData._id; // Ensure this matches your backend field

      try {
        const response = await fetch(
          `http://localhost:5000/api/vendors/get-orders/${vendorId}`
        );
        const data = await response.json();
        console.log(data);
        
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Vendor Orders</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{order._id}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      ${order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.orderStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.orderStatus === "Out for Delivery"
                            ? "bg-blue-100 text-blue-800"
                            : order.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openModal(order)}
                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition"
                      >
                        View Products
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Products Modal */}
      <OrderProductsModal isOpen={isModalOpen} onClose={closeModal} order={selectedOrder} />
    </div>
  );
};

export default VendorOrders;
