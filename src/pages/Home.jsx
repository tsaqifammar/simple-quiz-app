import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const [lastAttempt, setLastAttempt] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      const resume = localStorage.getItem('resume');
      if (resume) setLastAttempt(JSON.parse(resume));
    }
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
      {lastAttempt && (
        <div>
          <h2>Last attempt:</h2>
          <p>Correct: {lastAttempt.correct}</p>
          <p>Incorrect: {lastAttempt.wrong}</p>
          <p>Total answered: {lastAttempt.correct + lastAttempt.wrong}</p>
          <p>Total questions: {lastAttempt.total}</p>
        </div>
      )}
    </>
  );
}

export default Home;
