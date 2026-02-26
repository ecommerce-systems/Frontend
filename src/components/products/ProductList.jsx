import React from 'react';

function ProductList({ products }) {
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
          <div key={product.productId} className="product-card">
            <div style={{ 
              height: '150px', 
              background: '#f1f5f9', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: '#94a3b8',
              fontSize: '0.875rem'
            }}>
              Product Image Placeholder
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{product.prodName}</h4>
            <div className="product-price">
              ₩{product.price?.toLocaleString()}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button style={{ width: '100%', fontSize: '0.875rem', padding: '0.5rem' }}>
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
