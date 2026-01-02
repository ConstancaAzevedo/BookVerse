import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookApi } from '../services/api';
import BookTable from '../components/BookTable';
import BookFormModal from '../components/BookFormModal';
import './Admin.css';

function Admin({ onLogout }) { // ⭐ REMOVI: isAuthenticated não é usado
  const navigate = useNavigate();
  
  // States para livros
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States para modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Carregar livros
  useEffect(() => {
    loadBooks();
  }, []);
  
  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookApi.getBooks();
      setBooks(result.data);
    } catch (err) {
      setError('Erro ao carregar livros: ' + err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // CRUD Operations
  const handleCreateBook = async (bookData) => {
    try {
      // ⭐ CORREÇÃO: Definir tempId corretamente
      const tempId = 'temp_' + Date.now(); // ⭐ Adicionar prefixo para evitar conflitos
      const newBook = { ...bookData, id: tempId };
      
      // Atualização otimista
      setBooks(prev => [newBook, ...prev]);
      
      // Chamada à API
      const createdBook = await bookApi.createBook(bookData);
      
      // Atualizar com dados reais da API
      setBooks(prev => prev.map(book => 
        book.id === tempId ? createdBook : book
      ));
      
      return createdBook;
    } catch (error) {
      // Reverter se falhar
      setBooks(prev => prev.filter(book => !book.id.startsWith('temp_')));
      throw error;
    }
  };
  
  const handleUpdateBook = async (bookData) => {
    try {
      if (!editingBook) return;
      
      // Atualização otimista
      setBooks(prev => prev.map(book => 
        book.id === editingBook.id ? { ...book, ...bookData } : book
      ));
      
      // Chamada à API
      await bookApi.updateBook(editingBook.id, bookData);
      
      return true;
    } catch (error) {
      // Reverter se falhar
      loadBooks();
      throw error;
    }
  };
  
  const handleDeleteBook = async (id) => {
    try {
      // Atualização otimista
      setBooks(prev => prev.filter(book => book.id !== id));
      
      // Chamada à API
      await bookApi.deleteBook(id);
      
      // ⭐ Se tiveres bookToDelete, podes remover esta linha:
      // setBookToDelete(null);
      
      return true;
    } catch (error) {
      // Reverter se falhar
      loadBooks();
      throw error;
    }
  };
  
  // Handlers
  const handleLogout = () => {
    onLogout();
    navigate('/login');
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
      {/* Header */}
      <header className="admin-header">
        <div>
          <h1>📊 BookVerse Admin Panel</h1>
          <p className="admin-subtitle">Gestão do catálogo de livros</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Sair
        </button>
      </header>
      
      {/* Main Content */}
      <div className="admin-content">
        {/* Action Bar */}
        <div className="action-bar">
          <div className="action-bar-left">
            <h2>📚 Gestão de Livros</h2>
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
              🔄 Atualizar
            </button>
            <button 
              onClick={handleAddClick} 
              className="action-btn add-btn"
            >
              ➕ Adicionar Livro
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="admin-error">
            <p>❌ {error}</p>
            <button onClick={loadBooks}>Tentar Novamente</button>
          </div>
        )}
        
        {/* Books Table */}
        <BookTable 
          books={books}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          isLoading={loading}
        />
        
        {/* Stats */}
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
      
      {/* Modals */}
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
            <h3>🗑️ Confirmar Eliminação</h3>
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