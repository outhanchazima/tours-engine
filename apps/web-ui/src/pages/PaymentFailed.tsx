import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please try again or contact support if the problem
          persists.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="block w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
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

export default PaymentFailed;