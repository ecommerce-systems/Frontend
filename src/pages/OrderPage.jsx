import React, { useState } from 'react';
import OrderCreate from '../components/orders/OrderCreate';
import OrderList from '../components/orders/OrderList';
import OrderDetail from '../components/orders/OrderDetail';

function OrderPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOrderCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>주문 및 배송 관리</h1>
        <p style={{ color: 'var(--text-muted)' }}>구매 내역을 확인하고 새로운 주문을 진행할 수 있습니다.</p>
      </div>
      
      <div className="container">
        <div className="card">
          <OrderCreate onOrderCreated={handleOrderCreated} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <OrderList key={refreshKey} />
          </div>
          <div className="card" style={{ display: 'none' }}>
            <OrderDetail />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
