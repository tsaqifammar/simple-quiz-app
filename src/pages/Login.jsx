import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const user = { username: 'test', password: 'test123' };

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [formError, setFormError] = useState('');

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormError('');
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const { username, password } = formData;
    if (username === user.username && password === user.password) {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/');
    } else {
      setFormError('Username or password is incorrect');
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Login</h1>
      <label>Username</label>
      <input type="text" name="username" value={formData.username} onChange={onChange} />
      <label>Password</label>
      <input type="password" name="password" value={formData.password} onChange={onChange} />
      {formError && <span>{formError}</span>}
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
