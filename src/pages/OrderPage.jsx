import React from 'react';
import OrderCreate from '../components/orders/OrderCreate';
import OrderList from '../components/orders/OrderList';
import OrderDetail from '../components/orders/OrderDetail';

function OrderPage() {
  return (
    <div>
      <h1>Order Operations</h1>
      <div className="container">
        <div className="card">
          <OrderCreate />
        </div>
        <div className="card">
          <OrderList />
        </div>
        <div className="card">
          <OrderDetail />
        </div>
      </div>
    </div>
  );
}

export default OrderPage;