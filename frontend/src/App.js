import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllRoutes from './Router/AllRoutes';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AllRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
