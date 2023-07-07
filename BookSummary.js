import React, { useState } from 'react';
import './BookSummary.css';

function BookSummary() {
  const [authorName, setAuthorName] = useState('');
  const [summary, setSummary] = useState('');

  const getSummary = async () => {
    const response = await fetch(`https://api.shopofluba.de/generate-book-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ author_name: authorName }),
    });
    const data = await response.json();
    setSummary(data.summary);
  }

  return (
    <div className="BookSummary">
      <h1>Book Summary</h1>
      <input 
        type="text" 
        value={authorName} 
        onChange={e => setAuthorName(e.target.value)}
        placeholder="Enter author's name"
      />
      <button onClick={getSummary}>Get Summary</button>
      <p>{summary}</p>
    </div>
  );
}

export default BookSummary;
