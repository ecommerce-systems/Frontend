import React, { useState } from 'react';
import OrderCreate from '../components/orders/OrderCreate';
import OrderList from '../components/orders/OrderList';

function OrderPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <span className="page-header-icon">📋</span>
        <h1>주문 관리</h1>
        <p className="page-subtitle">구매 내역을 확인하고 새로운 주문을 진행하세요.</p>
      </div>

      <div className="container">
        <div className="card">
          <OrderCreate onOrderCreated={() => setRefreshKey(k => k + 1)} />
        </div>
        <div className="card">
          <OrderList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
