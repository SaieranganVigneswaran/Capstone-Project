import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:3000/auth/admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.Status) {
          setAdmin(response.data.Result);
        } else {
          throw new Error(response.data.Error || 'Failed to fetch admin details');
        }
      } catch (err) {
        setError(`Failed to fetch admin details: ${err.message}`);
        console.error('Error fetching admin details:', err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      {admin ? (
        <div className="profile-details">
          <h1>Admin Profile</h1>
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Address:</strong> {admin.address}</p>
          <p><strong>Salary:</strong> ${admin.salary}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <div>No admin details available</div>
      )}
    </div>
  );
};

export default Profile;
