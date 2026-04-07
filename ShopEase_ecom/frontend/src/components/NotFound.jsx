import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found-page">
      <div className="code">404</div>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <button className="btn-go-home" onClick={()=>navigate('/')}>Go Home</button>
    </div>
  );
};
export default NotFound;
