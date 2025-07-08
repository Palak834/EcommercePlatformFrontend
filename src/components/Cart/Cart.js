// Displays and manages user's shopping cart, including updating quantities and placing orders
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function Cart() {
  // Access user data from AuthContext
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // State for cart items, loading, and error
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch cart items on component mount or user change
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api.get(`/cart/user/${user.userId}`)
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load cart:', err);
        setError('Failed to load cart');
        setLoading(false);
      });
  }, [user, navigate]);

  // Update quantity of an item in the cart
  const updateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await api.put(`/cart/${cartId}`, { quantity });
      setItems(items.map(item => item.cartId === cartId ? res.data : item));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  // Remove an item from the cart
  const removeItem = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      setItems(items.filter(item => item.cartId !== cartId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item');
    }
  };

  // Clear all items from the cart
  const clearCart = async () => {
    try {
      await api.delete(`/cart/user/${user.userId}`);
      setItems([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  // Place order and navigate to payment
  const placeOrder = async () => {
    try {
      const res = await api.post(`/order/user/${user.userId}`);
      console.log('Order creation response:', res.data); // Debug log
      const orderId = res.data.orderId || res.data.id; // Handle both possible response formats
      if (!orderId) {
        throw new Error('Order ID not found in response');
      }
      navigate(`/payment/${orderId}`, { replace: true });
    } catch (err) {
      console.error('Failed to place order:', err);
      alert(err.response?.data?.message || err.message || 'Failed to place order');
    }
  };

  // Render loading state
  if (loading) return <p className="text-center mt-10 text-purple-800">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  // Calculate total cart value
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Render cart items and controls
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <header className="bg-purple-700 text-white py-4 px-6">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">EShoppingZone</Link>
        </div>
      </header>
      <main className="flex-grow p-6">
        <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">Your Cart</h2>
        {items.length === 0 ? (
          <p className="text-center text-gray-700">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.cartId} className="bg-white bg-opacity-70 p-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
                <p className="text-gray-700">Product ID: {item.productId}</p>
                <p className="text-gray-700">Total Price: ${item.totalPrice}</p>
                <div className="flex items-center gap-2">
                  <label className="text-gray-700">Quantity:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.cartId, parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    min="1"
                  />
                </div>
                <button
                  onClick={() => removeItem(item.cartId)}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition shadow-md"
                >
                  Remove
                </button>
              </div>
            ))}
            <p className="text-xl font-bold text-purple-800 mt-4">Total: ${total.toFixed(2)}</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={clearCart}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
              >
                Clear Cart
              </button>
              <button
                onClick={placeOrder}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-md"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-purple-700 text-white text-center py-4">
        © 2025 E-ShoppingZone. All rights reserved.
      </footer>
    </div>
  );
}