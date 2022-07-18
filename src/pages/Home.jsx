import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) navigate('/login');
  }, []);

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <>
      <h1>Welcome to Quiz App!</h1>
      <button type="button" onClick={() => navigate('/quiz')}>
        Start Quiz
      </button>
      <button type="button" onClick={logout} >Logout</button>
    </>
  );
}

export default Home;
