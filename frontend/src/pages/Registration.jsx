import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../Router/api';

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'', firstName:'', lastName:'', phoneNumber:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/ecom/customers', form);
      navigate('/login');
    } catch(err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account 🛍️</h1>
        <p className="auth-subtitle">Join us and start shopping</p>
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{display:'flex',gap:12}}>
            <div className="form-field" style={{flex:1}}><label>First Name</label>
              <input type="text" placeholder="John" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} required /></div>
            <div className="form-field" style={{flex:1}}><label>Last Name</label>
              <input type="text" placeholder="Doe" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} required /></div>
          </div>
          <div className="form-field"><label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
          <div className="form-field">
            <label>Password <span style={{fontWeight:400,color:'#999',fontSize:12}}>(5–10 characters)</span></label>
            <input type="password" placeholder="••••••" value={form.password} minLength={5} maxLength={10} onChange={e=>setForm({...form,password:e.target.value})} required /></div>
          <div className="form-field">
            <label>Phone Number <span style={{fontWeight:400,color:'#999',fontSize:12}}>(10 digits)</span></label>
            <input type="tel" placeholder="9999999999" value={form.phoneNumber} maxLength={10}
              onChange={e=>setForm({...form,phoneNumber:e.target.value.replace(/\D/g,'').slice(0,10)})} required /></div>
          <button type="submit" className="btn-auth" disabled={loading}>{loading?'Creating account...':'Create Account'}</button>
        </form>
        <div className="auth-footer">Already have an account? <Link to="/login">Sign In</Link></div>
      </div>
    </div>
  );
};
export default Registration;
