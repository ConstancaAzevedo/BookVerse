import { useState, useEffect } from 'react';
import { likesApi } from '../../services/api';
import './LikeButton.css';

function LikeButton({ commentId, userId}) {
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    loadLikesData();
  }, [commentId, userId]);

  const loadLikesData = async () => {
    try {
      setLoading(true);
      
      const likesData = await likesApi.getCommentLikes(commentId);
      setLikesCount(likesData.count);
      
      if (userId) {
        const userHasLiked = await likesApi.hasUserLikedComment(commentId, userId);
        setHasLiked(userHasLiked);
      }
      
    } catch (error) {
      console.error('Erro ao carregar likes do comentário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!userId) {
      alert('Por favor, identifique-se para dar like a comentários!');
      return;
    }
    
    try {
      setAnimating(true);
      
      await likesApi.toggleCommentLike(commentId, userId);
      
      await loadLikesData();
      
      setTimeout(() => setAnimating(false), 600);
      
    } catch (error) {
      console.error('Erro ao processar like:', error);
      setAnimating(false);
    }
  };

  if (loading) {
    return (
      <button className="comment-like-button loading" disabled>
        <span className="heart-icon"></span>
        <span className="like-count">...</span>
      </button>
    );
  }

  return (
    <button
      className={`comment-like-button ${hasLiked ? 'liked' : ''} ${animating ? 'animating' : ''}`}
      onClick={handleLike}
      title={hasLiked ? "Remover like" : "Gostei deste comentário"}
      disabled={!userId || animating}
    >
      <span className="heart-icon">
        {hasLiked ? '❤️' : '❤️'}
      </span>
      <span className="like-count">{likesCount}</span>
      <span className="like-text">{hasLiked ? 'Gostei' : 'Gostar'}</span>
    </button>
  );
}

export default LikeButton;