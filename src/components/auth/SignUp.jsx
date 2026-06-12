import React, { useState } from 'react';
import axiosInstance from '../../api';

const FIELDS = [
  { key: 'username', label: '아이디',   type: 'text',     placeholder: '사용할 아이디', autoComplete: 'username' },
  { key: 'password', label: '비밀번호', type: 'password', placeholder: '8자 이상 권장', autoComplete: 'new-password' },
  { key: 'name',     label: '이름',     type: 'text',     placeholder: '실명을 입력하세요' },
  { key: 'phone',    label: '전화번호', type: 'tel',      placeholder: '010-0000-0000' },
  { key: 'address',  label: '주소',     type: 'text',     placeholder: '배송받을 주소' },
];

function SignUp() {
  const [form,    setForm]    = useState({ username: '', password: '', name: '', phone: '', address: '' });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      await axiosInstance.post('/api/v2/auth/signup', form);
      setResult({ ok: true, msg: `${form.username}님, 가입을 축하합니다! 로그인 탭에서 로그인하세요.` });
    } catch {
      setResult({ ok: false, msg: '가입에 실패했습니다. 이미 사용 중인 아이디이거나 입력값을 확인해주세요.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="signup-grid">
        {FIELDS.map(({ key, label, type, placeholder, autoComplete }) => (
          <div className="form-group" key={key} style={{ marginBottom: '0.875rem' }}>
            <label>{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={set(key)}
              placeholder={placeholder}
              required
              autoComplete={autoComplete}
            />
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
        {loading ? '가입 처리 중...' : '회원가입 완료'}
      </button>

      {result && (
        <div className={result.ok ? 'success-box' : 'error-box'} style={{ marginTop: '1rem' }}>
          {result.ok ? '✅' : '⚠️'} {result.msg}
        </div>
      )}
    </form>
  );
}

export default SignUp;
