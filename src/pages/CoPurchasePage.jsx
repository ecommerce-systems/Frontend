import React from 'react';
import CoPurchaseList from '../components/copurchase/CoPurchaseList';

function CoPurchasePage() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <span className="page-header-icon">🔗</span>
        <h1>공동구매 분석</h1>
        <p className="page-subtitle">특정 상품과 함께 자주 구매되는 연관 상품을 확인하세요.</p>
      </div>

      <div className="card">
        <CoPurchaseList />
      </div>
    </div>
  );
}

export default CoPurchasePage;
