import { useState, useEffect } from 'react';
import { commentApi } from '../../services/api';
import RatingStars from '../common/RatingStars';
import './CommentSection.css';
import LikeButton from '../common/LikeButton';

/*Secção de Comentários*/

function CommentSection({ bookId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
  // Gerar ou recuperar userId
  const generateUserId = () => {
    let storedId = localStorage.getItem('commentUserId');
    
    if (!storedId) {
      // Criar ID único
      storedId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('commentUserId', storedId);
    }
    
    setUserId(storedId);
  };
  
  generateUserId();
}, []);


  // Form state
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    text: '',
    rating: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadComments();
  }, [bookId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentApi.getCommentsByBook(bookId);
      setComments(data);
    } catch (err) {
      setError('Erro ao carregar comentários');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.text.trim()) {
      setError('Por favor, escreva um comentário');
      return;
    }

    if (!newComment.name.trim()) {
      setError('Por favor, insira seu nome');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const commentToSubmit = {
        bookId: parseInt(bookId),
        user: newComment.name,
        text: newComment.text,
        rating: newComment.rating,
        date: new Date().toISOString().split('T')[0] // data atual
      };

      await commentApi.addComment(commentToSubmit);

      // Reset form
      setNewComment({
        name: '',
        email: '',
        text: '',
        rating: 0
      });

      setSubmitSuccess(true);
      loadComments(); // Recarregar comentários

      // esconder mensagem de sucesso após 3 segundos
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao enviar comentário", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRate = (rating) => {
    setNewComment(prev => ({ ...prev, rating }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  // Calcular rating médio
  const averageRating = comments.length > 0
    ? (comments.reduce((sum, comment) => sum + (comment.rating || 0), 0) / comments.length).toFixed(1)
    : 0;

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>💬 Comentários dos Leitores</h3>
        <div className="comment-stats">
          <span className="comment-count">{comments.length} comentários</span>
          {averageRating > 0 && (
            <span className="average-rating">
              <RatingStars initialRating={parseFloat(averageRating)} readOnly size="small" />
              <strong>{averageRating}</strong>/5
            </span>
          )}
        </div>
      </div>

      {/* Formulário para novo comentário */}
      <div className="comment-form-container">
        <h4>Deixe o seu comentário</h4>
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome *</label>
              <input
                type="text"
                id="name"
                value={newComment.name}
                onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email (opcional)</label>
              <input
                type="email"
                id="email"
                value={newComment.email}
                onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Avaliação</label>
            <RatingStars
              onRate={handleRate}
              initialRating={newComment.rating}
            />
          </div>

          <div className="form-group">
            <label htmlFor="comment">Comentário *</label>
            <textarea
              id="comment"
              value={newComment.text}
              onChange={(e) => setNewComment(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Partilhe a sua opinião sobre este livro..."
              rows="4"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {submitSuccess && (
            <div className="success-message">
              ✅ O seu comentário foi publicado com sucesso!
            </div>
          )}

          <button
            type="submit"
            className="submit-comment-btn"
            disabled={submitting}
          >
            {submitting ? 'A publicar...' : 'Publicar Comentário'}
          </button>
        </form>
      </div>

      {/* Lista de comentários */}
      <div className="comments-list">
        {loading ? (
          <div className="loading-comments">
            <p>A carregar comentários...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <p>Seja o primeiro a comentar este livro!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <div className="comment-author">
                  <strong>{comment.user}</strong>
                </div>
                <div className="comment-meta">
                  {comment.rating > 0 && (
                    <RatingStars initialRating={comment.rating} readOnly size="small" />
                  )}
                  <span className="comment-date">{formatDate(comment.date)}</span>

                  {/* Botão de Like para o comentário */}
                  <LikeButton 
                    commentId={comment.id} 
                    userId={userId} />
                </div>
              </div>
              <div className="comment-text">
                <p>{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;