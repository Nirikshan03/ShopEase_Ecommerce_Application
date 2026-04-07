import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Privateroute, Privaterouteadmin } from './ProtectedRoute';
import Home from '../pages/Home';
import Product from '../pages/Product';
import SingleProduct from '../pages/SingleProduct';
import Login from '../pages/LogIn';
import Registration from '../pages/Registration';
import AdminLogin from '../pages/AdminLogIn';
import Cart from '../pages/Cart';
import OrderDetails from '../pages/OrderDetails';
import PaymentForm from '../pages/PaymentForm';
import Payment from '../pages/Payment';
import Profile from '../pages/Profile';
import Admin from '../pages/Admin';
import NotFound from '../components/NotFound';

const AllRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Product />} />
    <Route path="/product/:productId" element={<SingleProduct />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register-user" element={<Registration />} />
    <Route path="/admin-login" element={<AdminLogin />} />

    <Route path="/user" element={<Privateroute />}>
      <Route path="cart" element={<Cart />} />
      <Route path="order-details" element={<OrderDetails />} />
      <Route path="make-payment" element={<PaymentForm />} />
      <Route path="payment-success" element={<Payment />} />
      <Route path="profile/:userid" element={<Profile />} />
    </Route>

    <Route path="/admin" element={<Privaterouteadmin />}>
      <Route path="dashboard" element={<Admin />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AllRoutes;
