import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>🛒 ShopEase</h4>
          <p style={{fontSize:13,lineHeight:1.6}}>Your one-stop shop for everything you need, delivered fast.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li onClick={()=>navigate('/products?category=electronics')}>Electronics</li>
            <li onClick={()=>navigate('/products?category=fashion')}>Fashion</li>
            <li onClick={()=>navigate('/products?category=grocery')}>Grocery</li>
            <li onClick={()=>navigate('/products?category=kitchen')}>Kitchen</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>My Account</h4>
          <ul>
            <li onClick={()=>navigate('/login')}>Login</li>
            <li onClick={()=>navigate('/register-user')}>Register</li>
            <li onClick={()=>navigate('/user/cart')}>My Cart</li>
            <li onClick={()=>navigate('/user/order-details')}>My Orders</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Info</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            <li>Contact Us</li>
            <li className="footer-admin-link" onClick={()=>navigate('/admin-login')}>Admin Access</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} ShopEase. All rights reserved.</div>
    </footer>
  );
};
export default Footer;
