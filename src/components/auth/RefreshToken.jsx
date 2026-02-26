import React, { useState } from 'react';
import axiosInstance, { setAccessToken } from '../../api';

function RefreshToken() {
  const [result, setResult] = useState('');

  const handleRefresh = async () => {
    setResult('');
    try {
      const res = await axiosInstance.post('/api/v2/auth/refresh');
      const newAccessToken = res.data.accessToken;
      setAccessToken(newAccessToken);
      setResult('<p style="color: var(--success-color); font-weight: bold;">🔄 로그인 연장에 성공했습니다!</p>');
    } catch (error) {
      setResult(`<p style="color: var(--error-color);">❌ 연장 실패: 다시 로그인해야 합니다.</p>`);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>로그인 연장</h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        보안을 위해 주기적으로 로그인 세션을 연장할 수 있습니다.
      </p>
      <button onClick={handleRefresh} style={{ width: '100%', background: 'var(--primary-color)' }}>로그인 세션 연장</button>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default RefreshToken;
