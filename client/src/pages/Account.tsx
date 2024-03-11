import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
          navigate('/auth');
          return;
        }

        const userString = await localStorage.getItem('user');
        if (!userString) {
          navigate('/auth');
          return;
        }

        const userObject = JSON.parse(userString);
        setUserData(userObject);
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
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
            Выйти
          </button>
          <Link to={`/timetable`}>
            <p>Расписание</p>
          </Link>
        </>
      ) : (
        <p>User data not found. Please log in again.</p>
      )}
    </div>
  );
};

export default Account;
