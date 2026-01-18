import React, { useState } from 'react';
import axiosInstance, { setAccessToken } from '../../api';

function RefreshToken() {
  const [result, setResult] = useState('');

  const handleRefresh = async () => {
    setResult('');
    try {
      const res = await axiosInstance.post('/api/v2/auth/refresh');
      const newAccessToken = res.data.accessToken;
      setAccessToken(newAccessToken);
      setResult('<p>🔄 Access token refreshed!</p>');
    } catch (error) {
      setResult(`<p>❌ Failed to refresh token: ${error.response?.data?.message || error.message}</p>`);
    }
  };

  return (
    <div>
      <h2>Refresh Token</h2>
      <button onClick={handleRefresh}>Refresh Token</button>
      <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default RefreshToken;
