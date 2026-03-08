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
      } catch (err) {
        setError('상품 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      setRecLoading(true);
      try {
        const response = await axiosInstance.get(`/api/v2/co-purchase/${productId}`);
        setRecommendations(response.data);
      } catch (err) {
        console.error('추천 상품을 불러오는데 실패했습니다.', err);
      } finally {
        setRecLoading(false);
      }
    };

    fetchProduct();
    fetchRecommendations();
  }, [productId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>상품 정보를 불러오는 중...</div>;
  if (error) return <div style={{ color: 'var(--error-color)', textAlign: 'center', padding: '5rem' }}>{error}</div>;
  if (!product) return null;

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <button 
          onClick={() => navigate('/products')} 
          style={{ background: 'transparent', color: 'var(--text-muted)', padding: 0, marginBottom: '1.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
        >
          <span style={{ marginRight: '0.5rem' }}>←</span> 목록으로 돌아가기
        </button>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
          <div style={{ background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', height: '400px' }}>
            <img 
              src={product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'} 
              alt={product.prodName}
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ 
                background: 'var(--primary-color)', 
                color: 'white', 
                padding: '4px 10px', 
                borderRadius: '6px', 
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}>
                {product.productTypeName || '상품'}
              </span>
              <h1 style={{ margin: '1rem 0 0.5rem 0', fontSize: '2.2rem', lineHeight: 1.2 }}>{product.prodName}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>{product.detailDesc}</p>
              <div className="product-price" style={{ fontSize: '2.8rem', marginBottom: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                ₩{product.price?.toLocaleString()}
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>상품 스펙</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 2rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>섹션</span><span>{product.sectionName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>부서</span><span>{product.departmentName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>그룹</span><span>{product.indexGroupName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>색상</span><span>{product.colourGroupName}</span>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto' }}>
              <button 
                style={{ width: '100%', padding: '1.2rem', fontSize: '1.25rem', fontWeight: 'bold', borderRadius: '12px' }}
                onClick={() => {
                  addToCart(product);
                  alert('장바구니에 추가되었습니다!');
                }}
              >
                장바구니에 담기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 추천 상품 섹션 */}
      <div style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>함께 많이 구매한 상품</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>이 상품과 연관된 추천 아이템</span>
        </div>

        {recLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>추천 상품을 불러오는 중...</div>
        ) : recommendations.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {recommendations.slice(0, 4).map((rec) => (
              <div 
                key={rec.productId} 
                className="card" 
                style={{ 
                  padding: '1rem', 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onClick={() => {
                  navigate(`/products/${rec.productId}`);
                  window.scrollTo(0, 0);
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  background: '#f1f5f9', 
                  borderRadius: '8px', 
                  height: '180px', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={rec.imageUrl || 'https://via.placeholder.com/180x180?text=No+Image'} 
                    alt={rec.prodName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/180x180?text=No+Image'; }}
                  />
                </div>
                <h4 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} title={rec.prodName}>
                  {rec.prodName}
                </h4>
                <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginTop: 'auto' }}>
                  ₩{rec.price?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            background: '#f8fafc', 
            borderRadius: '12px',
            color: 'var(--text-muted)'
          }}>
            추천할 연관 상품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
