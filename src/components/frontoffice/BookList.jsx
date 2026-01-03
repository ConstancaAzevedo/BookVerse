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

  const booksPerPage = 6;

  useEffect(() => {
    loadBooks();
  }, [currentPage, searchTerm]);

  const loadBooks = async () => {
    try {
      console.log('🔄 [BookList DEBUG] Iniciando loadBooks...');
      console.log('🔄 [BookList DEBUG] Parâmetros:', {
        page: searchTerm ? 1 : currentPage,
        limit: booksPerPage,
        search: searchTerm
      });

      setLoading(true);
      setError(null);

      console.log('📤 [BookList DEBUG] Chamando bookApi.getBooks()...');
      const result = await bookApi.getBooks(
        searchTerm ? 1 : currentPage,
        booksPerPage,
        searchTerm
      );

      console.log('✅ [BookList DEBUG] Resposta recebida:', result);
      console.log('📊 [BookList DEBUG] Estrutura da resposta:', {
        hasData: !!result.data,
        dataIsArray: Array.isArray(result.data),
        dataLength: result.data ? result.data.length : 0,
        total: result.total,
        totalPages: result.totalPages
      });

      if (result.data && Array.isArray(result.data)) {
        console.log('📚 [BookList DEBUG] Primeiro livro:', result.data[0]);
      }

      setBooks(result.data);

      if (searchTerm) {
        setTotalPages(1);
        setTotalBooks(result.data.length);
      } else {
        setTotalPages(result.totalPages);
        setTotalBooks(result.total);
      }

      console.log('✅ [BookList DEBUG] State atualizado:', {
        booksCount: result.data.length,
        totalBooks: searchTerm ? result.data.length : result.total,
        totalPages: searchTerm ? 1 : result.totalPages
      });

    } catch (error) {
      console.error('❌ [BookList DEBUG] Erro capturado:', error);
      console.error('❌ [BookList DEBUG] Error details:', {
        message: error.message,
        stack: error.stack
      });

      setError("Erro ao carregar livros. Verifique se a API está em execução.");
      console.error("Erro na API:", error);
    } finally {
      setLoading(false);
      console.log('🏁 [BookList DEBUG] Loading finalizado');
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // ← IMPORTANTE: Resetar para página 1 ao pesquisar

    if (!term.trim()) {
      // Se busca vazia, carrega todos
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