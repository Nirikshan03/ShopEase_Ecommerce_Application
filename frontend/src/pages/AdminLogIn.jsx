import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../Router/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    localStorage.clear();
    try {
      const res = await api.get('/ecom/signIn', {
        headers: { Authorization: `Basic ${btoa(`${form.username}:${form.password}`)}` },
      });

      const token = res.headers['authorization'];
      if (!token) {
        setError('Login failed — no token received.');
        setLoading(false);
        return;
      }

      // Show exactly what role came back so you can debug
      const role = res.data.role;
      console.log('Login response role:', role);
      console.log('Full response data:', res.data);

      // Accept both ROLE_ADMIN and ADMIN just in case
      if (role !== 'ROLE_ADMIN' && role !== 'ADMIN') {
        setError(`Access denied — your role is "${role}". Admin role required.`);
        setLoading(false);
        return;
      }

      localStorage.setItem('jwtToken', token);
      localStorage.setItem('adminid', res.data.id);
      localStorage.setItem('role', role);
      localStorage.setItem('name', res.data.firstNAme || 'Admin');
      navigate('/admin/dashboard');
    } catch (err) {
      console.log('Admin login error:', err.response?.status, err.response?.data);
      if (err.response?.status === 401) {
        setError('Invalid email or password. Make sure you registered the admin account first via Swagger or Postman.');
      } else if (err.response?.status === 403) {
        setError('Access forbidden — this account is not an admin.');
      } else {
        setError('Login failed: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Admin Login 🔐</h1>
        <p className="auth-subtitle">Access the admin dashboard</p>
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Admin Email</label>
            <input type="email" placeholder="admin@example.com" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Signing in...' : 'Login as Admin'}
          </button>
        </form>
        <div className="auth-footer"><Link to="/login">← User Login</Link></div>
      </div>
    </div>
  );
};

export default AdminLogin;