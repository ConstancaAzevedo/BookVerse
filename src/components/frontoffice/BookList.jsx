import { useState, useEffect } from 'react';
import { bookApi } from '../../services/api';
import BookCard from '../common/BookCard';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import './BookList.css';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalBooks, setTotalBooks] = useState(0);
  const [sortBy, setSortBy] = useState('title-asc');

  const booksPerPage = 6;

  useEffect(() => {
    loadBooks();
  }, [currentPage, searchTerm]);


  const sortedBooks = [...books].sort((a, b) => {
    const titleA = String(a?.title || '').toLowerCase();
    const titleB = String(b?.title || '').toLowerCase();
    const yearA = Number(a?.year) || 0;
    const yearB = Number(b?.year) || 0;
    const ratingA = Number(a?.rating) || 0;
    const ratingB = Number(b?.rating) || 0;

    switch (sortBy) {
      case 'title-asc': return titleA.localeCompare(titleB);
      case 'title-desc': return titleB.localeCompare(titleA);
      case 'year-desc': return yearB - yearA;
      case 'year-asc': return yearA - yearB;
      case 'rating-desc': return ratingB - ratingA;
      default: return 0;
    }
  });


  const paginatedBooks = sortedBooks; 

  const loadBooks = async () => {
    try {
      console.log('🔄 [BookList DEBUG] Iniciando loadBooks...');

      setLoading(true);
      setError(null);

      const result = await bookApi.getBooks(
        currentPage,
        booksPerPage,
        searchTerm
      );

      console.log('✅ BookList: Livros recebidos:', result.data.length);
      setBooks(result.data);


      if (searchTerm) {
        setTotalPages(1);
        setTotalBooks(result.data.length);
      } else {
        setTotalPages(result.totalPages);
        setTotalBooks(result.total);
      }

    } catch (error) {
      console.error('Erro capturado:', error);
      setError("Erro ao carregar livros. Verifique se a API está em execução.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    setCurrentPage(1);

    if (!term.trim()) {
      loadBooks();
      return;
    }
    loadBooks();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="book-list-container" id="catalogo">
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

        <div className="sort-container">
          <label htmlFor="sort-select" className="sort-label">
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="title-asc">Título (A-Z)</option>
            <option value="title-desc">Título (Z-A)</option>
            <option value="year-desc">Ano (Mais Recente)</option>
            <option value="year-asc">Ano (Mais Antigo)</option>
            <option value="rating-desc">Melhor Avaliado</option>
          </select>
        </div>
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
            {paginatedBooks.map((book) => (
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
          Mostrando {paginatedBooks.length} de {totalBooks} livros
          {searchTerm && ` para "${searchTerm}"`}
        </p>
      </div>
    </div>
  );
}

export default BookList;