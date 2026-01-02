import { Link } from 'react-router-dom';
import './BookCard.css'; // Criaremos este CSS depois

/*Card Individual de Cada Livro*/

function BookCard({ book }) {
  return (
    <div className="book-card">
      <div className="book-image">
        <img 
          src={book.image || 'https://via.placeholder.com/150x200?text=No+Image'} 
          alt={book.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150x200?text=No+Image';
          }}
        />
      </div>
      
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">
          <strong>Autor:</strong> {book.author}
        </p>
        <div className="book-meta">
          <span className="book-year">{book.year}</span>
          <span className="book-genre">{book.genre}</span>
        </div>
        
        <p className="book-description">
          {book.description 
            ? (book.description.length > 100 
                ? `${book.description.substring(0, 100)}...` 
                : book.description)
            : 'Sem descrição disponível.'}
        </p>
        
        <Link to={`/book/${book.id}`} className="details-btn">
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}

export default BookCard;