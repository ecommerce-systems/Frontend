import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api';

function RequireAuth({ children }) {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isLoggedIn) return children;

  const handleQuickStart = async () => {
    setLoading(true);
    setError('');
    const suffix = Math.random().toString(36).slice(2, 7);
    const username = `guest_${suffix}`;
    const password = 'Guest@1234';
    try {
      await axiosInstance.post('/api/v2/auth/signup', {
        username, password, name: '게스트', phone: '010-0000-0000', address: '서울시 강남구',
      });
      const res = await axiosInstance.post('/api/v2/auth/login', { username, password });
      login(res.data.accessToken);
    } catch {
      setError('빠른 시작에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="require-auth-screen">
      <div className="require-auth-box">
        <div className="require-auth-icon">🔒</div>
        <h3>로그인이 필요합니다</h3>
        <p>이 페이지를 이용하려면 로그인해주세요.</p>
        <button className="quick-start-btn" onClick={handleQuickStart} disabled={loading}>
          {loading ? '계정 생성 중...' : '⚡ 빠르게 시작하기'}
        </button>
        {error && <p className="quick-start-error">{error}</p>}
        <div className="auth-divider"><span>또는</span></div>
        <button className="btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/auth')}>
          로그인 / 회원가입
        </button>
      </div>
    </div>
  );
}

export default RequireAuth;
