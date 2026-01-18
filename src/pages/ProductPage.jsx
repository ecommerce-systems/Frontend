import React, { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import ProductDetails from '../components/products/ProductDetails';
import ProductSearch from '../components/products/ProductSearch';
import axiosInstance, { searchProductsPaginated } from '../api';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/v1/products/');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async (searchKeyword, page = 0) => {
    if (!searchKeyword) {
      setSearchResults([]);
      setTotalPages(0);
      setCurrentPage(0);
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await searchProductsPaginated(searchKeyword, page);
      const { content, totalPages, number } = response.data;
      setSearchResults(content);
      setTotalPages(totalPages);
      setCurrentPage(number);
    } catch (err) {
      setError('Failed to search products.');
      setSearchResults([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaginate = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      handleSearch(keyword, newPage);
    }
  };

  const displayProducts = searchResults.length > 0 || keyword ? searchResults : products;

  return (
    <div>
      <h1>Product Operations</h1>
      <div className="container">
        <div className="card">
          <ProductSearch keyword={keyword} setKeyword={setKeyword} onSearch={handleSearch} />
        </div>
        <div className="card">
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && (
            <>
              <ProductList products={displayProducts} />
              {totalPages > 1 && (
                <div>
                  <button onClick={() => handlePaginate(currentPage - 1)} disabled={currentPage === 0}>
                    Previous
                  </button>
                  <span> Page {currentPage + 1} of {totalPages} </span>
                  <button onClick={() => handlePaginate(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="card">
          <ProductDetails />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;