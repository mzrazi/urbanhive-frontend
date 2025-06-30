import React from "react";

const OrderProductsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order #{order._id}</h2>
        
        <ul className="space-y-3">
          {order.products.map((item, index) => (
            <li key={index} className="flex items-center space-x-4 border-b pb-2">
              {/* Product Image */}
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL}${item.productId.image}`} 
                alt={item.productId.name} 
                className="w-12 h-12 object-cover rounded-md"
              />
              
              <div className="flex-1">
                {/* Product Name */}
                <p className="text-gray-700 font-medium">{item.productId.name}</p>
                
                {/* Quantity */}
                <p className="text-sm text-gray-600">Quantity: <span className="font-semibold">{item.quantity}</span></p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderProductsModal;
