import React, { useState, useEffect } from "react";
import { searchProductNames } from "../../api";
import useDebounce from "../../hooks/useDebounce";

function ProductSearch({ onSearch, keyword, setKeyword }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    if (debouncedKeyword) {
      setLoading(true);
      searchProductNames(debouncedKeyword)
        .then((response) => {
          setSuggestions(response.data);
        })
        .catch((err) => {
          console.error("추천 검색어를 가져오지 못했습니다:", err);
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
    if (e.key === "Enter") {
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
    <div style={{ position: "relative" }}>
      <h3 style={{ marginBottom: "1rem" }}>상품 통합 검색</h3>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="상품명, 브랜드, 카테고리 등 검색..."
          style={{ marginBottom: 0 }}
        />
        <button onClick={() => onSearch(keyword)} style={{ marginTop: 0 }}>
          검색하기 style={{ marginBottom: 0 }}
        </button>
      </div>

      {loading && (
        <div
          style={{
            position: "absolute",
            right: "100px",
            top: "55px",
            color: "#64748b",
            fontSize: "0.875rem",
          }}
        >
          검색 중...
        </div>
      )}

      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: "105px",
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            listStyle: "none",
            padding: "0.5rem 0",
            margin: "4px 0 0 0",
            zIndex: 10,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                transition: "background 0.2s",
                fontSize: "0.95rem",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#f8fafc")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductSearch;
