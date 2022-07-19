import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const [lastAttempt, setLastAttempt] = useState(null);
  const [isOnGoing, setIsOnGoing] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      const resume = localStorage.getItem('resume');
      if (resume) setLastAttempt(JSON.parse(resume));

      const onGoingAttempt = localStorage.getItem('quiz');
      if (onGoingAttempt) setIsOnGoing(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className='home'>
      <h1>Welcome to Quiz App!</h1>
      <div className='home__options'>
        <button type="button" onClick={() => navigate('/quiz')}>
          {isOnGoing ? 'Continue Attempt' : 'Start Quiz'}
        </button>
        <button type="button" onClick={logout}>Logout</button>
      </div>
      {lastAttempt && (
        <div>
          <h2>Last attempt:</h2>
          <p>Correct: {lastAttempt.correct}</p>
          <p>Incorrect: {lastAttempt.wrong}</p>
          <p>Total answered: {lastAttempt.correct + lastAttempt.wrong}</p>
          <p>Total questions: {lastAttempt.total}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
