import React from 'react';
import './App.css';
import Home from './Home';
import HRInterview from './HRInterview'; // Assuming you have an HRInterview.js file
import PodcastInterview from './PodcastInterview'; // Assuming you have a PodcastInterview.js file
import PRDCreator from './PRDCreator'; // Import the PRDCreator.js file
import BookSummary from './BookSummary'; // Import the BookSummary.js file
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlockContext from './BlockContext';

function App() {
  const isBlocked = true; // Control the block from here

  function BlockScreen() {
    return (
        <div className="blockScreen">
            <h2>Hello 👋</h2>
            <p>I've reached my hard cap on OpenAI API, you can 
            <a href="https://www.buymeacoffee.com/YourPage" target="_blank" rel="noreferrer">buy me coffee here</a> 
            to make this stay longer</p>
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
            <Route path="/live-podcast" element={isBlocked ? <BlockScreen /> : <PodcastInterview />} />
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
