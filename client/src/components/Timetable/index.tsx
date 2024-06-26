import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Timetable.module.scss';
import axios from 'axios';
import Lesson from '../Lesson';
import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import Modal from 'react-modal';

const Timetable = () => {
  const defaulContextMenuData = {
    teacherInnerId: 1,
    studentInnerId: 1,
    type: 'групповое',
    startTime: '18:30',
    duration: 1,
    isOneTime: false,
  };
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [teachersSubjects, setTeachersSubjects] = useState([]);
  const [isOpen, setOpen] = useState(false); // для контекстного меню
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 }); // для контекстного меню
  const [contextMenuData, setContextMenuData] = useState(defaulContextMenuData);
  const [lessonTypes, setLessonTypes] = useState([]);
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

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
    async function fetchData() {
      getWeekDates();
      const role = await getUserRole();
      if (role === 'преподаватель') {
        setTeachersTimetable();
      }
      if (role === 'менеджер') {
        getTeachers();
        getLessonTypes();
      }
    }
    fetchData();
  }, []); // Получить учителей, когда компонент смонтируется
  const getUserRole = async () => {
    const userString = await localStorage.getItem('user');
    const role = JSON.parse(userString).role.name;
    await setUserRole(role);
    return role;
  };

  const getWeekDates = () => {
    const dates = [];
    const curr = new Date();
    const first = curr.getDate() - curr.getDay() + 1;
    for (let i = 0; i < 7; i++) {
      dates.push(
        new Date(curr.setDate(first + i)).toLocaleString('ru-RU', {
          month: 'numeric',
          day: 'numeric',
        }),
      );
    }
    setWeekDates(dates);
    console.log(dates);
  };

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

  const getLessonTypes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/lessontypes/get', {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      if (response.status === 200) {
        const lessonTypes = response.data.types;
        setLessonTypes(lessonTypes);
      } else {
        const { message } = response.data;
        alert(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTeachersSubjects = async (teacherInnerId) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/users/teacher/getsubjects',
        { teacherInnerId },
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        },
      );
      if (response.status === 200) {
        setTeachersSubjects(response.data.subjects);
        setContextMenuData((prevData) => ({
          ...prevData,
          subject: response.data.subjects[0],
        }));
      } else {
        const { message } = response.data;
        alert(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTeacherClick = async (teacher) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/users/teacher/getlessons',
        {
          teacherInnerId: teacher.teacherInnerId,
        },
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        },
      );
      await setContextMenuData((prevData) => ({
        ...prevData,
        teacherInnerId: teacher.teacherInnerId,
      }));
      setTeacher(teacher);
      getTeachersSubjects(teacher.teacherInnerId);
      setTimetable(response.data.timetable);
    } catch (error) {
      console.error(error);
    }
  };

  const setTeachersTimetable = async () => {
    try {
      const response = await axios.get('http://localhost:4000/users/teacher/thisteacherslessons', {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      setTimetable(response.data.timetable);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setContextMenuData((prevData) => ({ ...prevData, [name]: newValue }));
    console.log(contextMenuData);
  };

  const handleContextMenuClick = (e, dayOfTheWeek, teacher) => {
    if (typeof document.hasFocus === 'function' && !document.hasFocus()) return;

    e.preventDefault();
    setContextMenuData((prevData) => ({
      ...prevData,
      dayOfTheWeek: dayOfTheWeek,
      teacher: teacher,
    }));
    setAnchorPoint({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };
  const createLesson = async () => {
    try {
      console.log('DATA: ', contextMenuData);
      const response = await axios.post('http://localhost:4000/lessons/create', contextMenuData, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      if (response.status === 201) {
        // const updatedTimeTable = students.map((student) => {
        //   if (student.studentInnerId === contextMenuData.studentInnerId) {
        //     return {
        //       ...student,
        //       name: contextMenuData.name,
        //       phoneNumber: contextMenuData.phoneNumber,
        //       parentName: contextMenuData.parentName,
        //       parentPhoneNumber: contextMenuData.parentPhoneNumber,
        //       grade: contextMenuData.grade,
        //       info: contextMenuData.info,
        //     };
        //   } else {
        //     return student;
        //   }
        // });
        // setTimetable(updatedTimeTable);
      } else {
        const { message } = response.data;
        alert(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = async () => {
    await getStudents();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createLesson();
    await handleTeacherClick(contextMenuData.teacher);
    setContextMenuData(defaulContextMenuData);

    closeModal();
  };
  const getStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/roles/students/get', {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      if (response.status === 201) {
        const students = response.data.students;
        const sortedStudents = students.sort((a, b) => {
          return a.studentInnerId - b.studentInnerId;
        });

        setStudents(sortedStudents);
      } else {
        const { message } = response.data;
        alert(message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  function compare_teachers(a, b) {
    if (a.teacherInnerId < b.teacherInnerId) {
      return -1;
    }
    if (a.teacherInnerId > b.teacherInnerId) {
      return 1;
    }
    return 0;
  }

  return (
    <>
      <h2>Расписание</h2>
      <div className={styles.timetable}>
        {userRole === 'менеджер' && (
          <div className={styles.teachersList}>
            <h3>Учителя</h3>
            <ul>
              {teachers.sort(compare_teachers).map((teacher) => (
                <li
                  className={styles.teacherName}
                  key={teacher.teacherInnerId}
                  onClick={() => handleTeacherClick(teacher)}>
                  {teacher.teacherInnerId} {teacher.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={styles.daysOfTheWeek}>
          {timetable.map((dayOfTheWeek, i) => (
            <div className={styles.dayOfTheWeek}>
              <b>
                {weekDates[i]} {daysNames[i]}
              </b>
              <div
                className={styles.dayOfTheWeekLessons}
                onContextMenu={
                  userRole === 'менеджер' && ((e) => handleContextMenuClick(e, i + 1, teacher))
                }>
                {dayOfTheWeek.lessons.length > 0 ? (
                  dayOfTheWeek.lessons.map((lesson) => (
                    <Lesson startTime={lesson.starttime} students={lesson.students} />
                  ))
                ) : (
                  <p>Занятий нет</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {userRole === 'менеджер' && (
        <>
          <ControlledMenu
            anchorPoint={anchorPoint}
            state={isOpen ? 'open' : 'closed'}
            direction="right"
            onClose={() => setOpen(false)}>
            <MenuItem onClick={openModal}>Добавить занятие</MenuItem>
            <MenuItem>Редактировать</MenuItem>
          </ControlledMenu>
          {contextMenuData.teacher && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Добавить занятие"
              style={{
                overlay: {
                  backgroundColor: 'rgba(200, 200, 200, 0.4)',
                },
                content: {
                  position: 'absolute',
                  top: '8%',
                  left: '32%',
                  right: '32%',
                  bottom: '8%',
                  border: '1px solid #ccc',
                  background: '#fff',
                  overflow: 'auto',
                  borderRadius: '15px',
                  outline: 'none',
                  padding: '20px',
                },
              }}>
              <div className={styles.editStudentWrapper}>
                <img
                  src="img/close.svg"
                  onClick={closeModal}
                  height={15}
                  width={15}
                  style={{ alignSelf: 'end', cursor: 'pointer' }}
                />
                <h2>
                  Добавить занятие (ID{teacher.teacherInnerId} {teacher.name})
                </h2>
                <p></p>
                <form className={styles.addLessonForm} onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <label>Ученик</label>
                    {/* <input
                      type="text"
                      name="studentInnerId"
                      value={contextMenuData.studentInnerId}
                      onChange={handleChange}
                    /> */}
                    <select
                      className={styles.dropDown}
                      name="studentInnerId"
                      onChange={handleChange}>
                      {students.map((student) => (
                        <option key={student.studentInnerId} value={student.studentInnerId}>
                          {student.studentInnerId}. {student.name} ({student.grade} кл.)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formRow}>
                    <label>Тип</label>
                    <select
                      className={styles.dropDown}
                      name="type"
                      value={contextMenuData.type}
                      onChange={handleChange}>
                      {lessonTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formRow}>
                    <label>Предмет</label>
                    <select
                      className={styles.dropDown}
                      name="subject"
                      value={contextMenuData.subject}
                      onChange={handleChange}>
                      {teachersSubjects.map((subject) => (
                        <option key={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formRow}>
                    <label>Время начала</label>
                    <input
                      type="text"
                      name="startTime"
                      value={contextMenuData.startTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label>Длительность</label>
                    <select
                      className={styles.dropDown}
                      name="duration"
                      value={contextMenuData.duration}
                      onChange={handleChange}>
                      <option value={1}>1ч</option>
                      <option value={1.5}>1,5ч</option>
                    </select>
                  </div>
                  <div className={styles.formRow}>
                    <label>День недели</label>
                    <select
                      className={styles.dropDown}
                      name="dayOfTheWeek"
                      value={contextMenuData.dayOfTheWeek}
                      onChange={handleChange}>
                      {daysNames.map((day, i) => (
                        <option key={day} value={i + 1}>
                          {day.toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formRow}>
                    <label>Комментарий</label>
                    <input
                      type="text"
                      name="info"
                      value={contextMenuData.info}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label>Разовое</label>
                    <input
                      type="checkbox"
                      name="isOneTime"
                      checked={contextMenuData.isOneTime}
                      onChange={handleChange}
                      className={styles.checkBox}
                    />
                  </div>
                  <button type="submit">Сохранить</button>
                </form>
              </div>
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default Timetable;
