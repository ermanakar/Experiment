import React, { useState } from 'react';
import './BookSummary.css';

function BookSummary() {
  // Define states
  const [authorName, setAuthorName] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isLoadingBooks, setLoadingBooks] = useState(false);
  const [isLoadingSummary, setLoadingSummary] = useState(false);
  
  // Function to fetch books by a particular author
  const getBooks = async () => {
    setLoadingBooks(true);
    
    try {
      const response = await fetch(`https://api.shopofluba.de/get-books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: authorName }),
        mode: 'cors',
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        setError(data.error || response.statusText);
      } else {
        setBooks(data);
        setSelectedBook(null); // Reset the selected book when fetching new books
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingBooks(false);
    }
  };
  
  
  // Function to fetch book summary by book ID
  const getSummary = async (bookId) => {
    setLoadingSummary(true);
    
    try {
      const response = await fetch(`https://api.shopofluba.de/get-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: bookId }),
        mode: 'cors',
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || response.statusText);
      } else {
        setSummary(data.summary);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Function to handle book click event   
  const handleBookClick = async (book) => {
    setSelectedBook(book);
    await getSummary(book.ID);
  };
  
  return (
    <div className="BookSummary">
      <h1>Book Summary</h1>
      
      <input 
        type="text" 
        value={authorName} 
        onChange={e => setAuthorName(e.target.value)}
        placeholder="Search the name of the book or author"
      />
      
      <button onClick={getBooks}>Get Books</button>
  
      {isLoadingBooks && <p>Loading books...</p>}
      
      {books.map(book => (
        <div key={book.ID} onClick={() => handleBookClick(book)}>
          <h2>{book.Title}</h2>
          {selectedBook && selectedBook.ID === book.ID && (
            <>
              <h3>{selectedBook.Authors}</h3>
              <p>{selectedBook.Description}</p>
            </>
          )}
        </div>
      ))}
      
      {isLoadingSummary && <p>Loading summary...</p>}
      
      <p className="summary">{summary}</p>
      
      {error && <p className="error">{error}</p>}

      <button onClick={() => {setAuthorName(''); setBooks([]); setSummary(''); setError(''); setSelectedBook(null);}}>Start Over</button>
    </div>
  );
}
  
export default BookSummary;