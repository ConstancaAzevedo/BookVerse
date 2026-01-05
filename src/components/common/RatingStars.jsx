import { useState } from 'react';
import './RatingStars.css';

function RatingStars({ initialRating = 0, onRate, readOnly = false, size = 'medium' }) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (readOnly) return;
    setRating(value);
    if (onRate) onRate(value);
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`rating-stars ${size} ${readOnly ? 'read-only' : ''}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className="star-btn"
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          disabled={readOnly}
          aria-label={`Avaliar com ${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
        >
          <span className="star-icon">
            {(hoverRating || rating) >= star ? '★' : '☆'}
          </span>
        </button>
      ))}
      {!readOnly && (
        <span className="rating-text">
          {rating > 0 ? `${rating}/5 estrelas` : 'Clique para avaliar'}
        </span>
      )}
    </div>
  );
}

export default RatingStars;