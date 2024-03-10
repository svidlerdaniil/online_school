import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      console.log(loginData);
      const response = await axios.post('http://localhost:4000/auth/login', loginData);

      if (response.status === 200) {
        const { user, token } = response.data;
        console.log(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        // Redirect to the welcome page after successful login
        navigate('account');
      } else {
        const { message } = response.data;
        alert(message); // Handle error messages appropriately
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>
          Login:
          <input type="text" name="login" value={loginData.login} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
