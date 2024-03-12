import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents();
  }, []);

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
          // Assuming studentInnerId is a number
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

  return (
    <div className="studentsList">
      <table className="studentsTable">
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
            <tr key={student.studentInnerId}>
              <td>{student.studentInnerId}</td>
              <td>{student.name}</td>
              <td>{student.phoneNumber}</td>
              <td>{student.parentName}</td>
              <td>{student.parentPhoneNumber}</td>
              <td>{student.grade}</td>
              <td>{student.info}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
