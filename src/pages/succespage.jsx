import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold text-green-600">Order Successfully Placed!</h1>
      <p className="mt-4">Thank you for shopping with us. Your order has been placed successfully.</p>
      <button
        onClick={() => navigate("/home")}
        className="mt-6 px-6 py-2 bg-urbanhive-600 text-white rounded-md hover:bg-urbanhive-700"
      >
        Go to Home
      </button>
    </div>
  );
};

export default OrderSuccessPage;
