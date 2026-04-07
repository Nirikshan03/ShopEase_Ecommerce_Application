import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../Router/api';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // BUG FIX: need BOTH cartId (for fetch/remove) and userId (for qty operations)
  const cartId = localStorage.getItem('cartid');
  const userId = localStorage.getItem('userid');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCart = useCallback(() => {
    if (!cartId) { setLoading(false); return; }
    api.get(`/ecom/cart/products/${cartId}`)
      .then(res => {
        setCart(res.data);
        // Update cartid in case it changed
        if (res.data?.cartId) localStorage.setItem('cartid', res.data.cartId);
      })
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  }, [cartId]);

  useEffect(() => { document.title = 'ShopEase | Cart'; fetchCart(); }, [fetchCart]);

  // BUG FIX: increase/decrease now use userId (matching fixed backend CartController)
  const increase = (productId) =>
    api.put(`/ecom/cart/increase-productQty/${userId}/${productId}`)
      .then(res => { setCart(res.data); })
      .catch(err => showToast(err.response?.data?.message || 'Error', 'error'));

  const decrease = (productId) =>
    api.put(`/ecom/cart/decrease-productQty/${userId}/${productId}`)
      .then(res => { setCart(res.data); })
      .catch(err => showToast(err.response?.data?.message || 'Cannot decrease further', 'error'));

  const removeItem = (productId) =>
    api.delete(`/ecom/cart/remove-product/${cartId}/${productId}`)
      .then(() => { showToast('Item removed'); fetchCart(); })
      .catch(() => showToast('Error removing item', 'error'));

  const emptyCart = () => {
    if (!window.confirm('Clear all items from cart?')) return;
    api.delete(`/ecom/cart/empty-Cart/${cartId}`)
      .then(() => { showToast('Cart cleared'); fetchCart(); })
      .catch(() => showToast('Error', 'error'));
  };

  const placeOrder = () => {
    api.post(`/ecom/orders/placed/${userId}`)
      .then(res => {
        showToast('Order placed successfully! 🎉');
        // Store orderId for payment page
        if (res.data?.orderId) localStorage.setItem('orderid', res.data.orderId);
        setTimeout(() => navigate('/user/order-details'), 1200);
      })
      .catch(err => showToast(err.response?.data?.message || 'Error placing order', 'error'));
  };

  if (loading) return <div className="loading-screen"><div className="spinner" />Loading cart...</div>;

  const items = cart?.cartItems || [];

  if (!cart || items.length === 0) return (
    <div className="cart-empty-page">
      <div className="empty-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Add some products to get started</p>
      <Link to="/products"><button className="btn-shop-now">Browse Products</button></Link>
    </div>
  );

  return (
    <div className="cart-page">
      <h1>Shopping Cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>
      <div className="cart-layout">
        <div className="cart-items-list">
          {items.map(item => (
            <div className="cart-item" key={item.cartItemId}>
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                onError={e => { e.target.src = 'https://placehold.co/90x90?text=IMG'; }}
              />
              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p className="item-cat">{item.product.category}</p>
                <p className="item-price">₹{item.product.price?.toLocaleString('en-IN')}</p>
                <div className="qty-row">
                  <div className="qty-box">
                    <button onClick={() => decrease(item.product.productId)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increase(item.product.productId)}>+</button>
                  </div>
                  <span className="qty-total">
                    = ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
                <button className="btn-remove-item" onClick={() => removeItem(item.product.productId)}>
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-box">
          <h2>Order Summary</h2>
          {items.map(item => (
            <div className="summary-row" key={item.cartItemId}>
              <span>{item.product.name} ×{item.quantity}</span>
              <span>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{cart.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
          <button className="btn-place-order" onClick={placeOrder}>Place Order →</button>
          <button className="btn-clear-cart" onClick={emptyCart}>Clear Cart</button>
        </div>
      </div>
      {toast && <div className={`toast-notification toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};

export default Cart;
