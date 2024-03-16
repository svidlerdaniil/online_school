import styles from './Lesson.module.scss';
import { Link } from 'react-router-dom';

function Lesson({ startTime, students }) {
  return (
    <div className={styles.lesson}>
      <div className={styles.info}>
        <div className={styles.infoHeader}>
          <b>{startTime}</b>
          <img src="img/info.svg" width={15} height={15} alt="info" />
        </div>
        <table className={styles.lessonTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Класс</th>
              <th>Длительность</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr>
                <td>{student.studentInnerId}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Lesson;
