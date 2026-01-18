import React from 'react';
import SignUp from '../components/auth/SignUp';
import Login from '../components/auth/Login';
import Logout from '../components/auth/Logout';
import RefreshToken from '../components/auth/RefreshToken';

function AuthPage() {
  return (
    <div>
      <h1>Auth Operations</h1>
      <div className="container">
        <div className="card">
          <SignUp />
        </div>
        <div className="card">
          <Login />
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
