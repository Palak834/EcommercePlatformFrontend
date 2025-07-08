import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
  });
  const [emailDisplay, setEmailDisplay] = useState('Not available');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Extract email from JWT token
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token); // Debug: Check if token exists
    let emailFromToken = null;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded); // Debug: Check token payload
        // Check for common email claims
        emailFromToken = decoded.email || decoded.email_address || decoded.username || decoded.sub || null;
        if (!emailFromToken) {
          console.warn('No email-related claim found in token');
        }
      } catch (err) {
        console.error('Failed to decode JWT token:', err);
        setEmailDisplay('Token decoding failed');
      }
    } else {
      console.warn('No token found in localStorage');
      setEmailDisplay('No token available');
    }

    // Fetch profile data from API
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        console.log('Profile data from API:', res.data); // Debug: Check API response
        setProfile(res.data);
        setFormData({
          fullName: res.data.fullName || '',
          address: res.data.address || '',
          phoneNumber: res.data.phoneNumber || '',
        });

        // Fallback to email from API response if token doesn't have it
        const emailFromApi = res.data.email || null;
        if (emailFromApi) {
          setEmailDisplay(emailFromApi);
        } else if (emailFromToken) {
          setEmailDisplay(emailFromToken);
        } else {
          setEmailDisplay('Email not available');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const updatedProfile = {
        fullName: formData.fullName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      };
      const res = await api.put('/profile', updatedProfile);
      setProfile(res.data);
      setFormData({
        fullName: res.data.fullName || '',
        address: res.data.address || '',
        phoneNumber: res.data.phoneNumber || '',
      });
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      try {
        await api.delete('/profile');
        logout();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete profile');
      }
    }
  };

  if (!profile) {
    return (
      <p className="text-center mt-10 text-purple-800 text-xl animate-pulse">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <header className="bg-purple-700 text-white py-5 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            EShoppingZone
          </Link>
        </div>
      </header>
      <main className="flex-grow p-6 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-3xl font-extrabold text-purple-800 mb-6 text-center">
            Your Profile
          </h2>
          {error && (
            <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
          )}
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <p className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600">
                {emailDisplay}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleUpdate}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
              >
                Update Profile
              </button>
              <button
                onClick={handleDelete}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-purple-700 text-white text-center py-4">
        © 2025 EShoppingZone. All rights reserved.
      </footer>
    </div>
  );
}