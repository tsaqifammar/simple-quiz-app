import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Resume() {
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('resume');
    setResumeData(JSON.parse(data));
  }, []);

  return (
    <div>
      <h2>Resume</h2>
      <p>Correct: {resumeData?.correct}</p>
      <p>Incorrect: {resumeData?.wrong}</p>
      <p>Total answered: {resumeData?.correct + resumeData?.wrong}</p>
      <p>Total questions: {resumeData?.total}</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default Resume;
