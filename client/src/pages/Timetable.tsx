import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeachersBar from '../components/TeachersBar';

const Timetable = () => {
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

  return (
    <>
      <TeachersBar />
    </>
  );
};

export default Timetable;
