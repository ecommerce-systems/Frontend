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
        <h1>Order Operations</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your purchases and track order history.</p>
      </div>
      
      <div className="container">
        <div className="card">
          <OrderCreate onOrderCreated={handleOrderCreated} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <OrderList key={refreshKey} />
          </div>
          <div className="card">
            <OrderDetail />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
