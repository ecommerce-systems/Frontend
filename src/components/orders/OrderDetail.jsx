import React, { useState } from 'react';
import axiosInstance from '../../api';

function OrderDetail() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrderDetail = async () => {
    if (!orderId) {
      setError('Please enter an Order ID.');
      return;
    }
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const response = await axiosInstance.get(`/api/v1/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      setError(`Failed to fetch order details for ID ${orderId}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Order Detail</h3>
      <input
        type="text"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
      />
      <button onClick={fetchOrderDetail}>Get Details</button>

      {loading && <p>Loading order details...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {order && (
        <div>
          <p>Order ID: {order.orderId}</p>
          <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
          <p>Status: {order.status}</p>
          <h4>Items:</h4>
          <ul>
            {order.orderDetails.map(detail => (
              <li key={detail.productId}>
                {detail.productName} ({detail.quantity} pcs) - {detail.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
