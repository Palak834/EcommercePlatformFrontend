import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    // Log user state changes to ensure re-rendering
    console.log('Home component re-rendered, user:', user);
  }, [user]);

  if (loading) {
    return <p className="text-center mt-10 text-purple-800">Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      {/* Header */}
      <header className="bg-purple-700 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold tracking-wide">E-ShoppingZone</h1>
          {user ? (
            <div className="space-x-4 flex items-center">
              {user.role === 'USER' && (
                <>
                  <Link to="/cart" className="hover:underline">Cart</Link>
                  <Link to="/orders" className="hover:underline">Orders</Link>
                  <Link to="/profile" className="hover:underline">Profile</Link>
                </>
              )}
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="px-4 py-2 bg-white text-purple-700 font-semibold rounded hover:bg-purple-100 transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600 transition">
                Register
              </Link>
            </div>
          )}
        </div>
      </header>
      {/* Body */}
      <main className="flex-grow flex items-center justify-center px-4 text-center">
        <div className="bg-white bg-opacity-70 p-10 rounded-lg shadow-xl max-w-xl w-full">
          {!user && (
            <>
              <h2 className="text-4xl font-extrabold text-purple-800 mb-4">Welcome to E-ShoppingZone</h2>
              <p className="text-purple-700 mb-6 text-lg">Discover a wide range of products.</p>
              <Link to="/product">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-md">
                  Browse Products
                </button>
              </Link>
            </>
          )}
          {user?.role === 'USER' && (
            <>
              <h2 className="text-3xl font-bold text-purple-800 mb-4">Welcome, {user.fullName}!</h2>
              <p className="text-purple-700 mb-6 text-lg">Explore our products.</p>
              <Link to="/product">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-md">
                  Browse Products
                </button>
              </Link>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <>
              <h2 className="text-3xl font-bold text-purple-800 mb-4">Admin Dashboard</h2>
              <div className="grid grid-cols-1 gap-4">
                <Link to="/addProduct" className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 shadow">
                  Add Product
                </Link>
                <Link to="/manageProducts" className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 shadow">
                  Manage Products
                </Link>
                <Link to="/manageOrders" className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 shadow">
                  Manage Orders
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-purple-700 text-white text-center py-4">
        © 2025 E-ShoppingZone. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;