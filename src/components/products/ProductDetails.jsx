import React, { useState } from 'react';
import axiosInstance from '../../api';

function ProductDetails() {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProductDetails = async () => {
    if (!productId) {
      setError('Please enter a Product ID.');
      return;
    }
    setLoading(true);
    setError('');
    setProduct(null);
    try {
      const response = await axiosInstance.get(`/api/v2/products/${productId}`);
      setProduct(response.data);
    } catch (err) {
      setError(`Failed to fetch product details for ID ${productId}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Product Details (V2)</h3>
      <input
        type="text"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        placeholder="Enter Product ID"
      />
      <button onClick={fetchProductDetails}>Get Details</button>

      {loading && <p>Loading product details...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {product && (
        <div>
          <p>Name: {product.prodName}</p>
          <p>Price: {product.price}</p>
          <p>Image: <img src={product.imageUrl} alt={product.prodName} style={{ maxWidth: '100px' }} /></p>
          <p>Type: {product.productTypeName}</p>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
