import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.scss';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [activeButton, setActiveButton] = useState('login');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/auth/login', loginData);

      if (response.status === 200) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        // Redirect to the welcome page after successful login
        navigate('account');
      } else {
        const { message } = response.data;
        alert(message); // Handle error messages appropriately
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        {errorMessage && (
          <div className={styles.errorMessage}>
            <p>{errorMessage}</p>
          </div>
        )}
        <form>
          <div className={styles.authButtons}>
            <div
              className={`${styles.authButton} ${activeButton === 'login' && styles.activeButton}`}
              onClick={() => setActiveButton('login')}>
              Вход
            </div>
            <div
              className={`${styles.authButton} ${activeButton === 'signup' && styles.activeButton}`}
              onClick={() => {
                setActiveButton('signup');
              }}>
              Регистрация
            </div>
          </div>
          {activeButton === 'login' ? (
            <div className={styles.formRows}>
              <div className={styles.formRow}>
                <label htmlFor="login">Логин</label>
                <input
                  type="text"
                  name="login"
                  value={loginData.login}
                  onChange={handleInputChange}
                  id="login"
                />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  id="password"
                />
              </div>
              <button type="button" onClick={handleLogin}>
                Войти
              </button>
            </div>
          ) : (
            <div className={styles.formRows}>
              <div className={styles.formRow}>
                <label htmlFor="login">Логин</label>
                <input
                  type="text"
                  name="login"
                  value={loginData.login}
                  onChange={handleInputChange}
                  id="login"
                />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  id="password"
                />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="parentName">Имя родителя</label>
                <input
                  type="text"
                  name="parentName"
                  value={loginData.parentName}
                  onChange={handleInputChange}
                  id="parentName"
                />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="parentNumber">Номер родителя</label>
                <input
                  type="text"
                  name="parentNumber"
                  value={loginData.parentNumber}
                  onChange={handleInputChange}
                  id="parentNumber"
                />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="childName">Имя ребенка</label>
                <input
                  type="text"
                  name="childName"
                  value={loginData.childName}
                  onChange={handleInputChange}
                  id="childName"
                />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="childNumber">Номер ребёнка</label>
                <input
                  type="text"
                  name="childNumber"
                  value={loginData.childNumber}
                  onChange={handleInputChange}
                  id="childNumber"
                />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="grade">Класс</label>
                <input
                  type="text"
                  name="grade"
                  value={loginData.grade}
                  onChange={handleInputChange}
                  id="grade"
                />
              </div>

              <button type="button" onClick={handleLogin}>
                Зарегистрироваться
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Login;
