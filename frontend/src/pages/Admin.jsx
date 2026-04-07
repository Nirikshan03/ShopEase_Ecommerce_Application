import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Router/api';

const Toast = ({ toast }) => toast ? <div className={`toast-notification toast-${toast.type}`}>{toast.msg}</div> : null;

const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h2>{title}</h2>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      {children}
    </div>
  </div>
);

// BUG FIX: maxLength updated from 50 to 100 to match backend @Size(max=100)
const ProductForm = ({ data, setData, onSubmit, btnLabel, saving }) => {
  const CATS = ['electronics', 'gadgets', 'fashion', 'grocery', 'kitchen', 'fruits', 'vegetables'];
  return (
    <form onSubmit={onSubmit}>
      <div className="modal-field">
        <label>Product Name</label>
        <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
          placeholder="e.g. Samsung Galaxy S24" required />
      </div>
      <div className="modal-field">
        <label>Image URL</label>
        <input type="url" value={data.imageUrl} onChange={e => setData({ ...data, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg" required />
        <p className="modal-hint">Paste any direct image URL (Unsplash, etc.)</p>
      </div>
      <div className="modal-field">
        {/* BUG FIX: was showing "(10–50 characters)" but backend now allows up to 100 */}
        <label>Description <span style={{ color: '#999', fontWeight: 400, fontSize: 11 }}>(5–100 characters)</span></label>
        <input value={data.description} onChange={e => setData({ ...data, description: e.target.value })}
          placeholder="Brief product description" minLength={5} maxLength={100} required />
        <p className="modal-hint">{data.description?.length || 0}/100 characters</p>
      </div>
      <div className="modal-field">
        <label>Price (₹)</label>
        <input type="number" value={data.price} onChange={e => setData({ ...data, price: e.target.value })}
          placeholder="e.g. 999" min="1" step="0.01" required />
      </div>
      <div className="modal-field">
        <label>Category</label>
        <select value={data.category} onChange={e => setData({ ...data, category: e.target.value })} required>
          <option value="">— Select Category —</option>
          {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>
      <button type="submit" className="btn-modal-submit" disabled={saving}>
        {saving ? 'Saving...' : btnLabel}
      </button>
    </form>
  );
};

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editProd, setEditProd] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const empty = { name: '', imageUrl: '', description: '', price: '', category: '', isAvailable: true };
  const [newProd, setNewProd] = useState(empty);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchProducts = useCallback(() => {
    setLoading(true);
    api.get('/ecom/products/all')
      .then(res => setProducts([...res.data].sort((a, b) => b.productId - a.productId)))
      .catch(() => showToast('Failed to load products', 'error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const addProduct = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/ecom/products/add', { ...newProd, price: parseFloat(newProd.price) });
      showToast('Product added successfully! ✓');
      setShowAdd(false); setNewProd(empty); fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error adding product', 'error');
    } finally { setSaving(false); }
  };

  const updateProduct = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.put(`/ecom/products/update/${editProd.productId}`, editProd);
      showToast('Product updated! ✓');
      setEditProd(null); fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating product', 'error');
    } finally { setSaving(false); }
  };

  const deleteProduct = (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    api.delete(`/ecom/products/${id}`)
      .then(() => { showToast('Product deleted'); fetchProducts(); })
      .catch(err => showToast(err.response?.data?.message || 'Error', 'error'));
  };

  if (loading) return <div className="loading-screen"><div className="spinner" />Loading products...</div>;

  return (
    <div>
      <div className="admin-section-header">
        <h1>Products ({products.length})</h1>
        <button className="btn-add-new" onClick={() => { setNewProd(empty); setShowAdd(true); }}>+ Add New Product</button>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 10 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <h3 style={{ color: '#555', marginBottom: 8 }}>No products yet</h3>
          <button className="btn-add-new" onClick={() => setShowAdd(true)}>+ Add New Product</button>
        </div>
      ) : (
        <div className="admin-product-grid">
          {products.map(p => (
            <div className="admin-product-card" key={p.productId}>
              <img src={p.imageUrl} alt={p.name}
                onError={e => { e.target.src = 'https://placehold.co/210x155?text=No+Image'; }} />
              <div className="admin-product-card-info">
                <h3 title={p.name}>{p.name}</h3>
                <p className="prod-meta">#{p.productId} &nbsp;•&nbsp; {p.category}</p>
                <p className="prod-price">₹{p.price?.toLocaleString('en-IN')}</p>
              </div>
              <div className="admin-product-card-actions">
                <button className="btn-edit-prod" onClick={() => setEditProd({ ...p })}>✏️ Edit</button>
                <button className="btn-del-prod" onClick={() => deleteProduct(p.productId, p.name)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="Add New Product" onClose={() => setShowAdd(false)}>
          <ProductForm data={newProd} setData={setNewProd} onSubmit={addProduct} btnLabel="Add Product" saving={saving} />
        </Modal>
      )}
      {editProd && (
        <Modal title="Edit Product" onClose={() => setEditProd(null)}>
          <ProductForm data={editProd} setData={setEditProd} onSubmit={updateProduct} btnLabel="Update Product" saving={saving} />
        </Modal>
      )}
      <Toast toast={toast} />
    </div>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    api.get('/ecom/orders/all')
      .then(res => setOrders(res.data))
      .catch(err => {
        // 404 = no orders yet, not a real error
        if (err.response?.status === 404) setEmpty(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" />Loading orders...</div>;

  return (
    <div>
      <div className="admin-section-header"><h1>All Orders ({orders.length})</h1></div>
      {(orders.length === 0 || empty) ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 10, color: '#777' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
          <h3>No orders placed yet</h3>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.orderId}>
                  <td><strong>#{o.orderId}</strong></td>
                  <td>
                    {o.user?.firstName} {o.user?.lastName}
                    <br /><span style={{ fontSize: 11, color: '#888' }}>{o.user?.email}</span>
                  </td>
                  <td>
                    {o.orderItem?.map(i => (
                      <div key={i.orderItemId} style={{ fontSize: 12, padding: '1px 0' }}>
                        {i.product?.name} <span style={{ color: '#888' }}>×{i.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td><strong style={{ color: '#e74c3c' }}>₹{o.totalAmount?.toLocaleString('en-IN')}</strong></td>
                  <td><span className={`status-chip chip-${o.status}`}>{o.status}</span></td>
                  <td>{o.payment
                    ? <span style={{ color: '#27ae60', fontSize: 12 }}>✓ {o.payment.paymentMethod}</span>
                    : <span style={{ color: '#aaa', fontSize: 12 }}>Pending</span>}
                  </td>
                  <td style={{ fontSize: 12 }}>{o.orderDate ? new Date(o.orderDate).toLocaleDateString('en-IN') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const CustomersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ecom/customers/get-all-customer')
      .then(res => setUsers(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" />Loading customers...</div>;

  return (
    <div>
      <div className="admin-section-header"><h1>All Customers ({users.length})</h1></div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Registered</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.userId}>
                <td>#{u.userId}</td>
                <td><strong>{u.firstName} {u.lastName}</strong></td>
                <td>{u.email}</td>
                <td>{u.phoneNumber}</td>
                <td><span className="chip-ACTIVE">{u.userAccountStatus}</span></td>
                <td style={{ fontSize: 12 }}>{u.registerTime?.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardTab = ({ setTab }) => {
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/ecom/products/all').catch(() => ({ data: [] })),
      api.get('/ecom/orders/all').catch(() => ({ data: [] })),
      api.get('/ecom/customers/get-all-customer').catch(() => ({ data: [] })),
    ]).then(([p, o, c]) => {
      const revenue = (o.data || []).filter(x => x.status === 'SHIPPED').reduce((s, x) => s + (x.totalAmount || 0), 0);
      setStats({ products: (p.data || []).length, orders: (o.data || []).length, customers: (c.data || []).length, revenue });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" />Loading dashboard...</div>;

  return (
    <div>
      <div className="admin-section-header"><h1>Dashboard Overview</h1></div>
      <div className="stats-grid">
        {[
          { icon: '📦', val: stats.products, label: 'Total Products', tab: 'products' },
          { icon: '🧾', val: stats.orders, label: 'Total Orders', tab: 'orders' },
          { icon: '👥', val: stats.customers, label: 'Customers', tab: 'customers' },
          { icon: '💰', val: `₹${stats.revenue.toLocaleString('en-IN')}`, label: 'Revenue (Shipped)', tab: null },
        ].map(s => (
          <div className="stat-card" key={s.label} style={{ cursor: s.tab ? 'pointer' : 'default' }}
            onClick={() => s.tab && setTab(s.tab)}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-info">
              <div className="stat-value">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 4 }}>
        {[
          { icon: '📦', title: 'Manage Products', desc: 'Add, edit or delete products', tab: 'products', btn: 'Go to Products' },
          { icon: '🧾', title: 'View Orders', desc: 'See all orders and payment status', tab: 'orders', btn: 'Go to Orders' },
          { icon: '👥', title: 'View Customers', desc: 'See all registered customers', tab: 'customers', btn: 'Go to Customers' },
        ].map(card => (
          <div key={card.tab} style={{ background: '#fff', borderRadius: 10, padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', cursor: 'pointer' }}
            onClick={() => setTab(card.tab)}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{card.icon}</div>
            <h3 style={{ fontSize: 16, marginBottom: 6 }}>{card.title}</h3>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>{card.desc}</p>
            <button className="btn-add-new" style={{ fontSize: 13, padding: '8px 16px' }}>{card.btn}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const name = localStorage.getItem('name');

  const logout = () => { localStorage.clear(); navigate('/admin-login'); };

  const navItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { key: 'products', icon: '📦', label: 'Products' },
    { key: 'orders', icon: '🧾', label: 'Orders' },
    { key: 'customers', icon: '👥', label: 'Customers' },
  ];

  return (
    <div className="admin-wrapper">
      <div className="admin-topbar">
        <span className="logo">🛒 ShopEase Admin</span>
        <div className="topbar-right">
          <span className="welcome">👤 {name}</span>
          <button className="btn-admin-logout" onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="admin-body">
        <div className="admin-sidebar">
          <div className="sidebar-brand">Admin Panel</div>
          {navItems.map(item => (
            <div key={item.key} className={`sidebar-nav-item ${tab === item.key ? 'active' : ''}`}
              onClick={() => setTab(item.key)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="admin-content-area">
          {tab === 'dashboard' && <DashboardTab setTab={setTab} />}
          {tab === 'products' && <ProductsTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'customers' && <CustomersTab />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
