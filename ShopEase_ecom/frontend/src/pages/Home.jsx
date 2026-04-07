import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Atta from '../picture/Atta_and_dals.avif';
import Beauty from '../picture/Beauty_and_personal_care.avif';
import Cleaning from '../picture/Cleaning_essentials.avif';
import HomeEss from '../picture/Home_essentials.avif';
import Kids from '../picture/kids_fashion.avif';
import Kitchen from '../picture/Kitchen_must_haves.avif';
import Laptops from '../picture/Laptops_and_Tablets.avif';
import Men from '../picture/men_fashion.avif';
import Oil from '../picture/Oil_and_ghee.avif';
import Tv from '../picture/Smart_Televisions.avif';

const slides = [
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=300&fit=crop',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=300&fit=crop',
];

const cats = [
  { img: Laptops, label: 'Electronics', val: 'electronics' },
  { img: Men, label: 'Fashion', val: 'fashion' },
  { img: Atta, label: 'Grocery', val: 'grocery' },
  { img: Kitchen, label: 'Kitchen', val: 'kitchen' },
  { img: Beauty, label: 'Beauty', val: 'beauty' },
  { img: Cleaning, label: 'Cleaning', val: 'cleaning' },
  { img: HomeEss, label: 'Home', val: 'home' },
  { img: Kids, label: "Kids", val: 'fashion' },
  { img: Oil, label: 'Oil & Ghee', val: 'grocery' },
  { img: Tv, label: 'Televisions', val: 'electronics' },
];

const Home = () => {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ShopEase | Home';
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <div className="hero-slider">
        <img src={slides[slide]} alt="promo" />
        <div className="hero-slider-dots">
          {slides.map((_, i) => <span key={i} className={`dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />)}
        </div>
      </div>

      <div className="home-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {cats.map((c, i) => (
            <div key={i} className="category-card" onClick={() => navigate(`/products?category=${c.val}`)}>
              <img src={c.img} alt={c.label} />
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="home-cta">
        <h2>Explore Thousands of Products</h2>
        <p>New deals every day — electronics, fashion, grocery & more</p>
        <button className="btn-cta" onClick={() => navigate('/products')}>Shop Now →</button>
      </div>
    </div>
  );
};
export default Home;
