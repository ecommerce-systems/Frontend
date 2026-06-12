import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api";
import { useCart } from "../../context/CartContext";

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

function CoPurchaseList() {
  const [productId,  setProductId]  = useState("");
  const [coPurchases, setCoPurchases] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const fetchCoPurchases = async () => {
    if (!productId.trim()) { setError("상품 ID를 입력해주세요."); return; }
    setLoading(true);
    setError("");
    setHasSearched(false);
    try {
      const res = await axiosInstance.get(`/api/v2/co-purchase/${productId}`);
      setCoPurchases(res.data);
      setHasSearched(true);
    } catch {
      setError(`상품 ID ${productId}에 대한 연관 상품을 불러오지 못했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '0.5rem' }}>연관 구매 상품 탐색</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        상품 ID로 검색하면 함께 많이 구매된 상품을 추천해드립니다.
      </p>

      <div className="search-wrapper" style={{ marginBottom: '2rem' }}>
        <div className="search-input-container">
          <span className="search-input-icon"><SearchIcon /></span>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCoPurchases()}
            placeholder="상품 ID 입력 (예: 507909001)"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
        <button onClick={fetchCoPurchases} style={{ flexShrink: 0 }}>
          <SearchIcon /> 검색
        </button>
      </div>

      {error && <div className="error-box" style={{ marginBottom: '1.5rem' }}>⚠️ {error}</div>}

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>구매 패턴 분석 중...</p>
        </div>
      )}

      {hasSearched && !loading && coPurchases.length === 0 && (
        <div className="empty-state" style={{ background: '#f8f9ff', borderRadius: 'var(--radius)', padding: '3rem' }}>
          <span className="empty-state-icon">🔗</span>
          <h4>연관 상품이 없습니다</h4>
          <p>다른 상품 ID로 검색해보세요.</p>
        </div>
      )}

      {coPurchases.length > 0 && (
        <div className="product-grid">
          {coPurchases.map((product) => (
            <div key={product.productId} className="product-card">
              <div
                className="product-image-area"
                onClick={() => navigate(`/products/${product.productId}`)}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.prodName}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="product-no-image">
                    <div className="product-no-image-icon">📦</div>
                  </div>
                )}
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
                    alert("장바구니에 추가되었습니다!");
                  }}
                >
                  + 장바구니 담기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoPurchaseList;
