import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import ProductList from './components/Product/ProductList';
import ProductDetails from './components/Product/ProductDetails';
import AddProduct from './components/Admin/AddProduct';
import ManageProducts from './components/Admin/ManageProducts';
import ManageOrders from './components/Admin/ManageOrders';

import Cart from './components/Cart/Cart';
import OrderHistory from './components/Order/OrderHistory';
import OrderDetails from './components/Order/OrderDetails';
import Payment from './components/Payment/Payment';
import Profile from './components/Profile/Profile';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* General Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Product Pages */}
        <Route path="/product" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/manageProducts" element={<ManageProducts />} />
        <Route path="/manageOrders" element={<ManageOrders />} />

        {/* Cart, Orders, Payment, Profile */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;