import React from 'react';
import UserProfile from '../components/user/UserProfile';
import UserProfileUpdate from '../components/user/UserProfileUpdate';

function UserPage() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <span className="page-header-icon">👤</span>
        <h1>마이페이지</h1>
        <p className="page-subtitle">회원 정보를 확인하고 프로필을 수정할 수 있습니다.</p>
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
