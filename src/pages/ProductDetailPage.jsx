import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api';
import { useCart } from '../context/CartContext';

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/v2/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading product...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '5rem' }}>{error}</div>;
  if (!product) return null;

  return (
    <div className="container">
      <div className="card" style={{ padding: '2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'transparent', color: 'var(--text-muted)', padding: 0, marginBottom: '1rem' }}
        >
          ← Back to list
        </button>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
            <img 
              src={product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'} 
              alt={product.prodName}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          
          <div>
            <span style={{ 
              background: 'var(--primary-color)', 
              color: 'white', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {product.productTypeName}
            </span>
            <h1 style={{ margin: '0.5rem 0' }}>{product.prodName}</h1>
            <div className="product-price" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
              ₩{product.price?.toLocaleString()}
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Product Information</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Section: {product.sectionName}<br />
                Department: {product.departmentName}<br />
                Group: {product.indexGroupName}<br />
                Colour: {product.colourGroupName}
              </p>
            </div>
            
            <button 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              onClick={() => {
                addToCart(product);
                alert('Added to cart!');
              }}
            >
              Add to Shopping Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
