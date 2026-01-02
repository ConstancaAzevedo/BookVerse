import './BookTable.css';

/*Tabela de Livros para Admin*/

function BookTable({ books, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="table-loading">
        <p>A carregar livros...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="table-empty">
        <p>Nenhum livro encontrado. Adicione o primeiro livro!</p>
      </div>
    );
  }

  return (
    <div className="book-table-container">
      <table className="book-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Capa</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Ano</th>
            <th>Género</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="book-id">#{book.id}</td>
              <td className="book-cover">
                <img 
                  src={book.image || 'https://via.placeholder.com/40x60/cccccc/ffffff?text=No+Img'} 
                  alt={book.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40x60/cccccc/ffffff?text=No+Img';
                  }}
                />
              </td>
              <td className="book-title">
                <strong>{book.title}</strong>
                <div className="book-description-preview">
                  {book.description?.substring(0, 60)}...
                </div>
              </td>
              <td className="book-author">{book.author}</td>
              <td className="book-year">{book.year}</td>
              <td className="book-genre">
                <span className="genre-badge">{book.genre}</span>
              </td>
              <td className="book-actions">
                <button 
                  onClick={() => onEdit(book)}
                  className="action-btn edit-btn"
                  title="Editar livro"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => onDelete(book.id)}
                  className="action-btn delete-btn"
                  title="Eliminar livro"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="table-footer">
        <p>Total: <strong>{books.length}</strong> livros</p>
      </div>
    </div>
  );
}

export default BookTable;