export const SHEETY_CONFIG = {
  PROJECT_ID: import.meta.env.VITE_SHEETY_PROJECT_ID,
  PROJECT_NAME: import.meta.env.VITE_SHEETY_PROJECT_NAME,
  API_BASE: import.meta.env.VITE_SHEETY_API_BASE,
  API_KEY: import.meta.env.VITE_SHEETY_API_KEY,

  ENDPOINTS: {
    BOOKS: '/books',
    USERS: '/users',
    COMMENTS: '/comments',
    COMMENT_LIKES: '/commentLikes'
  }
};

// Aviso se as variáveis de ambiente essenciais estiverem em falta
if (!SHEETY_CONFIG.API_BASE || !SHEETY_CONFIG.API_KEY) {
  console.warn('Variáveis de ambiente do Sheety em falta. Certifique-se de que o ficheiro .env define VITE_SHEETY_API_BASE e VITE_SHEETY_API_KEY');
}