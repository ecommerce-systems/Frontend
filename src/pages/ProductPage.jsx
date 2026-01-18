import React from 'react';
import ProductList from '../components/products/ProductList';
import ProductDetails from '../components/products/ProductDetails';
import ProductSearch from '../components/products/ProductSearch';

function ProductPage() {
  return (
    <div>
      <h1>Product Operations</h1>
      <div className="container">
        <div className="card">
          <ProductList />
        </div>
        <div className="card">
          <ProductDetails />
        </div>
        <div className="card">
          <ProductSearch />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;