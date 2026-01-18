import React, { useState } from 'react';
import axiosInstance from '../../api';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    try {
      const res = await axiosInstance.post('/api/v2/auth/signup', { username, password, name, phone, address });
      setResult(`<p>✅ Signup successful for ${username}</p><pre>${JSON.stringify(res.data, null, 2)}</pre>`);
    } catch (error) {
      setResult(`<p>❌ Signup failed: ${error.response?.data?.message || error.message}</p>`);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required />
        <button type="submit">Sign Up</button>
      </form>
      <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default SignUp;
