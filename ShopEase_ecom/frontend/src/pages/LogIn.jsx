import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../Router/api';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // BUG FIX: Clear any old token from a previous session before logging in.
    // If a stale token sits in localStorage, the api interceptor would send
    // "Bearer <old_token>" and overwrite the Basic auth header, breaking login.
    localStorage.clear();
    try {
      const res = await api.get('/ecom/signIn', {
        headers: { Authorization: `Basic ${btoa(`${form.username}:${form.password}`)}` },
      });

      // BUG FIX: token comes as full "Bearer xxx" — store exactly as received
      const token = res.headers['authorization'];
      if (!token) { setError('Login failed — no token received.'); return; }

      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userid', res.data.id);
      localStorage.setItem('name', res.data.firstNAme || 'User');
      localStorage.setItem('role', res.data.role || '');
      // BUG FIX: store cartId if present so Cart page doesn't need an extra API call
      if (res.data.cartId) localStorage.setItem('cartid', res.data.cartId);

      navigate('/');
    } catch (err) {
      setError(err.response?.status === 401 ? 'Invalid email or password.' : 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back 👋</h1>
        <p className="auth-subtitle">Sign in to your account</p>
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" placeholder="Enter password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/register-user">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
