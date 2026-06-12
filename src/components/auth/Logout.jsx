import React, { useState } from 'react';
import axiosInstance, { setAccessToken } from '../../api';

function Logout() {
  const [result, setResult] = useState(null);

  const handleLogout = async () => {
    setResult(null);
    try {
      await axiosInstance.post('/api/v2/auth/logout');
      setAccessToken(null);
      setResult({ ok: true, msg: '로그아웃되었습니다. 다시 방문해주세요!' });
    } catch {
      setResult({ ok: false, msg: '로그아웃 실패: 이미 로그아웃 상태이거나 서버 오류입니다.' });
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '0.75rem' }}>로그아웃</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        사용을 마치신 후에는 안전하게 로그아웃하세요.
      </p>
      <button className="btn-secondary" onClick={handleLogout} style={{ width: '100%' }}>
        로그아웃 하기
      </button>
      {result && (
        <div style={{ marginTop: '1rem' }} className={result.ok ? 'success-box' : 'error-box'}>
          {result.ok ? '👋' : '⚠️'} {result.msg}
        </div>
      )}
    </div>
  );
}

export default Logout;
