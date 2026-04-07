import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [, forceUpdate] = useState(0);
  useEffect(() => { forceUpdate(n => n + 1); }, [location]);

  if (location.pathname.startsWith('/admin')) return null;

  const userId = localStorage.getItem('userid');
  const name = localStorage.getItem('name');

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>🛒 ShopEase</div>
      <form className="navbar-search" onSubmit={e => { e.preventDefault(); navigate(`/products?search=${encodeURIComponent(search)}`); }}>
        <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit">🔍</button>
      </form>
      <div className="navbar-actions">
        <button className="nav-btn" onClick={() => navigate('/products')}>Products</button>
        {userId ? (
          <>
            <button className="nav-btn cart-btn" onClick={() => navigate('/user/cart')}>🛒 Cart</button>
            <button className="nav-btn" onClick={() => navigate('/user/order-details')}>👤 {name || 'Account'}</button>
            <button className="nav-btn danger" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-btn primary" onClick={() => navigate('/register-user')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
