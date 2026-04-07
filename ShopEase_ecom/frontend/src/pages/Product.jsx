import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../Router/api';

const CATS = ['All','electronics','gadgets','fashion','grocery','kitchen','fruits','vegetables'];

const Toast = ({ toast }) => toast ? <div className={`toast-notification toast-${toast.type}`}>{toast.msg}</div> : null;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'asc';

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    document.title = 'ShopEase | Products';
    setLoading(true);
    api.get('/ecom/products/all', { params: { keyword: search || undefined, sort, sortBy: 'price' } })
      .then(res => {
        let data = res.data || [];
        if (category !== 'All') data = data.filter(p => p.category?.toLowerCase() === category.toLowerCase());
        setProducts(data);
      })
      .catch(() => showToast('Failed to load products', 'error'))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  const setParam = (key, val) => {
    const p = Object.fromEntries(searchParams);
    if (!val || val === 'All') delete p[key]; else p[key] = val;
    setSearchParams(p);
  };

  const addToCart = (productId) => {
    const userId = localStorage.getItem('userid');
    if (!userId) { navigate('/login'); return; }
    api.post(`/ecom/cart/add-product?userId=${userId}&productId=${productId}`)
      .then(res => { localStorage.setItem('cartid', res.data.cartId); showToast('Added to cart! 🛒'); })
      .catch(err => showToast(err.response?.data?.message || 'Error adding to cart', 'error'));
  };

  return (
    <div className="products-page">
      <div className="filter-sidebar">
        <h3>Filters</h3>
        <div className="filter-group">
          <label>Category</label>
          <select value={category} onChange={e => setParam('category', e.target.value)}>
            {CATS.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Sort by Price</label>
          <select value={sort} onChange={e => setParam('sort', e.target.value)}>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Search</label>
          <input type="text" placeholder="Product name..." value={search} onChange={e => setParam('search', e.target.value)} />
        </div>
      </div>

      <div className="products-main">
        <div className="products-toolbar">
          <span className="products-count">
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {loading && <div className="loading-screen"><div className="spinner" />Loading products...</div>}

        {!loading && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try different filters or search terms</p>
          </div>
        )}

        <div className="products-grid">
          {products.map(p => (
            <div className="product-card" key={p.productId}>
              <div className="product-card-img">
                <img src={p.imageUrl} alt={p.name} onError={e => { e.target.src='https://placehold.co/230x190?text=No+Image'; }} />
              </div>
              <div className="product-card-body">
                <span className="product-badge">{p.category}</span>
                <p className="product-name">{p.name}</p>
                <p className="product-desc">{p.description}</p>
                {p.reviews?.length > 0 && (
                  <p className="product-rating">⭐ {(p.reviews.reduce((s,r)=>s+(r.rating||0),0)/p.reviews.length).toFixed(1)} ({p.reviews.length})</p>
                )}
                <p className="product-price">₹{p.price?.toLocaleString('en-IN')}</p>
              </div>
              <div className="product-card-actions">
                <button className="btn-add-cart" onClick={() => addToCart(p.productId)}>🛒 Add to Cart</button>
                <button className="btn-view-product" onClick={() => navigate(`/product/${p.productId}`)}>View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toast toast={toast} />
    </div>
  );
};
export default Product;
