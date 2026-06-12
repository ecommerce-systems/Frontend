import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';
import { useCart } from '../../context/CartContext';

function OrderCreate({ onOrderCreated }) {
  const { cartItems, clearCart } = useCart();
  const [items, setItems] = useState([{ productId: '', quantity: '' }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length > 0) {
      setItems(cartItems.map(item => ({
        productId: item.productId.toString(),
        quantity: item.quantity,
      })));
    }
  }, [cartItems]);

  const addItem    = () => setItems(prev => [...prev, { productId: '', quantity: '' }]);
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const changeItem = (i, field, val) =>
    setItems(prev => prev.map((item, idx) =>
      idx === i ? { ...item, [field]: field === 'quantity' ? parseInt(val) || '' : val } : item
    ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    const orderItems = items
      .map(it => ({ productId: parseInt(it.productId), quantity: Number(it.quantity) }))
      .filter(it => !isNaN(it.productId) && it.quantity > 0);

    if (orderItems.length === 0) {
      setResult({ ok: false, msg: '유효한 상품 ID와 수량을 입력해주세요.' });
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post('/api/v1/orders', { items: orderItems });
      setResult({ ok: true, msg: '주문이 성공적으로 완료되었습니다!' });
      setItems([{ productId: '', quantity: '' }]);
      clearCart();
      onOrderCreated?.();
    } catch (err) {
      setResult({ ok: false, msg: err.response?.data?.message ?? '네트워크 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>새 주문 작성</h3>

      {cartItems.length > 0 && (
        <div className="cart-info-box">
          🛒 장바구니 상품 {cartItems.length}개가 자동으로 입력되었습니다.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {items.map((item, i) => (
          <div key={i} className="order-item-form-row">
            <div>
              <label>상품 ID</label>
              <input
                type="text"
                placeholder="예: 507909001"
                value={item.productId}
                onChange={(e) => changeItem(i, 'productId', e.target.value)}
              />
            </div>
            <div style={{ width: '80px' }}>
              <label>수량</label>
              <input
                type="number"
                placeholder="1"
                value={item.quantity}
                onChange={(e) => changeItem(i, 'quantity', e.target.value)}
                min="1"
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                className="btn-danger"
                onClick={() => removeItem(i)}
                style={{ padding: '0.6rem 0.75rem', fontSize: '0.8rem', alignSelf: 'flex-end' }}
              >
                삭제
              </button>
            )}
          </div>
        ))}

        <div className="order-form-actions">
          <button type="button" className="btn-secondary" onClick={addItem} style={{ flex: 1 }}>
            + 상품 추가
          </button>
          <button type="submit" disabled={loading} style={{ flex: 2 }}>
            {loading ? '처리 중...' : '지금 주문하기 →'}
          </button>
        </div>
      </form>

      {result && (
        <div style={{ marginTop: '1.25rem' }} className={result.ok ? 'success-box' : 'error-box'}>
          {result.ok ? '✅' : '⚠️'} {result.msg}
        </div>
      )}
    </div>
  );
}

export default OrderCreate;
