import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function ProductList({ products }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <p>검색 결과와 일치하는 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>판매 중인 상품 <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 400 }}>({products.length}개)</span></h3>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.productId} className="product-card">
            <div
              className="product-image-area"
              onClick={() => navigate(`/products/${product.productId}`)}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.prodName}
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div className="product-no-image" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
                <div className="product-no-image-icon">📦</div>
                <span>이미지 없음</span>
              </div>
            </div>

            <div
              className="product-info"
              onClick={() => navigate(`/products/${product.productId}`)}
            >
              <p className="product-name" title={product.prodName}>{product.prodName}</p>
              <div className="product-price">₩{product.price?.toLocaleString()}</div>
            </div>

            <div className="product-card-footer">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                  alert('장바구니에 추가되었습니다!');
                }}
              >
                + 장바구니 담기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
