import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Router/api';

const Payment = () => {
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const called = useRef(false); // BUG FIX: prevent double payment call in StrictMode

  const orderId = localStorage.getItem('orderid');
  const userId = localStorage.getItem('userid');

  useEffect(() => {
    document.title = 'ShopEase | Payment Success';
    if (!orderId || !userId) { setLoading(false); setError('Missing order details.'); return; }

    // BUG FIX: useEffect fires twice in React StrictMode — guard with ref
    if (called.current) return;
    called.current = true;

    // BUG FIX: pass method param (UPI default), matching fixed backend
    api.post(`/ecom/order-payments/makePayment?orderId=${orderId}&userId=${userId}&method=UPI`)
      .then(res => setPayment(res.data))
      .catch(err => {
        const msg = err.response?.data?.message || '';
        // If already paid, try fetching order details instead of showing error
        if (msg.toLowerCase().includes('already')) {
          setError('Payment was already processed for this order.');
        } else {
          setError(msg || 'Payment failed. Please try again from your orders page.');
        }
      })
      .finally(() => setLoading(false));
  }, [orderId, userId]);

  if (loading) return <div className="loading-screen"><div className="spinner" />Processing payment...</div>;

  if (error) return (
    <div className="payment-success-page">
      <div className="payment-success-card">
        <div className="success-icon">⚠️</div>
        <h1>Payment Issue</h1>
        <p style={{ color: '#e74c3c', marginBottom: 20 }}>{error}</p>
        <div className="payment-btns">
          <button className="btn-payment-action primary" onClick={() => navigate('/user/order-details')}>My Orders</button>
          <button className="btn-payment-action secondary" onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="payment-success-page">
      <div className="payment-success-card">
        <div className="success-icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for shopping with ShopEase</p>
        {payment && (
          <div className="payment-details-table">
            <div className="payment-detail-row">
              <span className="pd-label">Payment ID</span>
              <span className="pd-value">#{payment.paymentId}</span>
            </div>
            <div className="payment-detail-row">
              <span className="pd-label">Amount</span>
              <span className="pd-value" style={{ color: '#27ae60' }}>
                ₹{payment.paymentAmount?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="payment-detail-row">
              <span className="pd-label">Method</span>
              <span className="pd-value">{payment.paymentMethod}</span>
            </div>
            <div className="payment-detail-row">
              <span className="pd-label">Status</span>
              <span className="pd-value" style={{ color: '#27ae60' }}>{payment.paymentStatus}</span>
            </div>
            <div className="payment-detail-row">
              <span className="pd-label">Date</span>
              <span className="pd-value">{new Date(payment.paymentDate).toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
        <div className="payment-btns">
          <button className="btn-payment-action primary" onClick={() => navigate('/user/order-details')}>
            My Orders
          </button>
          <button className="btn-payment-action secondary" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
