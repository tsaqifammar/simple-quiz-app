import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import shuffle from '../utils/shuffle';
import { formatQuestion } from '../utils/format';

const QUIZ_API_URL = 'https://opentdb.com/api.php?amount=10&difficulty=easy';

function Quiz() {
  const navigate = useNavigate();
  // page information
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // quiz information
  const [questionNum, setQuestionNum] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    async function getQuestions() {
      try {
        const response = await fetch(QUIZ_API_URL);
        const json = await response.json();
        const data = await json.results.map((q) => ({
          ...q,
          answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
        }));
        console.log(data);
        setQuestions(data);
      } catch (error) {
        setError(true);
      }
      setIsLoading(false);
    }
    getQuestions();
  }, []);

  function calculateResume() {
    let correct = 0;
    let wrong = 0;
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].correct_answer) {
        correct += 1;
      } else {
        wrong += 1;
      }
    }
    localStorage.setItem('resume', JSON.stringify({ correct, wrong }));
  }

  function answer(a) {
    setUserAnswers((prev) => [...prev, a]);
    if (questionNum === questions.length - 1) {
      calculateResume();
      navigate('/resume');
    } else {
      setQuestionNum((prev) => prev + 1);
    }
  }

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <h1>An error happened. Try restarting the page.</h1>
      ) : (
        <div>
          <div className="quiz__header">
            <span>{`${questionNum + 1}/${questions.length}`}</span>
            <span>04:02</span>
          </div>
          <h3>{formatQuestion(questions[questionNum].question)}</h3>
          {questions[questionNum].answers.map((a, idx) => (
            <button key={idx} onClick={() => answer(a)}>
              {a}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default Quiz;
