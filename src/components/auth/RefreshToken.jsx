import React, { useState } from 'react';
import axiosInstance, { setAccessToken } from '../../api';

function RefreshToken() {
  const [result, setResult] = useState(null);

  const handleRefresh = async () => {
    setResult(null);
    try {
      const res = await axiosInstance.post('/api/v2/auth/refresh');
      setAccessToken(res.data.accessToken);
      setResult({ ok: true, msg: '로그인 세션이 연장되었습니다!' });
    } catch {
      setResult({ ok: false, msg: '연장 실패: 다시 로그인이 필요합니다.' });
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '0.75rem' }}>세션 연장</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        주기적으로 세션을 연장해 로그인 상태를 유지하세요.
      </p>
      <button onClick={handleRefresh} style={{ width: '100%' }}>세션 연장하기</button>
      {result && (
        <div style={{ marginTop: '1rem' }} className={result.ok ? 'success-box' : 'error-box'}>
          {result.ok ? '🔄' : '⚠️'} {result.msg}
        </div>
      )}
    </div>
  );
}

export default RefreshToken;
