import React, { useState } from 'react';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import RefreshToken from '../components/auth/RefreshToken';
import Logout from '../components/auth/Logout';

const BRAND_FEATURES = [
  { icon: '🛍️', text: '10만 개 이상의 상품 탐색' },
  { icon: '⚡', text: '빠르고 간편한 주문 처리' },
  { icon: '🔗', text: '스마트 공동구매 추천' },
  { icon: '🔒', text: '안전한 계정 보안' },
];

function AuthPage() {
  const [tab, setTab] = useState('login');
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className="auth-page fade-in">

      {/* ── Left Brand Panel ── */}
      <div className="auth-brand-panel">
        <div className="auth-brand-logo">S</div>
        <h2 className="auth-brand-headline">
          쇼핑의 새로운<br />기준을 만나다
        </h2>
        <p className="auth-brand-desc">
          ShopHub에서 수만 개의 상품을 탐색하고<br />
          스마트한 쇼핑을 경험해보세요.
        </p>

        <ul className="auth-brand-features">
          {BRAND_FEATURES.map(({ icon, text }) => (
            <li key={text}>
              <span className="auth-feature-icon">{icon}</span>
              {text}
            </li>
          ))}
        </ul>

        {/* Decorative blobs */}
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
      </div>

      {/* ── Right Form Panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">

          {/* Tab switch */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => setTab('login')}
            >
              로그인
            </button>
            <button
              className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => setTab('signup')}
            >
              회원가입
            </button>
          </div>

          {/* Form heading */}
          <div className="auth-form-heading">
            <h2>{tab === 'login' ? '다시 만나서 반가워요 👋' : '새 계정 만들기 🎉'}</h2>
            <p>{tab === 'login'
              ? '아이디와 비밀번호를 입력해 로그인하세요.'
              : '정보를 입력하고 ShopHub를 시작하세요.'
            }</p>
          </div>

          {/* Form content */}
          {tab === 'login' ? <Login /> : <SignUp />}

          {/* Tab switch hint */}
          <p className="auth-switch-hint">
            {tab === 'login' ? (
              <>아직 계정이 없으신가요?{' '}
                <button className="auth-link-btn" onClick={() => setTab('signup')}>회원가입</button>
              </>
            ) : (
              <>이미 계정이 있으신가요?{' '}
                <button className="auth-link-btn" onClick={() => setTab('login')}>로그인</button>
              </>
            )}
          </p>

          {/* Secondary actions toggle */}
          <div className="auth-extra">
            <button
              className="auth-extra-toggle"
              onClick={() => setShowExtra(v => !v)}
            >
              {showExtra ? '▲' : '▼'} 기타 기능 (세션 연장 / 로그아웃)
            </button>

            {showExtra && (
              <div className="auth-extra-grid">
                <div className="auth-extra-card">
                  <RefreshToken />
                </div>
                <div className="auth-extra-card">
                  <Logout />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AuthPage;
