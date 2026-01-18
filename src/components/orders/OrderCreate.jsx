import React, { useState } from 'react';
import axiosInstance from '../../api';

function OrderCreate() {
  const [items, setItems] = useState([{ productId: '', quantity: '' }]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: field === 'quantity' ? parseInt(value) : value } : item
    );
    setItems(newItems);
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
        setResult('<p style="color: red;">Please add valid product items.</p>');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post('/api/v1/orders', { items: orderItems });
      setResult(`<p>✅ Order created successfully!</p><pre>${JSON.stringify(response.data, null, 2)}</pre>`);
      setItems([{ productId: '', quantity: '' }]); // Reset form
    } catch (error) {
      setResult(`<p style="color: red;">❌ Order creation failed: ${error.response?.data?.message || error.message}</p>`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Create Order</h3>
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Product ID"
              value={item.productId}
              onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
              style={{ width: '100px', marginRight: '5px' }}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              min="1"
              style={{ width: '80px' }}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </form>
      <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default OrderCreate;
