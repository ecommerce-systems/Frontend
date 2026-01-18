import React from 'react';
import UserProfile from '../components/user/UserProfile';
import UserProfileUpdate from '../components/user/UserProfileUpdate';

function UserPage() {
  return (
    <div>
      <h1>User Operations</h1>
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