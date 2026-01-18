import React, { useState } from 'react';
import axiosInstance, { setAccessToken } from '../../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    try {
      const res = await axiosInstance.post('/api/v2/auth/login', { username, password });
      const { accessToken } = res.data;
      setAccessToken(accessToken);
      setResult(`<p>✅ Login successful for ${username}</p>`);
    } catch (error) {
      setResult(`<p>❌ Login failed: ${error.response?.data?.message || error.message}</p>`);
    }
  };

  return (
    <div>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Log In</button>
      </form>
      <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default Login;
