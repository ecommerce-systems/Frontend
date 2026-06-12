import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';

function UserProfileUpdate() {
  const [phone,   setPhone]   = useState('');
  const [address, setAddress] = useState('');
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get('/api/v1/users/me')
      .then(res => {
        setPhone(res.data.phone || '');
        setAddress(res.data.address || '');
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      await axiosInstance.put('/api/v1/users/me', { phone, address });
      setResult({ ok: true, msg: '프로필이 성공적으로 수정되었습니다!' });
    } catch {
      setResult({ ok: false, msg: '수정에 실패했습니다. 입력 정보를 확인해주세요.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>프로필 수정</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>전화번호</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
          />
        </div>
        <div className="form-group">
          <label>주소</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="상세 주소를 입력하세요"
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? '저장 중...' : '변경사항 저장'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '1.25rem' }} className={result.ok ? 'success-box' : 'error-box'}>
          {result.ok ? '✅' : '⚠️'} {result.msg}
        </div>
      )}
    </div>
  );
}

export default UserProfileUpdate;
