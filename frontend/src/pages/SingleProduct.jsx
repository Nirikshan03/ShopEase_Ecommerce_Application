import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Router/api';

const SingleProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  useEffect(() => {
    api.get(`/ecom/products/${productId}`)
      .then(res => { setProduct(res.data); document.title = `ShopEase | ${res.data.name}`; })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [productId]);

  const addToCart = () => {
    const userId = localStorage.getItem('userid');
    if (!userId) { navigate('/login'); return; }
    api.post(`/ecom/cart/add-product?userId=${userId}&productId=${productId}`)
      .then(res => { localStorage.setItem('cartid', res.data.cartId); showToast('Added to cart! 🛒'); })
      .catch(err => showToast(err.response?.data?.message || 'Error', 'error'));
  };

  if (loading) return <div className="loading-screen"><div className="spinner"/>Loading...</div>;
  if (!product) return null;

  const avg = product.reviews?.length ? (product.reviews.reduce((s,r)=>s+(r.rating||0),0)/product.reviews.length).toFixed(1) : null;

  return (
    <div className="single-product-container">
      <div className="back-link" onClick={() => navigate(-1)}>← Back to Products</div>
      <div className="single-product-card">
        <img src={product.imageUrl} alt={product.name} onError={e=>{e.target.src='https://placehold.co/360x360?text=No+Image';}} />
        <div className="single-product-info">
          <span className="product-badge">{product.category}</span>
          <h1>{product.name}</h1>
          {avg && <p className="product-rating" style={{margin:'6px 0'}}>⭐ {avg}/5 &nbsp;({product.reviews.length} reviews)</p>}
          <p className="single-price">₹{product.price?.toLocaleString('en-IN')}</p>
          <p className="single-desc">{product.description}</p>
          <span className={`stock-badge ${product.available !== false ? 'in-stock' : 'out-stock'}`}>
            {product.available !== false ? '✓ In Stock' : '✗ Out of Stock'}
          </span>
          <div className="single-actions">
            <button className="btn-single-cart" onClick={addToCart}>🛒 Add to Cart</button>
            <button className="btn-single-view-cart" onClick={() => navigate('/user/cart')}>View Cart</button>
          </div>
          {product.reviews?.length > 0 && (
            <div className="reviews-section">
              <h3>Customer Reviews</h3>
              {product.reviews.slice(0,4).map((r,i) => (
                <div className="review-card" key={i}>
                  <p className="review-stars">{'⭐'.repeat(r.rating||0)} {r.rating}/5</p>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {toast && <div className={`toast-notification toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};
export default SingleProduct;
