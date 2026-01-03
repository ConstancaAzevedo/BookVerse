import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookApi, commentApi } from '../services/api';
import RatingStars from '../components/common/RatingStars';
import CommentSection from '../components/frontoffice/CommentSection';
import SimilarBooks from '../components/frontoffice/SimilarBooks';
import './BookDetail.css';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const loadBookData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Carregar livro - CORREÇÃO: usar bookApi.getBookById()
        const bookData = await bookApi.getBookById(id);
        setBook(bookData);
        
        // Carregar contagem de comentários
        try {
          const comments = await commentApi.getCommentsByBook(id);
          setCommentsCount(comments.length);
        } catch (commentError) {
          console.warn('Não foi possível carregar comentários:', commentError);
          setCommentsCount(0);
        }
        
      } catch (err) {
        setError('Livro não encontrado ou erro ao carregar.');
        console.error('Erro:', err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBookData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="book-detail-loading">
        <div className="loading-spinner"></div>
        <p>A carregar detalhes do livro...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-error">
        <h2>📚 Livro Não Encontrado</h2>
        <p>{error || 'O livro que procura não existe.'}</p>
        <button onClick={() => navigate('/')} className="back-home-btn">
          ← Voltar ao Catálogo
        </button>
      </div>
    );
  }

  // Calcular idade do livro
  const currentYear = new Date().getFullYear();
  const bookAge = currentYear - book.year;

  return (
    <div className="book-detail-container">
      {/* Botão de voltar */}
      <div className="back-nav">
        <Link to="/" className="back-link">
          ← Voltar ao Catálogo
        </Link>
      </div>

      {/* Conteúdo principal */}
      <div className="book-detail-content">
        {/* Cabeçalho com breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Catálogo</Link>
          <span> / </span>
          <span className="current">{book.title}</span>
        </nav>

        {/* Informações do livro */}
        <div className="book-main-info">
          <div className="book-cover-large">
            <img 
              src={book.image || book.cover || 'https://via.placeholder.com/300x450/cccccc/ffffff?text=Sem+Capa'} 
              alt={`Capa de ${book.title}`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x450/cccccc/ffffff?text=Sem+Capa';
              }}
            />
          </div>
          
          <div className="book-details">
            <div className="book-header">
              <h1 className="book-title">{book.title}</h1>
              <div className="book-author-info">
                <span className="author-label">por</span>
                <h2 className="book-author">{book.author}</h2>
              </div>
            </div>
            
            <div className="book-meta-info">
              <div className="meta-item">
                <span className="meta-label">Publicado em</span>
                <span className="meta-value">{book.year}</span>
                {bookAge > 0 && (
                  <span className="meta-subtext">({bookAge} {bookAge === 1 ? 'ano' : 'anos'})</span>
                )}
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Género</span>
                <span className="meta-badge">{book.genre}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Comentários</span>
                <span className="meta-value">{commentsCount}</span>
              </div>
              
              {book.pages && (
                <div className="meta-item">
                  <span className="meta-label">Páginas</span>
                  <span className="meta-value">{book.pages}</span>
                </div>
              )}
            </div>
            
            {/* Rating */}
            <div className="book-rating">
              <h3>Avaliação dos Leitores</h3>
              <div className="rating-container">
                <RatingStars initialRating={book.rating || 4} readOnly size="large" />
                <div className="rating-info">
                  <span className="rating-score">{book.rating?.toFixed(1) || '4.0'}/5</span>
                  <span className="rating-count">(baseado em {commentsCount} {commentsCount === 1 ? 'comentário' : 'comentários'})</span>
                </div>
              </div>
            </div>
            
            {/* Ações */}
            <div className="book-actions">
              <button className="action-btn favorite-btn">
                ❤️ Adicionar aos Favoritos
              </button>
              <button className="action-btn share-btn">
                📤 Partilhar
              </button>
              <Link to={`/admin`} className="action-btn edit-btn">
                ✏️ Editar (Admin)
              </Link>
            </div>
          </div>
        </div>
        
        {/* Descrição completa */}
        <div className="book-description-section">
          <h3>📖 Sinopse</h3>
          <div className="book-description-full">
            {book.description ? (
              <p>{book.description}</p>
            ) : (
              <p className="no-description">
                Este livro não tem descrição disponível.
              </p>
            )}
          </div>
        </div>
        
        {/* Informações adicionais */}
        <div className="book-additional-info">
          <div className="info-card">
            <h4>📊 Detalhes Técnicos</h4>
            <ul>
              <li><strong>ID:</strong> #{book.id}</li>
              <li><strong>Autor:</strong> {book.author}</li>
              <li><strong>Ano de Publicação:</strong> {book.year}</li>
              <li><strong>Género:</strong> {book.genre}</li>
              {book.pages && <li><strong>Páginas:</strong> {book.pages}</li>}
              <li><strong>Adicionado ao catálogo:</strong> Janeiro 2025</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h4>🏷️ Palavras-chave</h4>
            <div className="tags">
              {book.genre && book.genre.split(' ').map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
              <span className="tag">Literatura</span>
              <span className="tag">Leitura</span>
              <span className="tag">Livro</span>
            </div>
          </div>
        </div>
        
        {/* Comentários */}
        <CommentSection bookId={id} />
        
        {/* Livros similares */}
        {book && <SimilarBooks currentBook={book} />}
        
        {/* Footer da página */}
        <div className="book-detail-footer">
          <p className="last-updated">
            📅 Informação atualizada em {new Date().toLocaleDateString('pt-PT')}
          </p>
          <div className="footer-actions">
            <Link to="/" className="footer-link">
              🔍 Ver mais livros
            </Link>
            <a href="#top" className="footer-link">
              ⬆️ Voltar ao topo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;