import React, { useState } from 'react';
import axiosInstance, { setAccessToken } from '../../api';

function Logout() {
  const [result, setResult] = useState('');

  const handleLogout = async () => {
    setResult('');
    try {
      await axiosInstance.post('/api/v2/auth/logout');
      setAccessToken(null);
      setResult('<p style="color: var(--text-muted); font-weight: bold;">👋 로그아웃되었습니다. 다시 방문해주세요!</p>');
    } catch (error) {
      setResult(`<p style="color: var(--error-color);">❌ 로그아웃 실패: 이미 로그아웃 상태이거나 서버 오류입니다.</p>`);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>로그아웃</h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        안전한 서비스 이용을 위해 사용을 마치신 후에는 로그아웃을 해주세요.
      </p>
      <button onClick={handleLogout} style={{ width: '100%', background: '#f1f5f9', color: '#475569' }}>로그아웃 하기</button>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default Logout;
