import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api";
import { useCart } from "../../context/CartContext";

function CoPurchaseList() {
  const [productId, setProductId] = useState("");
  const [coPurchases, setCoPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const fetchCoPurchases = async () => {
    if (!productId) {
      setError("상품 ID를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    setHasSearched(false);
    try {
      const response = await axiosInstance.get(
        `/api/v2/co-purchase/${productId}`,
      );
      setCoPurchases(response.data);
      setHasSearched(true);
    } catch (err) {
      setError(`상품 ID ${productId}에 대한 연관 상품 정보를 불러오는데 실패했습니다.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchCoPurchases();
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>연관 구매 상품 탐색</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        상품 ID를 입력하면 해당 상품과 함께 가장 많이 판매된 상품들을 추천해 드립니다.
      </p>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="상품 ID 입력 (예: 507909001)"
          style={{ marginBottom: 0 }}
        />
        <button onClick={fetchCoPurchases} style={{ marginTop: 0, whiteSpace: 'nowrap' }}>
          추천 상품 찾기
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid var(--primary-color)', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ color: 'var(--text-muted)' }}>구매 패턴 분석 중...</p>
        </div>
      )}

      {error && (
        <div style={{ 
          background: '#fef2f2', 
          color: 'var(--error-color)', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid #fee2e2',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {hasSearched && !loading && coPurchases.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: '#f8fafc', 
          borderRadius: '12px',
          border: '1px dashed var(--border-color)' 
        }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
          <h4 style={{ margin: 0, color: 'var(--text-main)' }}>연관된 공동구매 상품이 없습니다.</h4>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>다른 상품 ID로 검색해 보세요.</p>
        </div>
      )}

      <div className="product-list">
        {coPurchases.map((product) => (
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
                    e.target.src = 'https://via.placeholder.com/180x180?text=이미지+없음';
                  }}
                />
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>이미지 없음</div>
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
              <div className="product-price" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                ₩{product.price?.toLocaleString()}
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button 
                style={{ width: '100%', fontSize: '0.875rem', padding: '0.5rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                  alert('장바구니에 추가되었습니다!');
                }}
              >
                장바구니 담기
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CoPurchaseList;
