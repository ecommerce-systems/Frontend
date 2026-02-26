import React, { useState } from 'react';
import axiosInstance from '../../api';

function ProductDetails() {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProductDetails = async () => {
    if (!productId) {
      setError('상품 ID를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    setProduct(null);
    try {
      const response = await axiosInstance.get(`/api/v2/products/${productId}`);
      setProduct(response.data);
    } catch (err) {
      setError(`ID ${productId}에 해당하는 상품 정보를 불러오지 못했습니다.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>상품 상세 정보</h3>
      <input
        type="text"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        placeholder="상품 ID 입력"
      />
      <button onClick={fetchProductDetails}>조회하기</button>

      {loading && <p>상품 정보를 불러오는 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {product && (
        <div>
          <p>상품명: {product.prodName}</p>
          <p>가격: {product.price}</p>
          <p>이미지: <img src={product.imageUrl} alt={product.prodName} style={{ maxWidth: '100px' }} /></p>
          <p>카테고리: {product.productTypeName}</p>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
