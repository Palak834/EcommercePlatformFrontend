// Allows admin users to add new products to the platform
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const AddProduct = () => {
  // Access user data from AuthContext
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for product form data
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryName: ''
  });

  // State for error and success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check user authentication and role on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in as an admin to add a product.');
      navigate('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      setError('Only admins can manage products.');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for adding product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form data
    if (!formData.name || !formData.price || !formData.description || !formData.categoryName) {
      setError('All fields, including category name, are required.');
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    const productData = {
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      category: { name: formData.categoryName }
    };

    console.log('Sending product data to backend:', JSON.stringify(productData));

    try {
      const response = await api.post('/product', productData);
      console.log('Add product response:', response.status, response.data);
      setSuccess('Product added successfully!');
      setFormData({ name: '', price: '', description: '', categoryName: '' });
      setTimeout(() => navigate('/manageProducts'), 2000);
    } catch (err) {
      console.error('Failed to add product:', err.response?.status, err.response?.data || err.message);
      const errorMessage = err.response?.status === 403
        ? 'Unauthorized: Only admins can add products. Please log in with an admin account.'
        : err.response?.status === 400
        ? `Failed to add product: ${err.response.data.error || 'Invalid product data'}`
        : err.response?.status === 500
        ? `Internal server error: ${err.response.data.error || 'Please try again later'}`
        : `Failed to add product (Status: ${err.response?.status || 'N/A'}): ${err.response?.data?.error || err.message}`;
      setError(errorMessage);
      if (err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  // Render product addition form
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <header className="bg-purple-700 text-white py-4 px-6">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">EShoppingZone</Link>
        </div>
      </header>
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">Add Product</h1>
        {error && <p className="text-center text-red-600 mb-4">{error}</p>}
        {success && <p className="text-center text-green-600 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white bg-opacity-70 p-8 rounded-xl shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter product name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter price"
              min="0"
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter product description"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Category Name</label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter category name"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Add Product
          </button>
        </form>
      </main>
      <footer className="bg-purple-700 text-white text-center py-4">
        © 2025 E-ShoppingZone. All rights reserved.
      </footer>
    </div>
  );
};

export default AddProduct;