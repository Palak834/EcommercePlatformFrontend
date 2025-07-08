import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const ProductDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get(`/product/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error('Failed to load product:', err);
        setError('Failed to load product');
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      return navigate('/login');
    }
    setAdding(true);
    try {
      await api.post('/cart', {
        userId: user.userId,
        productId: product.productId,
        quantity: 1
      });
      navigate('/cart');
    } catch (err) {
      console.error('Add to cart failed:', err);
      setError(err.response?.data?.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (!product) return <p className="text-center mt-10 text-purple-800">{error || 'Loading…'}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <header className="bg-purple-700 text-white py-4 px-6">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">EShoppingZone</Link>
        </div>
      </header>
      <main className="flex-grow p-6 flex justify-center items-center">
        <div className="w-full max-w-lg bg-white bg-opacity-70 rounded-xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">{product.name}</h1>
          <p className="mb-2 text-gray-700">
            <span className="font-medium">Price:</span> Rs.{product.price.toFixed(2)}
          </p>
          <p className="mb-2 text-gray-700">
            <span className="font-medium">Category:</span> {product.category?.name || 'N/A'}
          </p>
          <p className="mb-6 text-gray-700">
            <span className="font-medium">Description:</span> {product.description || 'Not available'}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`w-full py-3 text-white rounded-lg font-semibold transition shadow-md
              ${adding ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {adding ? 'Adding…' : 'Add to Cart'}
          </button>
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </div>
      </main>
      <footer className="bg-purple-700 text-white text-center py-4">
        © 2025 E-ShoppingZone. All rights reserved.
      </footer>
    </div>
  );
};

export default ProductDetails;