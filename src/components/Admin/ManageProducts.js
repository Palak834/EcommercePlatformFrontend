import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const ManageProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in as an admin to manage products.');
      navigate('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      setError('Only admins can manage products.');
      navigate('/');
      return;
    }

    const fetchProducts = async () => {
      try {
        const productResponse = await api.get('/product');
        setProducts(productResponse.data);
        const categoryResponse = await api.get('/product/category');
        setCategories(categoryResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products or categories');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, navigate]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/product/${productId}`);
        setProducts(products.filter(product => product.productId !== productId));
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category?.name || ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        name: editFormData.name,
        price: parseFloat(editFormData.price),
        description: editFormData.description,
        category: { name: editFormData.category }
      };
      const res = await api.put(`/product/${editProduct.productId}`, updatedProduct);
      setProducts(products.map(product =>
        product.productId === editProduct.productId ? res.data : product
      ));
      setEditProduct(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update product');
    }
  };

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
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">Manage Products</h1>
        {editProduct ? (
          <div className="max-w-md mx-auto bg-white bg-opacity-70 p-6 rounded-xl shadow-2xl mb-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleEditSubmit}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md"
                >
                  Update Product
                </button>
                <button
                  onClick={() => setEditProduct(null)}
                  className="w-full py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.productId} className="bg-white bg-opacity-70 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
                <h2 className="text-lg font-semibold text-purple-800 mb-1">{product.name}</h2>
                <p className="text-gray-700">Price: Rs.{product.price.toFixed(2)}</p>
                <p className="text-gray-700">Description: {product.description}</p>
                <p className="text-gray-700">Category: {product.category?.name || 'N/A'}</p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.productId)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
                  >
                    Delete
                  </button>
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

export default ManageProducts;