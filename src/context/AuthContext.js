import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { email, exp, role } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          setToken(null);
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await api.get('/profile', { headers: { Authorization: `Bearer ${token}` } });
        setUser({ ...res.data, email, role });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const login = async (newToken) => {
    setLoading(true);
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};