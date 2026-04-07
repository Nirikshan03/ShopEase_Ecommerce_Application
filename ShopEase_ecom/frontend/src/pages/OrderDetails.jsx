import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Router/api';

const OrderDetails = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userid');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const fetchOrders = useCallback(() => {
    api.get(`/ecom/orders/orders/${userId}`)
      .then(res => setOrders([...res.data].sort((a,b)=>new Date(b.orderDate)-new Date(a.orderDate))))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => { document.title='ShopEase | My Orders'; fetchOrders(); }, [fetchOrders]);

  const cancelOrder = (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    api.delete(`/ecom/orders/users/${userId}/${orderId}`)
      .then(()=>{ showToast('Order cancelled'); fetchOrders(); })
      .catch(()=>showToast('Failed to cancel','error'));
  };

  const payNow = (orderId) => { localStorage.setItem('orderid', orderId); navigate('/user/make-payment'); };

  if (loading) return <div className="loading-screen"><div className="spinner"/>Loading orders...</div>;

  return (
    <div className="orders-page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h1>My Orders</h1>
        <button className="btn-view-product" style={{padding:'9px 18px'}} onClick={()=>navigate(`/user/profile/${userId}`)}>👤 Profile</button>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="icon">📦</div>
          <h3>No orders yet</h3>
          <p style={{marginBottom:20}}>Place your first order from the cart</p>
          <button className="btn-single-cart" style={{padding:'10px 24px'}} onClick={()=>navigate('/products')}>Browse Products</button>
        </div>
      ) : orders.map((order, idx) => (
        <div className="order-card" key={order.orderId}>
          <div className="order-card-header">
            <div className="order-meta">
              <h3>Order #{orders.length - idx} &nbsp;•&nbsp; ID: {order.orderId}</h3>
              <p>{order.orderDate ? new Date(order.orderDate).toLocaleString('en-IN') : 'N/A'}</p>
            </div>
            <span className={`status-chip chip-${order.status}`}>{order.status}</span>
          </div>

          <div className="order-card-body">
            {order.orderItem?.map(item => (
              <div className="order-item-row" key={item.orderItemId}>
                <span>{item.product?.name}</span>
                <span>Qty: {item.quantity} &nbsp;•&nbsp; ₹{item.product?.price?.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="order-card-footer">
            <span className="order-total-amount">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
            <div className="order-actions">
              {order.status === 'PENDING' && <>
                <button className="btn-pay-now" onClick={()=>payNow(order.orderId)}>💳 Pay Now</button>
                <button className="btn-cancel-order" onClick={()=>cancelOrder(order.orderId)}>Cancel</button>
              </>}
              {order.status === 'SHIPPED' && <span className="paid-badge">✓ Payment Complete</span>}
              {order.status === 'DELIVERED' && <span className="paid-badge">✓ Delivered</span>}
            </div>
          </div>
        </div>
      ))}
      {toast && <div className={`toast-notification toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};
export default OrderDetails;
