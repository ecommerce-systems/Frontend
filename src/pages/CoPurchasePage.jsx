import React from 'react';
import CoPurchaseList from '../components/copurchase/CoPurchaseList';

function CoPurchasePage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>함께 구매한 상품 분석</h1>
        <p style={{ color: 'var(--text-muted)' }}>특정 상품과 함께 자주 구매되는 연관 상품 정보를 확인하세요.</p>
      </div>
      <div className="container">
        <div className="card">
          <CoPurchaseList />
        </div>
      </div>
    </div>
  );
}

export default CoPurchasePage;
