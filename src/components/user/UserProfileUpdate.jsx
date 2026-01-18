import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';

function UserProfileUpdate() {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Optionally fetch current profile data to pre-fill the form
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/users/me');
        setPhone(response.data.phone || '');
        setAddress(response.data.address || '');
      } catch (err) {
        console.error('Failed to fetch current user profile for update form:', err);
      }
    };
    fetchCurrentProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setLoading(true);
    try {
      const response = await axiosInstance.put('/api/v1/users/me', { phone, address });
      setResult(`<p>✅ Profile updated successfully!</p><pre>${JSON.stringify(response.data, null, 2)}</pre>`);
    } catch (error) {
      setResult(`<p style="color: red;">❌ Profile update failed: ${error.response?.data?.message || error.message}</p>`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Update My Profile</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

export default UserProfileUpdate;
