import React from 'react';
import SignUp from '../components/auth/SignUp';
import Login from '../components/auth/Login';
import Logout from '../components/auth/Logout';
import RefreshToken from '../components/auth/RefreshToken';

function AuthPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>계정 관리 및 인증</h1>
        <p style={{ color: 'var(--text-muted)' }}>회원가입 및 로그인을 통해 다양한 서비스를 이용해보세요.</p>
      </div>
      <div className="container">
        <div className="card">
          <Login />
        </div>
        <div className="card">
          <SignUp />
        </div>
        <div className="card">
          <RefreshToken />
        </div>
        <div className="card">
          <Logout />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
