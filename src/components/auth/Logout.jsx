import React, { useState } from 'react';
import axiosInstance, { setAccessToken } from '../../api';

function Logout() {
  const [result, setResult] = useState('');

  const handleLogout = async () => {
    setResult('');
    try {
      await axiosInstance.post('/api/v2/auth/logout');
      setAccessToken(null);
      setResult('<p>👋 Logout successful</p>');
    } catch (error) {
      setResult(`<p>❌ Logout failed: ${error.response?.data?.message || error.message}</p>`);
    }
  };

  return (
    <div>
      <h2>Log Out</h2>
      <button onClick={handleLogout}>Log Out</button>
      <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default Logout;
