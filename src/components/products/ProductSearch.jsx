import React, { useState, useEffect, useCallback } from 'react';
import { searchProductNames } from '../../api';
import useDebounce from '../../hooks/useDebounce';

function ProductSearch({ onSearch, keyword, setKeyword }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    if (debouncedKeyword) {
      setLoading(true);
      searchProductNames(debouncedKeyword)
        .then(response => {
          setSuggestions(response.data);
        })
        .catch(err => {
          console.error("Failed to fetch suggestions:", err);
          setSuggestions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSuggestions([]);
    }
  }, [debouncedKeyword]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(keyword);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion);
    onSearch(suggestion);
    setSuggestions([]);
  };

  return (
    <div>
      <h3>Product Search (V2)</h3>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter search keyword"
      />
      {loading && <p>Searching...</p>}
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductSearch;
