import React, { useState } from 'react';
import axiosInstance, { setAccessToken } from '../../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    try {
      const res = await axiosInstance.post('/api/v2/auth/login', { username, password });
      const { accessToken } = res.data;
      setAccessToken(accessToken);
      setResult(`<p style="color: var(--success-color); font-weight: bold;">✅ ${username}님, 환영합니다! 로그인에 성공했습니다.</p>`);
    } catch (error) {
      setResult(`<p style="color: var(--error-color);">❌ 로그인 실패: 아이디 또는 비밀번호를 확인해주세요.</p>`);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>아이디</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디를 입력하세요" required style={{ marginBottom: 0 }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>비밀번호</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" required style={{ marginBottom: 0 }} />
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>로그인하기</button>
      </form>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default Login;
