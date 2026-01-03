import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSimilarBooks } from '../../services/api';
import './SimilarBooks.css';

function SimilarBooks({ currentBook }) {
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSimilarBooks = async () => {
      try {
        if (!currentBook || !currentBook.id) {
          console.log('⚠️ SimilarBooks: currentBook não tem ID');
          setLoading(false);
          return;
        }

        console.log(`🔍 SimilarBooks: buscando similares para livro ID:`, currentBook.id);
        console.log(`🔍 Livro atual:`, currentBook.title);

        const similar = await getSimilarBooks(currentBook.id);
        setSimilarBooks(similar);
      } catch (error) {
        console.error('❌ Erro ao carregar livros similares:', error);
        setError('Não foi possível carregar livros similares');
      } finally {
        setLoading(false);
      }
    };

    loadSimilarBooks();
  }, [currentBook]); // Dependência: currentBook

  if (loading) {
    return (
      <div className="similar-books-loading">
        <p>A carregar livros similares...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="similar-books-error">
        <p>{error}</p>
      </div>
    );
  }

  if (similarBooks.length === 0) {
    return null; // Não mostrar se não houver similares
  }

  return (
    <div className="similar-books">
      <h3>📚 Livros Similares</h3>
      <p className="similar-books-subtitle">Outros livros que poderá gostar</p>

      <div className="similar-books-grid">
        {similarBooks.map((book) => (
          <Link to={`/book/${book.id}`} key={book.id} className="similar-book-card">
            <div className="similar-book-cover">
              <img
                src={book.image || 'https://via.placeholder.com/100x150/cccccc/ffffff?text=No+Img'}
                alt={book.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x150/cccccc/ffffff?text=No+Img';
                }}
              />
            </div>
            <div className="similar-book-info">
              <h4 className="similar-book-title">{book.title}</h4>
              <p className="similar-book-author">{book.author}</p>
              <span className="similar-book-genre">{book.genre}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SimilarBooks;