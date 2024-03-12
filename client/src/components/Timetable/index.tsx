import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Timetable.module.scss';
import axios from 'axios';
import Lesson from '../Lesson';

const Timetable = () => {
  const [teachers, setTeachers] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const navigate = useNavigate();

  const daysNames = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
  ];

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
        alert(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTeacherClick = async (teacherInnerId) => {
    try {
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
      setTimetable(response.data.timetable);
    } catch (error) {
      console.error(error);
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
        <div className={styles.daysOfTheWeek}>
          {timetable.map((dayOfTheWeek, i) => (
            <div className="dayOfTheWeek">
              <b>{daysNames[i]}</b>
              {dayOfTheWeek.lessons.length > 0 ? (
                dayOfTheWeek.lessons.map((lesson) => (
                  <Lesson startTime={lesson.starttime} students={lesson.students} />
                ))
              ) : (
                <p>Занятий нет</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Timetable;
