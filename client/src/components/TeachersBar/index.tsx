import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeachersBar = () => {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTeachers();
  }, []); // Fetch teachers when the component mounts

  const getTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/roles/teacher/get', {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      if (response.status === 201) {
        setTeachers(response.data.teachers);
      } else {
        const { message } = response.data;
        alert(message); // Handle error messages appropriately
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTeacherClick = (teacherId) => {
    // Handle the click event, for example, navigate to the teacher's profile
    navigate(`/teacher/${teacherId}`);
  };

  return (
    <div>
      <h3>Teachers</h3>
      <ul>
        {teachers.map((teacher) => (
          <li key={teacher.id} onClick={() => handleTeacherClick(teacher.id)}>
            {teacher.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeachersBar;
