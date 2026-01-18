import React from 'react';

function ProductList({ products }) {
  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <h3>Product List</h3>
      <ul>
        {products.map((product) => (
          <li key={product.productId}>
            {product.prodName} - {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
