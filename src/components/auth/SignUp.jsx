import React, { useState } from 'react';
import axiosInstance from '../../api';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    try {
      const res = await axiosInstance.post('/api/v2/auth/signup', { username, password, name, phone, address });
      setResult(`<p style="color: var(--success-color); font-weight: bold;">✅ 회원가입 완료! ${username}님 가입을 축하드립니다.</p>`);
    } catch (error) {
      setResult(`<p style="color: var(--error-color);">❌ 회원가입 실패: 이미 존재하는 아이디이거나 입력 정보를 확인해주세요.</p>`);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.8rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>아이디</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디" required style={{ marginBottom: 0 }} />
        </div>
        <div style={{ marginBottom: '0.8rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>비밀번호</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required style={{ marginBottom: 0 }} />
        </div>
        <div style={{ marginBottom: '0.8rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>이름</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="성함" required style={{ marginBottom: 0 }} />
        </div>
        <div style={{ marginBottom: '0.8rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>전화번호</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" required style={{ marginBottom: 0 }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>주소</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="상세 주소" required style={{ marginBottom: 0 }} />
        </div>
        <button type="submit" style={{ width: '100%' }}>회원가입하기</button>
      </form>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default SignUp;
