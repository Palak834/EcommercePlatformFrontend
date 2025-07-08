import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/product');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10 text-purple-800">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!products.length) return <p className="text-center mt-10 text-purple-800">No products available.</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <header className="bg-purple-700 text-white py-4 px-6">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">EShoppingZone</Link>
        </div>
      </header>
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">Products</h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(prod => (
            <div
              key={prod.productId}
              className="bg-white bg-opacity-70 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition p-4 flex flex-col"
            >
              <h2 className="text-xl font-semibold text-purple-800 mb-2">{prod.name}</h2>
              <p className="mb-4 text-gray-700">
                <span className="font-medium">Price:</span> Rs.{prod.price.toFixed(2)}
              </p>
              <Link
                to={`/product/${prod.productId}`}
                className="mt-auto inline-block text-center py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-purple-700 text-white text-center py-4">
        © 2025 E-ShoppingZone. All rights reserved.
      </footer>
    </div>
  );
};

export default ProductList;