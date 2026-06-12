import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api';
import { useCart } from '../context/CartContext';

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/v2/products/${productId}`);
        setProduct(response.data);
      } catch {
        setError('상품 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      setRecLoading(true);
      try {
        const response = await axiosInstance.get(`/api/v2/co-purchase/${productId}`);
        setRecommendations(response.data);
      } catch {
        // 추천 상품 없음은 무시
      } finally {
        setRecLoading(false);
      }
    };

    fetchProduct();
    fetchRecommendations();
  }, [productId]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div className="error-box" style={{ display: 'inline-flex' }}>{error}</div>
      </div>
    );
  }

  if (!product) return null;

  const SPEC_ROWS = [
    { label: '섹션', value: product.sectionName },
    { label: '부서', value: product.departmentName },
    { label: '그룹', value: product.indexGroupName },
    { label: '색상', value: product.colourGroupName },
  ];

  return (
    <div className="fade-in">
      <button
        className="btn-ghost"
        onClick={() => navigate('/products')}
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        ← 목록으로 돌아가기
      </button>

      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '3rem', alignItems: 'start' }}>
          {/* 이미지 */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f2ff 0%, #f5f0ff 100%)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border)',
          }}>
            <img
              src={product.imageUrl || ''}
              alt={product.prodName}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div style="color:#94a3b8;font-size:4rem;opacity:0.3">📦</div>';
              }}
            />
          </div>

          {/* 상품 정보 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              {product.productTypeName && (
                <span className="badge badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
                  {product.productTypeName}
                </span>
              )}
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{product.prodName}</h1>
              {product.detailDesc && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>{product.detailDesc}</p>
              )}
            </div>

            <div style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              ₩{product.price?.toLocaleString()}
            </div>

            {/* 스펙 */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                상품 스펙
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {SPEC_ROWS.map(({ label, value }) => value && (
                  <div key={label} style={{
                    background: '#f8f9ff',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              style={{ padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-sm)', marginTop: 'auto' }}
              onClick={() => {
                addToCart(product);
                alert('장바구니에 추가되었습니다!');
              }}
            >
              + 장바구니에 담기
            </button>
          </div>
        </div>
      </div>

      {/* 추천 상품 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
          <h2>함께 많이 구매한 상품</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>연관 추천 아이템</span>
        </div>

        {recLoading ? (
          <div className="loading-state">
            <div className="spinner" />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="product-grid">
            {recommendations.slice(0, 4).map((rec) => (
              <div
                key={rec.productId}
                className="product-card"
                onClick={() => { navigate(`/products/${rec.productId}`); window.scrollTo(0, 0); }}
              >
                <div className="product-image-area">
                  {rec.imageUrl ? (
                    <img src={rec.imageUrl} alt={rec.prodName} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="product-no-image">
                      <div className="product-no-image-icon">📦</div>
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <p className="product-name" title={rec.prodName}>{rec.prodName}</p>
                  <div className="product-price">₩{rec.price?.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ background: '#f8f9ff', borderRadius: 'var(--radius)', padding: '3rem' }}>
            <div className="empty-state-icon">🔗</div>
            <p>추천할 연관 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
