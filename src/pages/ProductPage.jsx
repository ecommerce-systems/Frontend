import React, { useState } from "react";
import ProductList from "../components/products/ProductList";
import ProductSearch from "../components/products/ProductSearch";
import { searchProductsPaginated } from "../api";

function ProductPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async (searchKeyword, page = 0) => {
    if (!searchKeyword) {
      setSearchResults([]);
      setTotalPages(0);
      setCurrentPage(0);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await searchProductsPaginated(searchKeyword, page);
      const { content, totalPages, number } = response.data;
      setSearchResults(content);
      setTotalPages(totalPages);
      setCurrentPage(number);
    } catch (err) {
      setError("상품 검색 중 오류가 발생했습니다.");
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>상품 탐색 및 검색</h1>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <ProductSearch
          keyword={keyword}
          setKeyword={setKeyword}
          onSearch={handleSearch}
        />
      </div>

      <div className="card">
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid var(--primary-color)', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto'
            }}></div>
            <p style={{ color: 'var(--text-muted)' }}>상품 정보를 불러오고 있습니다...</p>
          </div>
        )}
        
        {error && (
          <div style={{ 
            background: '#fef2f2', 
            color: 'var(--error-color)', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '1px solid #fee2e2',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <ProductList products={searchResults} />
            
            {totalPages > 1 && (
              <div style={{ 
                marginTop: '2rem', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '1rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1.5rem'
              }}>
                <button
                  onClick={() => handlePaginate(currentPage - 1)}
                  disabled={currentPage === 0}
                  style={{ background: '#f1f5f9', color: '#475569' }}
                >
                  이전
                </button>
                <span style={{ fontWeight: 600, color: '#64748b' }}>
                  {currentPage + 1} / {totalPages} 페이지
                </span>
                <button
                  onClick={() => handlePaginate(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  style={{ background: '#f1f5f9', color: '#475569' }}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ProductPage;
