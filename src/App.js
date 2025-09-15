import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchBooks = async (e) => {
    e.preventDefault();
    setError('');
    setBooks([]);
    if (!query) {
      setError('Please enter a book title');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${query}`);
      const data = await response.json();
      if (data.docs.length === 0) {
        setError('No books found!');
      } else {
        setBooks(data.docs);
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Book Finder</h1>
      <form onSubmit={searchBooks}>
        <input
          type="text"
          placeholder="Enter book title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {books.map((book) => (
        <div key={book.key} className="book-card">
          {book.cover_i ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
              alt={book.title}
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
          <div className="book-info">
            <h3>{book.title}</h3>
            <p>{book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
            <p>First Published: {book.first_publish_year || 'N/A'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
