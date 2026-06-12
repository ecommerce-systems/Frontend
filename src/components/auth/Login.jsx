import React, { useState } from 'react';
import axiosInstance, { setAccessToken } from '../../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/v2/auth/login', { username, password });
      setAccessToken(res.data.accessToken);
      setResult({ ok: true, msg: `${username}님, 환영합니다!` });
    } catch {
      setResult({ ok: false, msg: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>아이디</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디를 입력하세요"
          required
          autoComplete="username"
        />
      </div>
      <div className="form-group">
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          required
          autoComplete="current-password"
        />
      </div>

      <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
        {loading ? '로그인 중...' : '로그인하기'}
      </button>

      {result && (
        <div className={result.ok ? 'success-box' : 'error-box'} style={{ marginTop: '1rem' }}>
          {result.ok ? '✅' : '⚠️'} {result.msg}
        </div>
      )}
    </form>
  );
}

export default Login;
