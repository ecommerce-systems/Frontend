import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';
import UserPage from './pages/UserPage';
import CoPurchasePage from './pages/CoPurchasePage';
import ResponseTimeToast from './components/ResponseTimeToast';

function App() {
  return (
    <Router>
      <div id="app">
        <nav>
          <ul>
            <li>
              <Link to="/auth">Authentication</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/user">User Profile</Link>
            </li>
            <li>
              <Link to="/co-purchase">Co-purchase</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/co-purchase" element={<CoPurchasePage />} />
        </Routes>

        <ResponseTimeToast />
      </div>
    </Router>
  );
}

export default App;
