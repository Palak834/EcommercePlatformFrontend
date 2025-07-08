// Handles user authentication with email and password, redirects on successful login
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';


const Login = () => {
  // Access authentication context for login function, loading state, and user data
  const { login, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();
  // State for form data (email, password)
  const [formData, setFormData] = useState({ email: '', password: '' });
  // State for error messages
  const [error, setError] = useState('');
  // State to track login attempt
  const [loginTriggered, setLoginTriggered] = useState(false);

  // Handle input changes for form fields
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for login
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Send login request to API
      const res = await api.post('/auth/login', formData);
      // Call login function with received token
      await login(res.data.token);
      setLoginTriggered(true);
    } catch (err) {
      // Log and display error if login fails
      console.error('Login error:', err.response || err.message);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // Redirect to homepage after successful login
  useEffect(() => {
    if (loginTriggered && !loading && user) {
      navigate('/', { replace: true });
    }
  }, [loginTriggered, loading, user, navigate]);

  // Render login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <div className="w-full max-w-md bg-white bg-opacity-70 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          Welcome Back
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-lg font-semibold transition shadow-md ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-purple-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      
    </div>
  );
};

export default Login;