import './BookListAdmin.css';

function BookListAdmin({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-title">📚 Nenhum livro encontrado</p>
        <p className="empty-subtitle">Comece por adicionar o primeiro livro!</p>
      </div>
    );
  }

  return (
    <div className="admin-book-list">
      <div className="table-responsive">
        <table className="books-table">
          <thead>
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Capa</th>
              <th className="table-header">Título</th>
              <th className="table-header">Autor</th>
              <th className="table-header">Ano</th>
              <th className="table-header">Género</th>
              <th className="table-header">Ações</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} className="table-row">
                <td className="book-id">#{book.id}</td>
                <td className="book-cover">
                  {book.image ? (
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="cover-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'block';
                      }} 
                    />
                  ) : null}
                  <div className="cover-placeholder" style={{ display: book.image ? 'none' : 'block' }}>
                    📖
                  </div>
                </td>
                <td className="book-title-cell">
                  <strong className="book-title">{book.title}</strong>
                  {book.description && (
                    <p className="book-description">
                      {book.description.substring(0, 60)}...
                    </p>
                  )}
                </td>
                <td className="book-author">{book.author}</td>
                <td className="book-year">{book.year}</td>
                <td className="book-genre">
                  <span className="genre-badge">{book.genre}</span>
                </td>
                <td className="book-actions">
                  <button
                    onClick={() => onEdit(book)}
                    className="action-button edit-button"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(book.id)}
                    className="action-button delete-button"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stats-bar">
        <p>Total de livros: <strong>{books.length}</strong></p>
        <p>Clique em ✏️ para editar ou 🗑️ para excluir</p>
      </div>
    </div>
  );
}

export default BookListAdmin;