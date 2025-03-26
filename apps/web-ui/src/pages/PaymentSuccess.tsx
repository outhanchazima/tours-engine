import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. Thank you for choosing our service!
        </p>
        <div className="space-y-4">
          <Link
            to="/transactions"
            className="block w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="block w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;