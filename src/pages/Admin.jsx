import { useState, useEffect } from 'react';
import { bookApi } from '../services/api';
import BookTable from '../components/admin/BookTable';
import BookFormModal from '../components/admin/BookFormModal';
import './Admin.css';

function Admin() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      console.log('Admin: Carregando TODOS os livros...');
      setLoading(true);
      setError(null);

      const result = await bookApi.getAllBooksForAdmin();

      console.log('Admin: Total de livros:', result.data.length);
      setBooks(result.data);

    } catch (error) {
      console.error('Admin: Erro:', error);
      setError("Erro ao carregar livros para administração.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (bookData) => {
    try {
      const tempId = 'temp_' + Date.now();
      const newBook = { ...bookData, id: tempId };


      setBooks(prev => [newBook, ...prev]);

      const createdBook = await bookApi.createBook(bookData);

      setBooks(prev => prev.map(book =>
        book.id === tempId ? createdBook : book
      ));

      return createdBook;
    } catch (error) {

      setBooks(prev => prev.filter(book => !book.id.startsWith('temp_')));
      throw error;
    }
  };

  const handleUpdateBook = async (bookData) => {
    try {
      if (!editingBook) return;


      setBooks(prev => prev.map(book =>
        book.id === editingBook.id ? { ...book, ...bookData } : book
      ));


      await bookApi.updateBook(editingBook.id, bookData);

      return true;
    } catch (error) {

      loadBooks();
      throw error;
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      setBooks(prev => prev.filter(book => book.id !== id));


      await bookApi.deleteBook(id);

      return true;
    } catch (error) {
      loadBooks();
      throw error;
    }
  };


  const handleAddClick = () => {
    setEditingBook(null);
    setShowAddModal(true);
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setShowAddModal(true);
  };

  const handleDeleteClick = (id) => {
    setBookToDelete(id);
  };

  const handleFormSubmit = async (bookData) => {
    if (editingBook) {
      await handleUpdateBook(bookData);
    } else {
      await handleCreateBook(bookData);
    }
    setShowAddModal(false);
    setEditingBook(null);
  };


  const confirmDelete = async () => {
    if (bookToDelete) {
      await handleDeleteBook(bookToDelete);
      setBookToDelete(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="hero-section admin-hero">
        <div className="hero-content">
          <h1>BookVerse Admin Panel</h1>
          <p className="admin-subtitle">Gestão do catálogo de livros</p>
        </div>
      </div>

      <div className="admin-content">
        <div className="action-bar">
          <div className="action-bar-left">
            <h2>Gestão de Livros</h2>
            <p className="action-bar-info">
              {books.length} livros no catálogo
            </p>
          </div>
          <div className="action-bar-right">
            <button
              onClick={() => loadBooks()}
              className="action-btn refresh-btn"
              disabled={loading}
            >
              Atualizar
            </button>
            <button
              onClick={handleAddClick}
              className="action-btn add-btn"
            >
              Adicionar Livro
            </button>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            <p>{error}</p>
          </div>
        )}

        <BookTable
          books={books}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          isLoading={loading}
        />

        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">Total Livros</span>
            <span className="stat-value">{books.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Autores Únicos</span>
            <span className="stat-value">
              {new Set(books.map(b => b.author)).size}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Géneros</span>
            <span className="stat-value">
              {new Set(books.map(b => b.genre)).size}
            </span>
          </div>
        </div>
      </div>

      <BookFormModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingBook(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingBook}
        isEditing={!!editingBook}
      />



      {bookToDelete && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Confirmar Eliminação</h3>
            <p>Tem a certeza que deseja eliminar este livro?</p>
            <p className="warning-text">Esta ação não pode ser desfeita.</p>
            <div className="confirm-buttons">
              <button onClick={() => setBookToDelete(null)} className="cancel-btn">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="confirm-delete-btn">
                Sim, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;