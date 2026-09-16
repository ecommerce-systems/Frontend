import React, { useState, useEffect } from "react";
import ProductList from "../components/products/ProductList";
import ProductSearch from "../components/products/ProductSearch";
import { searchProductsPaginated } from "../api";

function ProductPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [keyword,       setKeyword]       = useState("");
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [currentPage,   setCurrentPage]   = useState(0);
  const [totalPages,    setTotalPages]    = useState(0);

  const handleSearch = async (kw, page = 0) => {
    setLoading(true);
    setError("");
    try {
      const res = await searchProductsPaginated(kw, page);
      const { content, totalPages, number } = res.data;
      setSearchResults(content);
      setTotalPages(totalPages);
      setCurrentPage(number);
    } catch {
      setError("상품 검색 중 오류가 발생했습니다.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch("");
  }, []);

  const handlePaginate = (p) => {
    if (p >= 0 && p < totalPages) handleSearch(keyword, p);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <span className="page-header-icon">🛍️</span>
        <h1>상품 탐색</h1>
        <p className="page-subtitle">원하는 상품을 검색하고 장바구니에 담아보세요.</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <ProductSearch keyword={keyword} setKeyword={setKeyword} onSearch={handleSearch} />
      </div>

      <div className="card">
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>상품을 검색하고 있습니다...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-box">⚠️ {error}</div>
          )}

          {!loading && !error && (
            <>
              <ProductList products={searchResults} />

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn-secondary"
                    onClick={() => handlePaginate(currentPage - 1)}
                    disabled={currentPage === 0}
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                  >
                    ← 이전
                  </button>
                  <span className="page-info">{currentPage + 1} / {totalPages}</span>
                  <button
                    className="btn-secondary"
                    onClick={() => handlePaginate(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                  >
                    다음 →
                  </button>
                </div>
              )}
            </>
          )}
        {!loading && !error && searchResults.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <h4>검색 결과가 없습니다</h4>
            <p>다른 검색어로 다시 시도해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
