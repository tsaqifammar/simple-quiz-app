import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import shuffle from '../utils/shuffle';
import { formatAnswer, formatQuestion } from '../utils/format';

const QUIZ_API_URL = 'https://opentdb.com/api.php?amount=10&difficulty=easy';

function Quiz() {
  const navigate = useNavigate();
  // page information
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // quiz information
  const [questionNum, setQuestionNum] = useState(0);
  const [timer, setTimer] = useState(1);
  const userAnswers = useRef([]);

  // for unmounting
  const intervalId = useRef(null);
  const onBrowserClosed = useRef(() => {});

  function loadQuizInformation(qs, ans, qnum, time) {
    setQuestions(qs);
    userAnswers.current = ans;
    setQuestionNum(qnum);
    setTimer(time);
    intervalId.current = setInterval(() => setTimer((prev) => prev - 1), 1000);
  }

  useEffect(() => {
    async function getQuestions() {
      setIsLoading(true);
      try {
        const response = await fetch(QUIZ_API_URL);
        const json = await response.json();
        const data = await json.results.map((q) => ({
          ...q,
          answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
        }));
        loadQuizInformation(data, [], 0, 30);
      } catch (error) {
        console.log(error);
        setError(true);
      }
      setIsLoading(false);
    }

    const onGoingAttempt = localStorage.getItem('quiz');
    if (onGoingAttempt) {
      const info = JSON.parse(onGoingAttempt);
      loadQuizInformation(
        info.questions,
        info.answers,
        info.questionNum,
        info.time
      );
      setIsLoading(false);
    } else {
      getQuestions();
    }

    return () => {
      if (intervalId) clearInterval(intervalId.current);
    };
  }, []);

  // when timer reaches 0
  useEffect(() => {
    if (timer === -1) calculateResume();
  }, [timer]);

  const saveQuizInfo = (e) => {
    e.preventDefault();
    localStorage.setItem(
      'quiz',
      JSON.stringify({
        questions,
        answers: userAnswers.current,
        time: timer,
        questionNum,
      })
    );
  };

  // resume onGoingAttempt
  useEffect(() => {
    window.removeEventListener('beforeunload', onBrowserClosed.current);
    onBrowserClosed.current = saveQuizInfo;
    window.addEventListener('beforeunload', onBrowserClosed.current);
    return () => {
      window.removeEventListener('beforeunload', onBrowserClosed.current);
    };
  }, [timer, questionNum]);

  function calculateResume() {
    let correct = 0;
    let wrong = 0;
    for (let i = 0; i < userAnswers.current.length; i++) {
      if (userAnswers.current[i] === questions[i].correct_answer) {
        correct += 1;
      } else {
        wrong += 1;
      }
    }
    localStorage.setItem(
      'resume',
      JSON.stringify({ correct, wrong, total: questions.length })
    );
    localStorage.removeItem('quiz');
    navigate('/resume');
  }

  function answer(a) {
    userAnswers.current = [...userAnswers.current, a];
    if (questionNum === questions.length - 1) {
      calculateResume();
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
        <div className="quiz">
          <div className="quiz__header">
            <span>{`${questionNum + 1}/${questions.length}`}</span>
            <span>&#128337; {timer}</span>
          </div>
          <hr />
          <h3>{formatQuestion(questions[questionNum].question)}</h3>
          <div className="quiz__answers">
            {questions[questionNum].answers.map((a) => (
              <button key={a} onClick={() => answer(a)}>
                {formatAnswer(a)}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Quiz;
