import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';

const STATUS_MAP = {
  COMPLETED: { label: '결제완료', cls: 'badge-success' },
  PENDING:   { label: '처리중',   cls: 'badge-warning' },
  CANCELLED: { label: '취소됨',   cls: 'badge-error'   },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/v1/orders');
      setOrders(res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch {
      setError('주문 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return (
    <div className="loading-state">
      <div className="spinner" />
      <p>주문 내역을 불러오는 중...</p>
    </div>
  );

  if (error) return <div className="error-box">⚠️ {error}</div>;

  return (
    <div>
      <div className="section-header">
        <h3>최근 주문 현황</h3>
        <button className="btn-secondary btn-sm" onClick={fetchOrders} style={{ padding: '0.35rem 0.875rem', fontSize: '0.78rem' }}>
          새로고침
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📦</span>
          <h4>아직 주문 내역이 없어요</h4>
          <p>첫 번째 주문을 시작해보세요!</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => {
            const total = order.orderDetails.reduce((s, d) => s + d.price * d.quantity, 0);
            const status = STATUS_MAP[order.status] ?? { label: order.status, cls: 'badge-gray' };
            return (
              <div key={order.orderId} className="order-card">
                <div className="order-card-header">
                  <span className="order-id">주문 #{order.orderId}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="order-date">{formatDate(order.orderDate)}</span>
                    <span className={`badge ${status.cls}`}>{status.label}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  {order.orderDetails.map((detail, i) => (
                    <div key={i} className="order-item-row">
                      <div className="order-item-name">
                        {detail.productName}
                        <span className="order-item-qty">{detail.quantity}개</span>
                      </div>
                      <span className="order-item-price">₩{detail.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {order.orderDetails.length}개 상품
                  </span>
                  <div className="order-total">
                    합계 <span>₩{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderList;
