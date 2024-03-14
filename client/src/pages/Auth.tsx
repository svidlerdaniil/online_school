import { React, useEffect } from 'react';
import Login from '../components/Login';
import { useNavigate } from 'react-router';

function Auth() {
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
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };
    fetchUserData();
  });
  return (
    <>
      <Login />
    </>
  );
}

export default Auth;
