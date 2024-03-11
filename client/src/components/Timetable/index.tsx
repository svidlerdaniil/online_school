import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Timetable.module.scss';
import axios from 'axios';

const Timetable = () => {
  const [teachers, setTeachers] = useState([]);
  const [lessons, setLessons] = useState([]);
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
        console.log(response.data.teachers);
      } else {
        const { message } = response.data;
        alert(message); // Handle error messages appropriately
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTeacherClick = async (teacherInnerId) => {
    try {
      console.log(teacherInnerId);
      const response = await axios.post(
        'http://localhost:4000/users/teacher/getlessons',
        {
          teacherInnerId: teacherInnerId,
        },
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        },
      );
      setLessons(response.data.lessons);
      console.log(lessons);
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  };

  return (
    <>
      <h2>Расписание</h2>
      <div className={styles.timetable}>
        <div className={styles.teachersList}>
          <h3>Учителя</h3>
          <ul>
            {teachers.map((teacher) => (
              <li
                className={styles.teacherName}
                key={teacher.teacherInnerId}
                onClick={() => handleTeacherClick(teacher.teacherInnerId)}>
                {teacher.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="lessons">
          <h3>Занятия</h3>
          <ol>
            {lessons.map((lesson) => (
              <li>
                День недели: {lesson.dayOfTheWeek} <br />
                Длительность: {lesson.duration}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default Timetable;
