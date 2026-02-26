import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';
import { useCart } from '../../context/CartContext';

function OrderCreate() {
  const { cartItems, clearCart } = useCart();
  const [items, setItems] = useState([{ productId: '', quantity: '' }]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync with cart items if available
  useEffect(() => {
    if (cartItems.length > 0) {
      setItems(cartItems.map(item => ({
        productId: item.productId.toString(),
        quantity: item.quantity
      })));
    }
  }, [cartItems]);

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: field === 'quantity' ? parseInt(value) : value } : item
    );
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
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
      setResult(`<p>✅ Order created successfully!</p><pre style="background: #f8fafc; padding: 1rem; border-radius: 8px; font-size: 0.8rem;">${JSON.stringify(response.data, null, 2)}</pre>`);
      setItems([{ productId: '', quantity: '' }]);
      clearCart(); // Clear cart on success
      if (onOrderCreated) onOrderCreated(); // Trigger list refresh
    } catch (error) {
      setResult(`<p style="color: red;">❌ Order creation failed: ${error.response?.data?.message || error.message}</p>`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Create New Order</h3>
      
      {cartItems.length > 0 && (
        <div style={{ 
          background: '#eff6ff', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          border: '1px solid #bfdbfe',
          fontSize: '0.9rem'
        }}>
          🛒 <strong>Cart Sync:</strong> {cartItems.length} items from your cart are ready to be ordered.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '0.75rem', 
            alignItems: 'center',
            background: '#f8fafc',
            padding: '0.5rem',
            borderRadius: '8px'
          }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Product ID</label>
              <input
                type="text"
                placeholder="ID"
                value={item.productId}
                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Qty</label>
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                min="1"
                style={{ marginBottom: 0 }}
              />
            </div>
            <button 
              type="button" 
              onClick={() => handleRemoveItem(index)}
              style={{ 
                marginTop: '1.2rem', 
                background: '#fee2e2', 
                color: '#ef4444', 
                padding: '0.5rem',
                minWidth: '40px'
              }}
            >
              ×
            </button>
          </div>
        ))}
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            type="button" 
            onClick={handleAddItem}
            style={{ flex: 1, background: '#f1f5f9', color: '#475569' }}
          >
            + Add Product
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ flex: 2 }}
          >
            {loading ? 'Processing...' : 'Place Order Now'}
          </button>
        </div>
      </form>
      
      <div style={{ marginTop: '1.5rem' }} dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default OrderCreate;
