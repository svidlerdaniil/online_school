import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import Modal from 'react-modal';
import styles from './Students.module.scss';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isOpen, setOpen] = useState(false); // для контекстного меню
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 }); // для контекстного меню
  const [contextMenuData, setContextMenuData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    getStudents();
  }, []);
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    async function fetchData() {
      const role = await getUserRole();
      if (role === 'преподаватель') {
        getThisTeachersStudents();
      }
      if (role === 'менеджер') {
        getStudents();
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

  const getThisTeachersStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/users/teacher/thisteachersstudents', {
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContextMenuData({ ...contextMenuData, [name]: value });
  };

  const handleContextMenuClick = (e, student) => {
    if (typeof document.hasFocus === 'function' && !document.hasFocus()) return;

    e.preventDefault();
    setContextMenuData(student);
    setAnchorPoint({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    saveStudent(contextMenuData);
    setContextMenuData(null);
    closeModal();
  };

  const saveStudent = async (contextMenuData) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/users/student/edit',
        contextMenuData,
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        },
      );
      console.log(response);
      if (response.status === 201) {
        const updatedStudents = students.map((student) => {
          if (student.studentInnerId === contextMenuData.studentInnerId) {
            return {
              ...student,
              name: contextMenuData.name,
              phoneNumber: contextMenuData.phoneNumber,
              parentName: contextMenuData.parentName,
              parentPhoneNumber: contextMenuData.parentPhoneNumber,
              grade: contextMenuData.grade,
              info: contextMenuData.info,
            };
          } else {
            return student;
          }
        });
        setStudents(updatedStudents);
      } else {
        const { message } = response.data;
        alert(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="studentsList">
      <table className={styles.studentsTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ученик</th>
            <th>Телефон ученика</th>
            <th>Родитель</th>
            <th>Телефон родителя</th>
            <th>Класс</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              className={styles.studentRow}
              key={student.studentInnerId}
              onContextMenu={(e) => handleContextMenuClick(e, student)}>
              <td>{student.studentInnerId}</td>
              <td>{student.name}</td>
              <td>+{student.phoneNumber}</td>
              <td>{student.parentName}</td>
              <td>+{student.parentPhoneNumber}</td>
              <td>{student.grade}</td>
              <td>{student.info}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ControlledMenu
        anchorPoint={anchorPoint}
        state={isOpen ? 'open' : 'closed'}
        direction="right"
        onClose={() => setOpen(false)}>
        <MenuItem onClick={openModal}>Редактировать</MenuItem>
      </ControlledMenu>
      {contextMenuData && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Редактировать ученика"
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
              style={{ alignSelf: 'end', cursor: 'pointer' }}></img>
            <h2>Редактировать ID {contextMenuData.studentInnerId}</h2>
            <form className={styles.editStudentForm} onSubmit={handleSubmit}>
              <div className={styles.editStudentFormRow}>
                <label>Имя</label>
                <input
                  type="text"
                  name="name"
                  value={contextMenuData.name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.editStudentFormRow}>
                <label>Телефон ученика</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={contextMenuData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.editStudentFormRow}>
                <label>Родитель</label>
                <input
                  type="text"
                  name="parentName"
                  value={contextMenuData.parentName}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.editStudentFormRow}>
                <label>Телефон родителя</label>
                <input
                  type="text"
                  name="parentPhoneNumber"
                  value={contextMenuData.parentPhoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.editStudentFormRow}>
                <label>Класс</label>
                <input
                  type="text"
                  name="grade"
                  value={contextMenuData.grade}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.editStudentFormRow}>
                <label>Комментарий</label>
                <input
                  type="text"
                  name="info"
                  value={contextMenuData.info}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Сохранить</button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Students;
