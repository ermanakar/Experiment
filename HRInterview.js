import React, { useState } from 'react';
import './HRInterview.css';
import { Link } from 'react-router-dom';

function HRInterview() {
  const [step, setStep] = useState(1);
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      const data = {
        job_title: jobTitle,
        skills: skills,
        experience: experience,
        company: companyName,
      };

      try {
        const response = await fetch('https://api.shopofluba.de/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }

        const questionsResponse = await response.json();
        const questionArray = questionsResponse.questions.split('\n');
        setQuestions(questionArray.filter(question => question.trim() !== ''));
        setStep(step + 1);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setJobTitle('');
    setSkills('');
    setExperience('');
    setCompanyName('');
    setQuestions(null);
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label>Enter the Job Title:</label>
            <input
              type="text"
              placeholder="e.g., Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <label>Enter the Key Skills:</label>
            <input
              type="text"
              placeholder="e.g., JavaScript, React, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
          </>
        );
      case 3:
        return (
          <>
            <label>Enter the Total Years of Experience:</label>
            <input
              type="text"
              placeholder="e.g., 5"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />
            <label>Enter the Name of the Most Recent Employer:</label>
            <input
              type="text"
              placeholder="e.g., ABC Corp."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </>
        );
      case 4:
        return renderQuestions();
      default:
        return null;
    }
  };

  const renderQuestions = () => (
    <>
      <div className="generated-questions">
        <h2>Generated Questions:</h2>
        <ul>
          {questions.map((question, index) => (
            <li key={index} className="generated-question">
              {question}
            </li>
          ))}
        </ul>
      </div>
      <button className="StartOverButton" onClick={handleReset}>
        Start Over
      </button>
    </>
  );

  if (loading) {
    return (
      <div className="HRInterview">
        <div className="Loader"></div>
        <p>Please be patient, your questions are being prepared...</p>
      </div>
    );
  }

  return (
    <div className="HRInterview">
      <Link to="/" className="GoBack">Go Back</Link>
      <h1>HR Interview Questions Generator</h1>
      <form onSubmit={handleSubmit}>
        {renderFormStep()}
        {step < 3 && !loading && 
          <button type="submit" className="SubmitButton">
            Next
          </button>
        }
        {step === 3 && !loading &&
          <button type="submit" className="SubmitButton">
            Generate Questions
          </button>
        }
      </form>
    </div>
  );
}

export default HRInterview;
