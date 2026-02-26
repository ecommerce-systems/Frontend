import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderPage from './pages/OrderPage';
import UserPage from './pages/UserPage';
import CoPurchasePage from './pages/CoPurchasePage';
import ResponseTimeToast from './components/ResponseTimeToast';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div id="app">
          <nav>
            <ul>
              <li>
                <Link to="/auth">로그인/인증</Link>
              </li>
              <li>
                <Link to="/products">상품검색</Link>
              </li>
              <li>
                <Link to="/orders">주문현황</Link>
              </li>
              <li>
                <Link to="/user">마이페이지</Link>
              </li>
              <li>
                <Link to="/co-purchase">공동구매</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/co-purchase" element={<CoPurchasePage />} />
          </Routes>

          <ResponseTimeToast />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
