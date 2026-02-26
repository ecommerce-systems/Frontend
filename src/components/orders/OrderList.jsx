import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/orders');
      const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);
    } catch (err) {
      setError('주문 내역을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p style={{ color: 'var(--text-muted)' }}>주문 내역을 불러오는 중...</p>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: '1rem', background: '#fef2f2', color: 'var(--error-color)', borderRadius: '8px' }}>
      {error}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>최근 주문 현황</h3>
        <button 
          onClick={fetchOrders} 
          style={{ background: '#f1f5f9', color: '#475569', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
        >
          새로고침
        </button>
      </div>

      {orders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.orderId} style={{ 
              border: '1px solid var(--border-color)', 
              borderRadius: '10px', 
              padding: '1rem',
              background: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>주문번호: #{order.orderId}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {new Date(order.orderDate).toLocaleString()}
                </span>
              </div>
              
              <div style={{ margin: '0.75rem 0' }}>
                {order.orderDetails.map((detail, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-main)' }}>• {detail.productName} ({detail.quantity}개)</span>
                    <span style={{ fontWeight: 600 }}>₩{detail.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  background: order.status === 'COMPLETED' ? '#dcfce7' : '#fef9c3',
                  color: order.status === 'COMPLETED' ? '#166534' : '#854d0e',
                  fontWeight: 600
                }}>
                  {order.status === 'COMPLETED' ? '결제완료' : order.status}
                </span>
                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                  총 결제금액: ₩{order.orderDetails.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '12px' }}>
          <p>주문 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
}

export default OrderList;
