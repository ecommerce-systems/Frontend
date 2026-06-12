import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderPage from './pages/OrderPage';
import UserPage from './pages/UserPage';
import CoPurchasePage from './pages/CoPurchasePage';
import ResponseTimeToast from './components/ResponseTimeToast';
import { CartProvider, useCart } from './context/CartContext';

function NavContent() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className="main-nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">S</div>
          <span className="nav-brand-text">ShopHub</span>
        </Link>
        <ul className="nav-links">
          <li><NavLink to="/products"    className={({ isActive }) => isActive ? 'active' : ''}>상품검색</NavLink></li>
          <li>
            <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
              주문현황
              {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
            </NavLink>
          </li>
          <li><NavLink to="/co-purchase" className={({ isActive }) => isActive ? 'active' : ''}>공동구매</NavLink></li>
          <li><NavLink to="/user"        className={({ isActive }) => isActive ? 'active' : ''}>마이페이지</NavLink></li>
          <li>
            <NavLink to="/auth" className={({ isActive }) => isActive ? 'active nav-auth-btn' : 'nav-auth-btn'}>
              로그인
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <NavContent />
        <div id="app">
          <Routes>
            <Route path="/"                    element={<HomePage />} />
            <Route path="/auth"                element={<AuthPage />} />
            <Route path="/products"            element={<ProductPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/orders"              element={<OrderPage />} />
            <Route path="/user"                element={<UserPage />} />
            <Route path="/co-purchase"         element={<CoPurchasePage />} />
            <Route path="*"                    element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <ResponseTimeToast />
      </Router>
    </CartProvider>
  );
}

export default App;
