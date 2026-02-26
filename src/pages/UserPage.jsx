import React from 'react';
import UserProfile from '../components/user/UserProfile';
import UserProfileUpdate from '../components/user/UserProfileUpdate';

function UserPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>마이페이지</h1>
        <p style={{ color: 'var(--text-muted)' }}>회원님의 프로필 정보 확인 및 수정을 진행할 수 있습니다.</p>
      </div>
      <div className="container">
        <div className="card">
          <UserProfile />
        </div>
        <div className="card">
          <UserProfileUpdate />
        </div>
      </div>
    </div>
  );
}

export default UserPage;
