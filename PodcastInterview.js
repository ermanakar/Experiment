import React, { useState } from 'react';
import './PodcastInterview.css';
import { Link } from 'react-router-dom';

function PodcastInterview() {
  const [step, setStep] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [tone, setTone] = useState('');
  const [specificTopic, setSpecificTopic] = useState('');
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < 4) {
      setStep(step + 1);
    } else {
      setLoading(true);
      const data = {
        guest_name: guestName,
        interview_type: interviewType,
        tone: tone,
        specific_topic: specificTopic,
      };

      try {
        const response = await fetch('https://api.shopofluba.de/generate-podcast-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          mode: 'cors', // necessary for cross-origin requests
        });

        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }

        const questionsResponse = await response.json();
        const questionString = questionsResponse.questions;
        const questionArray = questionString.split('\n').filter(question => question.trim() !== '');
        setQuestions(questionArray);
        setStep(step + 1); // Increment step to render questions
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setGuestName('');
    setInterviewType('');
    setTone('');
    setSpecificTopic('');
    setQuestions(null);
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label>Enter the Name of the Guest:</label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <label>Enter the Interview Type:</label>
            <input
              type="text"
              placeholder="e.g., Expert Interview"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              required
            />
          </>
        );
      case 3:
        return (
          <>
            <label>Enter the Tone of the Interview:</label>
            <input
              type="text"
              placeholder="e.g., Casual, Informative"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              required
            />
          </>
        );
      case 4:
        return (
          <>
            <label>Enter the Specific Topic:</label>
            <input
              type="text"
              placeholder="e.g., Technology, Science"
              value={specificTopic}
              onChange={(e) => setSpecificTopic(e.target.value)}
              required
            />
          </>
        );
      case 5:
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
              <span className="question-info">ℹ
                <span className="tooltip-text">Information about the question</span>
              </span>
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
      <div className="PodcastInterview">
        <div className="Loader"></div>
        <p>Please be patient, your questions are being prepared...</p>
      </div>
    );
  }

  return (
    <div className="PodcastInterview">
      <Link to="/" className="GoBack">Go Back</Link>
      <h1>Podcast Interview Questions Generator</h1>
      <form onSubmit={handleSubmit}>
        {renderFormStep()}
        {step < 4 && !loading &&
          <button type="submit" className="SubmitButton">
            Next
          </button>
        }
        {step === 4 && !loading &&
          <button type="submit" className="SubmitButton">
            Generate Questions
          </button>
        }
      </form>
    </div>
  );
}

export default PodcastInterview;
