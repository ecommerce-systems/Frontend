import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/orders');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>My Orders</h3>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.orderId}>
              Order ID: {order.orderId}, Date: {new Date(order.orderDate).toLocaleDateString()}, Status: {order.status}
              <ul>
                {order.orderDetails.map(detail => (
                  <li key={detail.productId}>
                    {detail.productName} ({detail.quantity} pcs) - {detail.price}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default OrderList;
