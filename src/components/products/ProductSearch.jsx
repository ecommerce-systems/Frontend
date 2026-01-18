import React, { useState } from 'react';
import axiosInstance from '../../api';

function ProductSearch() {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!keyword) {
      setError('Please enter a keyword to search.');
      return;
    }
    setLoading(true);
    setError('');
    setSearchResults([]);
    try {
      // Using V2 endpoint for filter-based product name search
      const response = await axiosInstance.get(`/api/v2/products/search`, {
        params: { keyword }
      });
      setSearchResults(response.data);
    } catch (err) {
      setError('Failed to search products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Product Search (V2)</h3>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter search keyword"
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Searching products...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((productName, index) => (
            <li key={index}>{productName}</li>
          ))}
        </ul>
      ) : (
        !loading && !error && keyword && <p>No products found for "{keyword}".</p>
      )}
    </div>
  );
}

export default ProductSearch;
