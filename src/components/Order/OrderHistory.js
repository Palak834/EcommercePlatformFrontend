import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function OrderHistory() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api.get(`/order/user/${user.userId}`)
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load orders:', err);
        setError('Failed to load orders');
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <p className="text-center mt-10 text-purple-800">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <header className="bg-purple-700 text-white py-4 px-6">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">EShoppingZone</Link>
        </div>
      </header>
      <main className="flex-grow p-6">
        <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-700">No orders found</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.orderId} className="bg-white bg-opacity-70 p-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
                <p className="text-gray-700">Order #{order.orderId}</p>
                <p className="text-gray-700">Status: {order.orderStatus}</p>
                <p className="text-gray-700">Total Amount: ${order.totalAmount}</p>
                <p className="text-gray-700">Date: {order.orderDate}</p>
                <Link
                  to={`/orders/${order.orderId}`}
                  className="mt-2 inline-block bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition shadow-md"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="bg-purple-700 text-white text-center py-4">
        © 2025 E-ShoppingZone. All rights reserved.
      </footer>
    </div>
  );
}