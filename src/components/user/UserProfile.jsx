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
        setError('Failed to fetch user profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>My Profile</h3>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Name: {user.name}</p>
          <p>Phone: {user.phone}</p>
          <p>Address: {user.address}</p>
        </div>
      ) : (
        <p>No user profile found.</p>
      )}
    </div>
  );
}

export default UserProfile;
