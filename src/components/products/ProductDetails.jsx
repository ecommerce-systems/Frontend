import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api';
import { useCart } from '../../context/CartContext';

function ProductDetails() {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const fetchProductDetails = async () => {
    if (!productId) {
      setError('상품 ID를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    setProduct(null);
    setRecommendations([]);
    
    try {
      const response = await axiosInstance.get(`/api/v2/products/${productId}`);
      setProduct(response.data);
      
      // Fetch recommendations after product is found
      fetchRecommendations(productId);
    } catch (err) {
      setError(`ID ${productId}에 해당하는 상품 정보를 불러오지 못했습니다.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (id) => {
    setRecLoading(true);
    try {
      const response = await axiosInstance.get(`/api/v2/co-purchase/${id}`);
      setRecommendations(response.data);
    } catch (err) {
      console.error('추천 상품을 불러오는데 실패했습니다.', err);
    } finally {
      setRecLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h3>상품 상세 조회 및 추천</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="상품 ID 입력 (예: 507909001)"
          style={{ marginBottom: 0 }}
        />
        <button onClick={fetchProductDetails} style={{ marginTop: 0 }}>조회하기</button>
      </div>

      {loading && <p style={{ textAlign: 'center', padding: '2rem' }}>상품 정보를 불러오는 중...</p>}
      {error && <p style={{ color: 'var(--error-color)', padding: '1rem', background: '#fef2f2', borderRadius: '8px' }}>{error}</p>}
      
      {product && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'} 
                alt={product.prodName} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <h2 style={{ margin: '0 0 1rem 0' }}>{product.prodName}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                {product.detailDesc || '상품 설명이 없습니다.'}
              </p>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                ₩{product.price?.toLocaleString()}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 600 }}>카테고리:</span> <span>{product.productTypeName}</span>
                <span style={{ fontWeight: 600 }}>색상:</span> <span>{product.colourGroupName}</span>
              </div>
              <button 
                style={{ marginTop: '2rem' }}
                onClick={() => {
                  addToCart(product);
                  alert('장바구니에 추가되었습니다!');
                }}
              >
                장바구니 담기
              </button>
            </div>
          </div>

          {/* 추천 섹션 */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h4 style={{ marginBottom: '1.5rem' }}>연관 추천 상품</h4>
            {recLoading ? (
              <p>추천 상품을 분석 중입니다...</p>
            ) : recommendations.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {recommendations.slice(0, 5).map(rec => (
                  <div 
                    key={rec.productId} 
                    className="card" 
                    style={{ padding: '0.75rem', cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => {
                      setProductId(rec.productId);
                      // In a real app, we'd navigate, but here we can just update the view
                      navigate(`/products/${rec.productId}`);
                    }}
                  >
                    <div style={{ background: '#f8fafc', borderRadius: '4px', height: '120px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                      <img src={rec.imageUrl} alt={rec.prodName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {rec.prodName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>
                      ₩{rec.price?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>추천할 연관 상품이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
