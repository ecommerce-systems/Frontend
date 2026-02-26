import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function ProductList({ products }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        <p>No products found matching your search.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Available Products</h3>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.productId} className="product-card" style={{ cursor: 'pointer' }}>
            <div 
              onClick={() => navigate(`/products/${product.productId}`)}
              style={{ 
                height: '180px', 
                background: '#f1f5f9', 
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.prodName} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/180x180?text=No+Image';
                  }}
                />
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No Image</div>
              )}
            </div>
            <div onClick={() => navigate(`/products/${product.productId}`)}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }} title={product.prodName}>
                {product.prodName}
              </h4>
              <div className="product-price">
                ₩{product.price?.toLocaleString()}
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button 
                style={{ width: '100%', fontSize: '0.875rem', padding: '0.5rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                  alert('Added to cart!');
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
