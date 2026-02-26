import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';
import { useCart } from '../../context/CartContext';

function OrderCreate({ onOrderCreated }) {
  const { cartItems, clearCart } = useCart();
  const [items, setItems] = useState([{ productId: '', quantity: '' }]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length > 0) {
      setItems(cartItems.map(item => ({
        productId: item.productId.toString(),
        quantity: item.quantity
      })));
    }
  }, [cartItems]);

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: field === 'quantity' ? parseInt(value) : value } : item
    );
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        productId: parseInt(item.productId),
        quantity: item.quantity
      })).filter(item => !isNaN(item.productId) && !isNaN(item.quantity) && item.quantity > 0);

      if (orderItems.length === 0) {
        setResult('<p style="color: var(--error-color);">유효한 상품 아이디와 수량을 입력해주세요.</p>');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post('/api/v1/orders', { items: orderItems });
      setResult(`<p style="color: var(--success-color); font-weight: bold;">✅ 주문이 성공적으로 완료되었습니다!</p>`);
      setItems([{ productId: '', quantity: '' }]);
      clearCart();
      
      // 자동 리프레시 실행
      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (error) {
      setResult(`<p style="color: var(--error-color);">❌ 주문 실패: ${error.response?.data?.message || '네트워크 오류가 발생했습니다.'}</p>`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>새 주문 작성</h3>
      
      {cartItems.length > 0 && (
        <div style={{ 
          background: '#eff6ff', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          border: '1px solid #bfdbfe',
          fontSize: '0.9rem'
        }}>
          🛒 <strong>장바구니 연동:</strong> 장바구니에 담긴 {cartItems.length}개의 상품이 자동으로 입력되었습니다.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '0.75rem', 
            alignItems: 'center',
            background: '#f8fafc',
            padding: '0.5rem',
            borderRadius: '8px'
          }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>상품 ID</label>
              <input
                type="text"
                placeholder="아이디 입력"
                value={item.productId}
                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>수량</label>
              <input
                type="number"
                placeholder="수량"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                min="1"
                style={{ marginBottom: 0 }}
              />
            </div>
            <button 
              type="button" 
              onClick={() => handleRemoveItem(index)}
              style={{ 
                marginTop: '1.2rem', 
                background: '#fee2e2', 
                color: '#ef4444', 
                padding: '0.5rem',
                minWidth: '40px'
              }}
            >
              삭제
            </button>
          </div>
        ))}
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            type="button" 
            onClick={handleAddItem}
            style={{ flex: 1, background: '#f1f5f9', color: '#475569' }}
          >
            + 상품 추가
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ flex: 2 }}
          >
            {loading ? '주문 처리 중...' : '지금 바로 주문하기'}
          </button>
        </div>
      </form>
      
      <div style={{ marginTop: '1.5rem' }} dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default OrderCreate;
