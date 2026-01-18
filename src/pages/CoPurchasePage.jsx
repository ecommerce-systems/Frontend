import React from 'react';
import CoPurchaseList from '../components/copurchase/CoPurchaseList';

function CoPurchasePage() {
  return (
    <div>
      <h1>Co-purchase Operations</h1>
      <div className="container">
        <div className="card">
          <CoPurchaseList />
        </div>
      </div>
    </div>
  );
}

export default CoPurchasePage;