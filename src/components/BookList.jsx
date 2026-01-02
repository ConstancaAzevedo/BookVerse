import { useState, useEffect } from 'react';
import { bookApi } from '../services/api';
import BookCard from './BookCard';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import './BookList.css';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalBooks, setTotalBooks] = useState(0);
  
  const booksPerPage = 6;

  useEffect(() => {
    loadBooks();
  }, [currentPage, searchTerm]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await bookApi.getBooks(
        searchTerm ? 1 : currentPage,
        booksPerPage, 
        searchTerm
      );
      
      setBooks(result.data);
      
      if (searchTerm) {
        setTotalPages(1);
        setTotalBooks(result.data.length);
      } else {
        setTotalPages(result.totalPages);
        setTotalBooks(result.total);
      }
      
    } catch (err) {
      setError("Erro ao carregar livros. Verifique se a API está em execução.");
      console.error("Erro na API:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="book-list-container">
      <header className="list-header">
        <h1>📚 Catálogo de Livros</h1>
        <p className="subtitle">
          {searchTerm 
            ? `Resultados da pesquisa (${books.length} encontrados)`
            : `Descobrir nossa coleção (${totalBooks} livros)`}
        </p>
      </header>

      <div className="search-section">
        <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>A carregar livros...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={loadBooks} className="retry-btn">
            Tentar Novamente
          </button>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <p className="empty-message">
            {searchTerm 
              ? `Nenhum livro encontrado para "${searchTerm}"`
              : "Nenhum livro disponível no momento."}
          </p>
          {searchTerm && (
            <button 
              onClick={() => handleSearch("")} 
              className="clear-search-btn"
            >
              Ver todos os livros
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="books-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          {!searchTerm && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
      
      <div className="stats-footer">
        <p>
          Mostrando {books.length} de {totalBooks} livros
          {searchTerm && ` para "${searchTerm}"`}
        </p>
      </div>
    </div>
  );
}

export default BookList;