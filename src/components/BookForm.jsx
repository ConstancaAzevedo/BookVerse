import { useState } from 'react';
import './BookForm.css';

function BookForm({ onSubmit, initialData, onCancel }) {
  // Inicializa com initialData OU valores padrão
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        title: initialData.title || '',
        author: initialData.author || '',
        year: initialData.year || new Date().getFullYear(),
        genre: initialData.genre || 'Ficção',
        description: initialData.description || '',
        image: initialData.image || ''
      };
    }
    return {
      title: '',
      author: '',
      year: new Date().getFullYear(),
      genre: 'Ficção',
      description: '',
      image: ''
    };
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: 'loading', text: 'A processar...' });

    const result = await onSubmit(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      
      // Se não estiver editando, limpa o formulário
      if (!initialData) {
        setFormData({
          title: '',
          author: '',
          year: new Date().getFullYear(),
          genre: 'Ficção',
          description: '',
          image: ''
        });
      }
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const genres = ['Ficção', 'Fantasia', 'Romance', 'Mistério', 'Biografia', 'História', 'Ciência', 'Tecnologia', 'Autoajuda'];

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Título *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Harry Potter e a Pedra Filosofal"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="author" className="form-label">Autor *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Ex: J.K. Rowling"
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="year" className="form-label">Ano de Publicação</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1000"
            max={new Date().getFullYear()}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre" className="form-label">Género</label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="form-select"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image" className="form-label">URL da Imagem</label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://exemplo.com/livro.jpg"
          className="form-input"
        />
        {formData.image && (
          <div className="image-preview">
            <img 
              src={formData.image} 
              alt="Preview" 
              onError={(e) => e.target.style.display = 'none'} 
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Descrição</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descrição detalhada do livro..."
          rows="4"
          className="form-textarea"
        />
      </div>

      {message.text && (
        <div className={`form-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-actions">
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
          >
            Cancelar
          </button>
        )}
        <button type="submit" className="submit-button">
          {initialData ? 'Atualizar Livro' : 'Adicionar Livro'}
        </button>
      </div>
    </form>
  );
}

export default BookForm;