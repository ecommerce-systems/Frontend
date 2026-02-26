import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/users/me');
        setUser(response.data);
      } catch (err) {
        setError('사용자 프로필을 가져오는데 실패했습니다. 로그인이 필요합니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>프로필 불러오는 중...</p>;
  if (error) return <p style={{ color: 'var(--error-color)', padding: '1rem', background: '#fef2f2', borderRadius: '8px' }}>{error}</p>;

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>내 프로필 정보</h3>
      {user ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span style={{ width: '100px', fontWeight: 600, color: 'var(--text-muted)' }}>아이디</span>
            <span>{user.username}</span>
          </div>
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span style={{ width: '100px', fontWeight: 600, color: 'var(--text-muted)' }}>이름</span>
            <span>{user.name}</span>
          </div>
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span style={{ width: '100px', fontWeight: 600, color: 'var(--text-muted)' }}>전화번호</span>
            <span>{user.phone}</span>
          </div>
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span style={{ width: '100px', fontWeight: 600, color: 'var(--text-muted)' }}>주소</span>
            <span>{user.address}</span>
          </div>
        </div>
      ) : (
        <p>사용자 정보를 찾을 수 없습니다.</p>
      )}
    </div>
  );
}

export default UserProfile;
