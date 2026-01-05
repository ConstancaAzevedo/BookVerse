import { useState, useEffect } from 'react';
import './BookFormModal.css';

function BookFormModal({ isOpen, onClose, onSubmit, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    pages: '',
    genre: 'Ficção',
    image: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        author: '',
        year: new Date().getFullYear(),
        genre: 'Ficção',
        image: '',
        description: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao submeter:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;


  const validateImageUrl = (url) => {
    if (!url || url.trim() === '') return true; 

    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.author.trim()) newErrors.author = 'Autor é obrigatório';
    if (!formData.year || formData.year < 1000 || formData.year > new Date().getFullYear() + 5) {
      newErrors.year = 'Ano inválido';
    }
    if (formData.image && !validateImageUrl(formData.image)) {
      newErrors.image = 'URL da imagem inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}</h2>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Harry Potter e a Pedra Filosofal"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="author">Autor *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Ex: J.K. Rowling"
                className={errors.author ? 'error' : ''}
              />
              {errors.author && <span className="error-message">{errors.author}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="year">Ano de Publicação *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear() + 5}
                className={errors.year ? 'error' : ''}
              />
              {errors.year && <span className="error-message">{errors.year}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="pages">Número de Páginas</label>
              <input
                type="number"
                id="pages"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                min="1"
                placeholder="Ex: 320"
                className={errors.pages ? 'error' : ''}
              />
              {errors.pages && <span className="error-message">{errors.pages}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="genre">Género *</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={errors.genre ? 'error' : ''}
              >
                <option value="Ficção">Ficção</option>
                <option value="Fantasia">Fantasia</option>
                <option value="Romance">Romance</option>
                <option value="Técnico">Técnico</option>
                <option value="Biografia">Biografia</option>
                <option value="História">História</option>
                <option value="Poesia">Poesia</option>
                <option value="Infantil">Infantil</option>
              </select>
              {errors.genre && <span className="error-message">{errors.genre}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="image">URL da Imagem</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <small className="help-text">
                Deixe em branco para usar imagem padrão
              </small>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Descrição detalhada do livro..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'A guardar...' : (isEditing ? 'Atualizar Livro' : 'Adicionar Livro')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookFormModal;