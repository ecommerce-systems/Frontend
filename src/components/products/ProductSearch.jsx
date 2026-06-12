import React, { useState, useEffect } from "react";
import { searchProductNames } from "../../api";
import useDebounce from "../../hooks/useDebounce";

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

function ProductSearch({ onSearch, keyword, setKeyword }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    if (debouncedKeyword) {
      setLoading(true);
      searchProductNames(debouncedKeyword)
        .then((response) => setSuggestions(response.data))
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    } else {
      setSuggestions([]);
    }
  }, [debouncedKeyword]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(keyword);
      setSuggestions([]);
    }
    if (e.key === "Escape") {
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
      <h3 style={{ marginBottom: '1.25rem' }}>상품 통합 검색</h3>
      <div className="search-wrapper">
        <div className="search-input-container">
          <span className="search-input-icon">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="상품명, 브랜드, 카테고리 등으로 검색..."
            style={{ paddingLeft: '2.75rem' }}
          />

          {suggestions.length > 0 && (
            <ul className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={() => { onSearch(keyword); setSuggestions([]); }} style={{ flexShrink: 0 }}>
          <SearchIcon />
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>
    </div>
  );
}

export default ProductSearch;
