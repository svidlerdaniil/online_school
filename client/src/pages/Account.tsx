import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Introduce loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await localStorage.getItem('token');

        if (!token) {
          // Redirect to the login page if no token is found
          navigate('/');
          return;
        }

        const userString = await localStorage.getItem('user');
        if (!userString) {
          // Redirect to the login page if no user data is found
          navigate('/');
          return;
        }

        const userObject = JSON.parse(userString);
        setUserData(userObject);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Set loading to false once the data is processed
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Clear the token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to the login page after logout
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome</h2>
      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <>
          <p>Hello, {userData.login}!</p>
          <p>Your role is: {userData.role.name}</p>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <p>User data not found. Please log in again.</p>
      )}
    </div>
  );
};

export default Account;
