// Allows admins to view and update order statuses
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const ManageOrders = () => {
  // Access user data from AuthContext
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for orders, loading, error, and retry count
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  // Available order status options
  const statusOptions = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // Fetch orders on mount and handle retries for service unavailability
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in as an admin to manage orders.');
      navigate('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      setError('Only admins can manage orders.');
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/order/all');
        console.log('Fetched orders:', response.status, response.data);
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load orders:', err.response?.status, err.response?.data || err.message);
        let errorMessage = '';
        if (err.response?.status === 403) {
          errorMessage = 'Unauthorized: Only admins can view orders. Please log in with an admin account.';
          navigate('/login');
        } else if (err.response?.status === 503) {
          if (retryCount < maxRetries) {
            setRetryCount(retryCount + 1);
            setTimeout(() => fetchOrders(), 2000); // Retry after 2 seconds
            return;
          }
          errorMessage = 'Service unavailable: The order service is currently down. Please try again later.';
        } else {
          errorMessage = `Failed to load orders (Status: ${err.response?.status || 'N/A'}): ${err.response?.data?.error || err.message}`;
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate, retryCount]);

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      console.log('Updating order status:', orderId, newStatus);
      const res = await api.put(`/order/${orderId}/status`, newStatus, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Update order response:', res.status, res.data);
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      alert('Order status updated successfully');
    } catch (err) {
      console.error('Failed to update order status:', err.response?.status, err.response?.data || err.message);
      const errorMessage = err.response?.status === 403
        ? 'Unauthorized: Only admins can update order status. Please log in with an admin account.'
        : `Failed to update order status (Status: ${err.response?.status || 'N/A'}): ${err.response?.data?.error || err.message}`;
      alert(errorMessage);
      if (err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  // Render loading state
  if (loading) return <p className="text-center mt-10 text-purple-800">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  // Render order management interface
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <header className="bg-purple-700 text-white py-4 px-6">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">EShoppingZone</Link>
        </div>
      </header>
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">Manage Orders</h1>
        {orders.length === 0 ? (
          <p className="text-center text-gray-700">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
              <div key={order.orderId} className="bg-white bg-opacity-70 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
                <h2 className="text-lg font-semibold text-purple-800 mb-1">Order ID: {order.orderId}</h2>
                <p className="text-gray-700">User ID: {order.userId}</p>
                <p className="text-gray-700">Order Date: {order.orderDate}</p>
                <p className="text-gray-700">Total Amount: ${order.totalAmount.toFixed(2)}</p>
                <p className="text-gray-700">Quantity: {order.quantity}</p>
                <p className="text-gray-700">Status: {order.orderStatus}</p>
                <div className="mt-4 space-x-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                    className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
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
};

export default ManageOrders;