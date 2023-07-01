import React, { useState } from 'react';
import './PRDCreator.css';
import { Link } from 'react-router-dom';

function PRDCreator() {
  const [industry, setIndustry] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [activeUsers, setActiveUsers] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [userStory, setUserStory] = useState('');
  const [prd, setPrd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);  // Add state for error messages

  const resetForm = () => {
    setIndustry('');
    setBusinessType('');
    setActiveUsers('');
    setProblemStatement('');
    setUserStory('');
    setPrd(null);
    setErrorMessage(null); // Also reset the error message
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null); // Clear any previous error messages

    const data = {
      industry: industry,
      business_type: businessType,
      active_users: activeUsers,
      problem_statement: problemStatement,
      user_story: userStory,
    };

    try {
      const response = await fetch('https://api.shopofluba.de/generate-prd', {
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

      const prdResponse = await response.json();
      setPrd(prdResponse.prd);
    } catch (error) {
      setErrorMessage(error.message);  // Update error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="PRDCreator">
      <Link to="/" className="GoBack">Go Back</Link>
      <div className="header1">
        <h1>Product Requirements Document</h1>
        <p>An exploration into AI's potential. Just testing some ideas and use cases. Join the experiment!</p>
      </div>
      <div className="mainContent">
        {errorMessage && 
          <div className="ErrorMessage">
            <p>{errorMessage}</p>
          </div>
        }
        <form onSubmit={handleSubmit} className="Form">
        <label>Industry:</label>
              <input
                type="text"
                placeholder="e.g., IT, eCommerce"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="FormField InputSelect"
              />
              <label>Business Type:</label>
              <div className="BusinessTypeButtonGroup FormField">
              <button 
              type="button" 
              className={`BusinessTypeButton ${businessType === "B2B" ? "active" : ""}`} 
              onClick={() => setBusinessType('B2B')}
            >
              <div className="BusinessTypeIcon">
                <i class="fas fa-building"></i> {/* Font Awesome B2B icon */}
              </div>
              <div className="BusinessTypeText">
                B2B
              </div>
            </button>
            <button 
              type="button" 
              className={`BusinessTypeButton ${businessType === "B2C" ? "active" : ""}`} 
              onClick={() => setBusinessType('B2C')}
            >
              <div className="BusinessTypeIcon">
                <i class="fas fa-user"></i> {/* Font Awesome B2C icon */}
              </div>
              <div className="BusinessTypeText">
                B2C
              </div>
            </button>
              </div>
              <label>Monthly Active Users:</label>
              <input
                type="number"
                placeholder="e.g., 5000"
                value={activeUsers}
                onChange={(e) => setActiveUsers(e.target.value)}
                required
                className="FormField InputSelect"
              />
              <label>Problem Statement:</label>
              <textarea
                placeholder="Describe the problem you want to solve"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                required
                className="FormField InputSelect"
              />
              <label>User Story:</label>
              <textarea
                placeholder="Describe the user story"
                value={userStory}
                onChange={(e) => setUserStory(e.target.value)}
                required
                className="FormField InputSelect"
              />
              <button 
                type="submit" 
                className="SubmitButton Button ButtonPrimary" 
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate PRD"}
              </button>
              <button
                type="button"
                className="ResetButton Button"
                onClick={resetForm}
              >
                Reset Form
              </button>
          </form>
        {prd && 
          <div className="ResponseContainer">
            <pre className="Response">{prd}</pre>
            <button className="StartOverButton" onClick={resetForm}>Start Over</button>
            <button className="CopyButton" onClick={copyToClipboard}>Copy to Clipboard</button>
          </div>
        }
      </div>
    </div>
  );
}

export default PRDCreator;
