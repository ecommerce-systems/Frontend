import React, { useState, useEffect, useRef } from "react";
import { searchProductNames } from "../../api";
import useDebounce from "../../hooks/useDebounce";

const SearchIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

function ProductSearch({ onSearch, keyword, setKeyword }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 300);
  const skipNextRef = useRef(false);

  useEffect(() => {
    if (skipNextRef.current) {
      skipNextRef.current = false;
      return;
    }
    if (!debouncedKeyword.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    searchProductNames(debouncedKeyword)
      .then((response) => {
        const unique = [...new Set(response.data)];
        setSuggestions(unique);
        setOpen(unique.length > 0);
      })
      .catch(() => {
        setSuggestions([]);
        setOpen(false);
      })
      .finally(() => setLoading(false));
  }, [debouncedKeyword]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(keyword);
      setSuggestions([]);
      setOpen(false);
    }
    if (e.key === "Escape") {
      setSuggestions([]);
      setOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    skipNextRef.current = true;
    setKeyword(suggestion);
    onSearch(suggestion);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div className="search-section">
      <div className="search-bar-wrap">
        <div className="search-input-wrap">
          <span className="search-ico">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="찾으시는 상품을 검색해보세요"
            className="search-input"
          />
          {keyword && (
            <button
              className="search-clear-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                setKeyword("");
                setSuggestions([]);
                setOpen(false);
              }}
            >
              ×
            </button>
          )}
          {open && suggestions.length > 0 && (
            <ul className="suggest-list">
              {suggestions.map((s, i) => (
                <li key={i} onMouseDown={() => handleSuggestionClick(s)} className="suggest-item">
                  <SearchIcon />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="search-btn"
          onClick={() => { onSearch(keyword); setSuggestions([]); setOpen(false); }}
        >
          {loading ? "검색 중" : "검색"}
        </button>
      </div>
    </div>
  );
}

export default ProductSearch;
