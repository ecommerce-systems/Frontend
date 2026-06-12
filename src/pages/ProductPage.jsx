import React, { useState } from "react";
import ProductList from "../components/products/ProductList";
import ProductSearch from "../components/products/ProductSearch";
import { searchProductsPaginated } from "../api";

function ProductPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [keyword,       setKeyword]       = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [currentPage,   setCurrentPage]   = useState(0);
  const [totalPages,    setTotalPages]    = useState(0);

  const handleSearch = async (kw, page = 0) => {
    if (!kw) {
      setSearchResults([]);
      setTotalPages(0);
      setCurrentPage(0);
      return;
    }
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

      {(loading || error || searchResults.length > 0) && (
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
        </div>
      )}

      {!loading && !error && searchResults.length === 0 && keyword === '' && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <span className="empty-state-icon">🔍</span>
          <h4>검색어를 입력해주세요</h4>
          <p>상품명, 브랜드, 카테고리로 검색할 수 있어요.</p>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
