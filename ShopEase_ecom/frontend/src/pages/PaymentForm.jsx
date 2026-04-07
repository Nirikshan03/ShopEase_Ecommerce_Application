import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Router/api';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('UPI');
  const [form, setForm] = useState({ cardNumber: '', cardHolder: '', expiry: '', cvv: '', upiId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const orderId = localStorage.getItem('orderid');
  const userId = localStorage.getItem('userid');

  const fmtCard = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

  // BUG FIX: was navigating to success page without actually calling payment API
  // Now calls the backend and only navigates on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId || !userId) { setError('Missing order details. Please go back to your orders.'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post(`/ecom/order-payments/makePayment?orderId=${orderId}&userId=${userId}&method=${method}`);
      navigate('/user/payment-success');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('already')) {
        // Already paid — just go to success page
        navigate('/user/payment-success');
      } else {
        setError(msg || 'Payment failed. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page" style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }}>
      <div className="auth-card">
        <h1>💳 Payment Details</h1>
        <p className="auth-subtitle">Complete your order securely</p>
        {error && <div className="alert-error">{error}</div>}

        {/* Payment Method Selector */}
        <div className="form-field">
          <label>Payment Method</label>
          <select value={method} onChange={e => setMethod(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14 }}>
            <option value="UPI">UPI</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="NET_BANKING">Net Banking</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          {method === 'UPI' ? (
            <div className="form-field">
              <label>UPI ID</label>
              <input placeholder="yourname@upi" value={form.upiId}
                onChange={e => setForm({ ...form, upiId: e.target.value })} required />
            </div>
          ) : (
            <>
              <div className="form-field">
                <label>Card Number</label>
                <input placeholder="1234 5678 9012 3456" value={form.cardNumber}
                  onChange={e => setForm({ ...form, cardNumber: fmtCard(e.target.value) })} required />
              </div>
              <div className="form-field">
                <label>Card Holder Name</label>
                <input placeholder="John Doe" value={form.cardHolder}
                  onChange={e => setForm({ ...form, cardHolder: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-field" style={{ flex: 1 }}>
                  <label>Expiry (MM/YY)</label>
                  <input placeholder="MM/YY" value={form.expiry}
                    onChange={e => setForm({ ...form, expiry: fmtExp(e.target.value) })} required />
                </div>
                <div className="form-field" style={{ flex: 1 }}>
                  <label>CVV</label>
                  <input type="password" placeholder="•••" maxLength={3} value={form.cvv}
                    onChange={e => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} required />
                </div>
              </div>
            </>
          )}
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Processing...' : '💳 Pay Now'}
          </button>
        </form>
        <button onClick={() => navigate(-1)}
          style={{ width: '100%', background: 'none', color: '#888', padding: '10px', marginTop: 8, border: 'none', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
