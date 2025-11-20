import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Serviço para operações com Livros
export const livrosService = {
  // Buscar todos os livros
  getAll: () => api.get('/livros'),
  
  // Buscar livro por ID
  getById: (id) => api.get(`/livros/${id}`),
  
  // Criar novo livro
  create: (livro) => api.post('/livros', livro),
  
  // Atualizar livro
  update: (id, livro) => api.put(`/livros/${id}`, livro),
  
  // Eliminar livro
  delete: (id) => api.delete(`/livros/${id}`),
};

// Serviço para operações com Comentários
export const comentariosService = {
  // Buscar todos os comentários
  getAll: () => api.get('/comentarios'),
  
  // Buscar comentários por livroId
  getByLivroId: (livroId) => api.get(`/comentarios?livroId=${livroId}`),
  
  // Criar novo comentário
  create: (comentario) => api.post('/comentarios', comentario),
};

export default api;