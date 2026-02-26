import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';

function UserProfileUpdate() {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/users/me');
        setPhone(response.data.phone || '');
        setAddress(response.data.address || '');
      } catch (err) {
        console.error('기존 프로필 정보를 불러오는데 실패했습니다:', err);
      }
    };
    fetchCurrentProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setLoading(true);
    try {
      await axiosInstance.put('/api/v1/users/me', { phone, address });
      setResult(`<p style="color: var(--success-color); font-weight: bold;">✅ 프로필 정보가 성공적으로 수정되었습니다!</p>`);
    } catch (error) {
      setResult(`<p style="color: var(--error-color);">❌ 프로필 수정 실패: 입력 정보를 다시 확인해주세요.</p>`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>내 프로필 수정</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>전화번호</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            style={{ marginBottom: 0 }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>주소</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="상세 주소를 입력하세요"
            style={{ marginBottom: 0 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--primary-color)' }}>
          {loading ? '수정 처리 중...' : '프로필 정보 저장'}
        </button>
      </form>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default UserProfileUpdate;
