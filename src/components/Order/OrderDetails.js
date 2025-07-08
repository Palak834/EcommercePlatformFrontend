import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function OrderDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api.get(`/order/${id}`)
      .then(res => {
        console.log('Order details response:', res.data); // Debug log
        setOrder(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load order:', err);
        setError('Failed to load order');
        setLoading(false);
      });
  }, [id, user, navigate]);

  if (loading) return <p className="text-center mt-10 text-purple-800">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!order) return <p className="text-center mt-10 text-red-600">Order not found</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <header className="bg-purple-700 text-white py-4 px-6">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">EShoppingZone</Link>
        </div>
      </header>
      <main className="flex-grow p-6 flex justify-center items-center">
        <div className="max-w-md bg-white bg-opacity-70 p-6 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">Order #{order.orderId || 'N/A'}</h2>
          <p className="text-gray-700">Status: {order.orderStatus || 'N/A'}</p>
          <p className="text-gray-700">Total Amount: ${order.totalAmount ? order.totalAmount.toFixed(2) : 'N/A'}</p>
          <p className="text-gray-700">Date: {order.orderDate || 'N/A'}</p>
          <p className="text-gray-700">Quantity: {order.quantity || 'N/A'}</p>
        </div>
      </main>
      <footer className="bg-purple-700 text-white text-center py-4">
        © 2025 E-ShoppingZone. All rights reserved.
      </footer>
    </div>
  );
}