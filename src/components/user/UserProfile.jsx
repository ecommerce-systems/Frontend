import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance.get('/api/v1/users/me')
      .then(res => setUser(res.data))
      .catch(() => setError('프로필을 불러오지 못했습니다. 로그인이 필요합니다.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-state" style={{ padding: '2rem' }}>
      <div className="spinner" />
    </div>
  );

  if (error) return <div className="error-box">⚠️ {error}</div>;
  if (!user)  return null;

  const initial = (user.name || user.username || '?')[0].toUpperCase();

  const rows = [
    { label: '아이디',   value: user.username },
    { label: '이름',     value: user.name },
    { label: '전화번호', value: user.phone },
    { label: '주소',     value: user.address },
  ];

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>내 프로필</h3>

      <div className="profile-header">
        <div className="profile-avatar">{initial}</div>
        <div className="profile-header-info">
          <div className="profile-username">{user.name}</div>
          <div className="profile-handle">@{user.username}</div>
        </div>
        <span className="badge badge-success">활성</span>
      </div>

      <div className="profile-rows">
        {rows.map(({ label, value }) => (
          <div key={label} className="profile-row">
            <span className="profile-label">{label}</span>
            <span className="profile-value">{value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;
