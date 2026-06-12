import React from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🛍️',
    title: '상품 탐색',
    desc: '수만 개의 상품을 브랜드, 카테고리, 키워드로 빠르게 찾아보세요.',
    link: '/products',
    label: '상품 보러가기',
    accent: '#6366f1',
  },
  {
    icon: '📋',
    title: '주문 관리',
    desc: '주문 내역을 한눈에 확인하고 새로운 주문을 간편하게 진행하세요.',
    link: '/orders',
    label: '주문 현황 보기',
    accent: '#8b5cf6',
  },
  {
    icon: '🔗',
    title: '공동구매 분석',
    desc: '함께 많이 구매된 상품 데이터를 기반으로 맞춤 상품을 추천받으세요.',
    link: '/co-purchase',
    label: '추천 상품 탐색',
    accent: '#ec4899',
  },
  {
    icon: '👤',
    title: '마이페이지',
    desc: '내 프로필과 배송 정보를 관리하고 쇼핑 내역을 확인하세요.',
    link: '/user',
    label: '프로필 보기',
    accent: '#f59e0b',
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page fade-in">

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-badge">✨ ShopHub에 오신 것을 환영합니다</div>

        <h1 className="hero-title">
          최고의 상품을<br />
          <span className="hero-title-accent">지금 바로</span> 만나보세요
        </h1>

        <p className="hero-subtitle">
          수만 개의 브랜드 상품을 한 곳에서 탐색하고,<br />
          스마트한 추천으로 새로운 쇼핑 경험을 시작하세요.
        </p>

        <div className="hero-actions">
          <button className="hero-btn-primary" onClick={() => navigate('/products')}>
            🛍️ 상품 둘러보기
          </button>
          <button className="hero-btn-secondary" onClick={() => navigate('/auth')}>
            로그인하기 →
          </button>
        </div>

        {/* Decorative blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
      </section>

      {/* ── Stats ── */}
      <section className="stats-row">
        <div className="stat-item">
          <span className="stat-num">10만+</span>
          <span className="stat-label">등록 상품</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">5만+</span>
          <span className="stat-label">누적 주문</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">200+</span>
          <span className="stat-label">브랜드</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">99%</span>
          <span className="stat-label">고객 만족</span>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="feature-section">
        <div className="feature-section-header">
          <h2>무엇을 도와드릴까요?</h2>
          <p>ShopHub의 다양한 기능을 활용해 보세요.</p>
        </div>

        <div className="feature-grid">
          {FEATURES.map(({ icon, title, desc, link, label, accent }) => (
            <div
              key={link}
              className="feature-card"
              onClick={() => navigate(link)}
              style={{ '--card-accent': accent }}
            >
              <div className="feature-icon" style={{ background: `${accent}18`, color: accent }}>
                {icon}
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
              <span className="feature-link">
                {label} <span className="feature-arrow">→</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="cta-banner-inner">
          <div>
            <h2 className="cta-title">지금 바로 시작해볼까요?</h2>
            <p className="cta-subtitle">무료로 가입하고 다양한 혜택을 누리세요.</p>
          </div>
          <button
            className="cta-btn"
            onClick={() => navigate('/auth')}
          >
            무료로 시작하기 →
          </button>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
