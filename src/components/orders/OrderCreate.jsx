import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api';
import { useCart } from '../../context/CartContext';

function OrderCreate({ onOrderCreated }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

  const handleSubmit = async () => {
    if (cartItems.length === 0) return;
    setResult(null);
    setLoading(true);
    const orderItems = cartItems.map(item => ({
      productId: parseInt(item.productId),
      quantity: item.quantity,
    }));
    try {
      await axiosInstance.post('/api/v1/orders', { items: orderItems });
      setResult({ ok: true, msg: '주문이 완료되었습니다!' });
      clearCart();
      onOrderCreated?.();
    } catch (err) {
      setResult({ ok: false, msg: err.response?.data?.message ?? '네트워크 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <p>장바구니가 비어 있습니다.</p>
        <button className="btn-secondary" onClick={() => navigate('/products')}>
          상품 둘러보기
        </button>
      </div>
    );
  }

  return (
    <div className="cart-wrap">
      <h3 className="cart-title">장바구니 <span className="cart-count">{cartItems.length}</span></h3>

      <ul className="cart-list">
        {cartItems.map((item) => (
          <li key={item.productId} className="cart-item">
            <div
              className="cart-item-image"
              onClick={() => navigate(`/products/${item.productId}`)}
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.prodName}
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div className="cart-item-no-img" style={{ display: item.imageUrl ? 'none' : 'flex' }}>📦</div>
            </div>

            <div className="cart-item-info">
              <p
                className="cart-item-name"
                onClick={() => navigate(`/products/${item.productId}`)}
              >
                {item.prodName ?? `상품 #${item.productId}`}
              </p>
              <p className="cart-item-price">₩{(item.price ?? 0).toLocaleString()}</p>
            </div>

            <div className="cart-item-qty">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
            </div>

            <p className="cart-item-subtotal">₩{((item.price ?? 0) * item.quantity).toLocaleString()}</p>

            <button className="cart-item-remove" onClick={() => removeFromCart(item.productId)}>✕</button>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <div className="cart-total">
          <span>합계</span>
          <strong>₩{total.toLocaleString()}</strong>
        </div>
        {result && (
          <div className={result.ok ? 'success-box' : 'error-box'} style={{ marginBottom: '0.75rem' }}>
            {result.ok ? '✅' : '⚠️'} {result.msg}
          </div>
        )}
        <button className="cart-order-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? '처리 중...' : `₩${total.toLocaleString()} 주문하기`}
        </button>
      </div>
    </div>
  );
}

export default OrderCreate;
