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
        setError('상품 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>상품 정보를 불러오는 중...</div>;
  if (error) return <div style={{ color: 'var(--error-color)', textAlign: 'center', padding: '5rem' }}>{error}</div>;
  if (!product) return null;

  return (
    <div className="container">
      <div className="card" style={{ padding: '2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'transparent', color: 'var(--text-muted)', padding: 0, marginBottom: '1rem', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
        >
          ← 목록으로 돌아가기
        </button>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'} 
              alt={product.prodName}
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
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
              {product.productTypeName || '상품'}
            </span>
            <h1 style={{ margin: '0.5rem 0', fontSize: '2rem' }}>{product.prodName}</h1>
            <div className="product-price" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>
              ₩{product.price?.toLocaleString()}
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>상품 상세 정보</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex' }}><span style={{ width: '100px', fontWeight: 600 }}>섹션</span><span>{product.sectionName}</span></div>
                <div style={{ display: 'flex' }}><span style={{ width: '100px', fontWeight: 600 }}>부서</span><span>{product.departmentName}</span></div>
                <div style={{ display: 'flex' }}><span style={{ width: '100px', fontWeight: 600 }}>그룹</span><span>{product.indexGroupName}</span></div>
                <div style={{ display: 'flex' }}><span style={{ width: '100px', fontWeight: 600 }}>색상</span><span>{product.colourGroupName}</span></div>
              </div>
            </div>
            
            <button 
              style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold' }}
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
  );
}

export default ProductDetailPage;
