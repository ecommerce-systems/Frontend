import React, { useState } from 'react';
import axiosInstance from '../../api';

function OrderDetail() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrderDetail = async () => {
    if (!orderId) {
      setError('주문 번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const response = await axiosInstance.get(`/api/v1/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      setError(`주문 번호 ${orderId}에 대한 내역을 찾을 수 없습니다.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>주문 상세 조회</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="주문 번호 입력"
          style={{ marginBottom: 0 }}
        />
        <button onClick={fetchOrderDetail} style={{ marginTop: 0, whiteSpace: 'nowrap' }}>조회하기</button>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>주문 상세 내역을 불러오는 중...</p>}
      {error && <p style={{ color: 'var(--error-color)', padding: '0.8rem', background: '#fef2f2', borderRadius: '8px' }}>{error}</p>}
      
      {order && (
        <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.8rem' }}>
            <p style={{ margin: '0 0 0.4rem 0' }}><strong>주문 번호:</strong> #{order.orderId}</p>
            <p style={{ margin: '0 0 0.4rem 0' }}><strong>주문 일시:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            <p style={{ margin: 0 }}><strong>주문 상태:</strong> <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{order.status === 'COMPLETED' ? '결제완료' : order.status}</span></p>
          </div>
          
          <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1rem' }}>주문 상품 목록</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {order.orderDetails.map((detail, index) => (
              <li key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                <span>• {detail.productName} ({detail.quantity}개)</span>
                <span style={{ fontWeight: 600 }}>₩{detail.price?.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          
          <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '2px solid #e2e8f0', textAlign: 'right' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              총 주문 합계: ₩{order.orderDetails.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
