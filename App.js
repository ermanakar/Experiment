import React from 'react';
import './App.css';
import Home from './Home';
import HRInterview from './HRInterview'; // Assuming you have an HRInterview.js file
import PRDCreator from './PRDCreator'; // Import the PRDCreator.js file
import BookSummary from './BookSummary'; // Import the BookSummary.js file
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlockContext from './BlockContext';

function App() {
  const isBlocked = false; // Control the block from here

  function BlockScreen() {
    return (
        <div className="blockScreen">
            <h2>Hello 👋</h2>
            <p>I've reached my hard cap on OpenAI API, you can buy me <a href="https://revolut.me/radyokafa" target="_blank" rel="noreferrer">☕️</a> to make this stay longer</p>
        </div>
    );
}

  return (
    <BlockContext.Provider value={isBlocked}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={isBlocked ? <BlockScreen /> : <Home />} />
            <Route path="/hr-interview" element={isBlocked ? <BlockScreen /> : <HRInterview />} />
            <Route path="/prd-creator" element={isBlocked ? <BlockScreen /> : <PRDCreator />} /> {/* New route for PRDCreator */}
            <Route path="/book-summary" element={isBlocked ? <BlockScreen /> : <BookSummary />} /> {/* New route for BookSummary */}
            {/* Add other routes here */}
          </Routes>
        </div>
      </Router>
    </BlockContext.Provider>
  );
}

export default App;
