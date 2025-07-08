import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function Payment() {
  const { orderId } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth loading to complete
    }

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Validate orderId
    if (!orderId || orderId === 'undefined') {
      setError('Invalid order ID. Please try checking out again.');
      setPageLoading(false);
      return;
    }

    setPageLoading(false);
  }, [user, authLoading, orderId, navigate]);

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }
    try {
      await api.post(`/payment/user/${user.userId}/order/${orderId}`, {
        paymentMethod,
        paymentStatus: 'COMPLETED'
      });
      navigate('/orders', { replace: true });
    } catch (err) {
      console.error('Payment failed:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  if (authLoading || pageLoading) {
    return <p className="text-center mt-10 text-purple-800">Loading...</p>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
        <header className="bg-purple-700 text-white py-4 px-6">
          <div className="container mx-auto">
            <Link to="/" className="text-2xl font-bold">EShoppingZone</Link>
          </div>
        </header>
        <main className="flex-grow p-6 flex items-center justify-center">
          <div className="max-w-md bg-white bg-opacity-70 p-6 rounded-xl shadow-2xl">
            <p className="text-red-600 mb-4 text-center">{error}</p>
            <button
              onClick={() => navigate('/cart', { replace: true })}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md"
            >
              Back to Cart
            </button>
          </div>
        </main>
        <footer className="bg-purple-700 text-white text-center py-4">
          © {new Date().getFullYear()} E-ShoppingZone. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <header className="bg-purple-700 text-white py-4 px-6">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">EShoppingZone</Link>
        </div>
      </header>
      <main className="flex-grow p-6 flex items-center justify-center">
        <div className="max-w-md bg-white bg-opacity-70 p-6 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">Payment for Order #{orderId}</h2>
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="">Select a method</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          <button
            onClick={handlePayment}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md"
          >
            Pay Now
          </button>
        </div>
      </main>
      <footer className="bg-purple-700 text-white text-center py-4">
        © 2025 E-ShoppingZone. All rights reserved.
      </footer>
    </div>
  );
}