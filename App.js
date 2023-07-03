import React from 'react';
import './App.css';
import Home from './Home';
import HRInterview from './HRInterview'; // Assuming you have an HRInterview.js file
import PodcastInterview from './PodcastInterview'; // Assuming you have a PodcastInterview.js file
import PRDCreator from './PRDCreator'; // Import the PRDCreator.js file
import BookSummary from './BookSummary'; // Import the BookSummary.js file
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hr-interview" element={<HRInterview />} />
          <Route path="/live-podcast" element={<PodcastInterview />} />
          <Route path="/prd-creator" element={<PRDCreator />} /> {/* New route for PRDCreator */}
          <Route path="/book-summary" element={<BookSummary />} /> {/* New route for BookSummary */}
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
