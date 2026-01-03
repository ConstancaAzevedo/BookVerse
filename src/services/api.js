import { SHEETY_CONFIG } from './sheetyConfig';

const BASE_URL = SHEETY_CONFIG.API_BASE;
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SHEETY_CONFIG.API_KEY}`
};

// Função auxiliar para transformar dados do Sheety
const transformBookFromSheety = (sheetyBook) => {
  return {
    id: sheetyBook.id - 1, // ID do sistema (1, 2, 3...)
    sheetyId: sheetyBook.id, // ID original do Sheety (2, 3, 4...)
    title: sheetyBook.title,
    author: sheetyBook.author,
    description: sheetyBook.description,
    genre: sheetyBook.genre,
    cover: sheetyBook.cover,
    image: sheetyBook.image || sheetyBook.cover,
    rating: parseFloat(sheetyBook.rating) || 0,
    pages: parseInt(sheetyBook.pages) || 0,
    year: parseInt(sheetyBook.year) || 0
  };
};

export const bookApi = {
  getBooks: async (page = 1, limit = 6, search = "") => {
    try {
      const response = await fetch(`${BASE_URL}/books`, { headers });
      const data = await response.json();
      const allBooks = data.books.map(transformBookFromSheety);

      let filteredBooks = allBooks;

      // Filtrar se houver pesquisa
      if (search && search.trim() !== "") {
        const term = search.toLowerCase().trim();
        filteredBooks = filteredBooks.filter(book =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          (book.genre && book.genre.toLowerCase().includes(term)) ||
          (book.description && book.description.toLowerCase().includes(term))
        );

        return {
          data: filteredBooks,
          total: filteredBooks.length,
          page: 1,
          totalPages: 1,
          isSearch: true
        };
      }

      // Paginação
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedBooks = filteredBooks.slice(start, end);

      return {
        data: paginatedBooks,
        total: filteredBooks.length,
        page,
        totalPages: Math.ceil(filteredBooks.length / limit)
      };

    } catch (error) {
      console.error("Erro na API:", error);
      throw error;
    }
  },

  getBookById: async (bookId) => {
    try {
      console.log(`🔍 getBookById CHAMADO com:`, bookId);
      console.log(`🔍 Tipo de bookId:`, typeof bookId);
      console.log(`🔍 bookId toString:`, String(bookId));

      // Se bookId for um objeto, tenta extrair o ID
      let actualBookId = bookId;
      if (typeof bookId === 'object' && bookId !== null) {
        console.log(`⚠️ bookId é objeto! Extraindo...`, bookId);
        actualBookId = bookId.id || bookId._id || bookId.bookId;
        console.log(`🔄 ID extraído:`, actualBookId);
      }

      // Converte para número
      actualBookId = parseInt(actualBookId);

      if (isNaN(actualBookId)) {
        console.error(`❌ bookId inválido:`, bookId);
        throw new Error(`ID de livro inválido: ${bookId}`);
      }

      console.log(`🔍 Buscando livro ID numérico ${actualBookId}...`);

      // 1. Primeiro busca TODOS os livros
      const response = await fetch(`${BASE_URL}/books`, { headers });
      const data = await response.json();

      console.log(`📊 Total de livros disponíveis:`, data.books?.length || 0);

      if (!data.books || data.books.length === 0) {
        throw new Error('Nenhum livro encontrado na API');
      }

      // 2. Encontra o livro pelo ID correto
      // CORREÇÃO: Use actualBookId, não bookId!
      let foundBook = null;

      if (data.books) {
        // A: Busca pelo ID do sistema (subtraindo 1 do ID do Sheety)
        foundBook = data.books.find(b => (b.id - 1) == actualBookId); // <-- CORREÇÃO AQUI

        // B: Se não encontrar, tenta buscar pelo ID do Sheety diretamente
        if (!foundBook) {
          console.log(`🔄 Tentando buscar pelo ID do Sheety: ${actualBookId}`);
          foundBook = data.books.find(b => b.id == actualBookId);
        }
      }

      console.log(`🔍 Livro encontrado:`, foundBook);

      if (!foundBook) {
        console.error(`❌ Livro ID ${actualBookId} não encontrado. Livros disponíveis:`,
          data.books?.map(b => ({
            sheetyId: b.id,
            systemId: b.id - 1,  // ID do sistema
            title: b.title
          })));
        throw new Error(`Livro ID ${actualBookId} não encontrado`);
      }

      return transformBookFromSheety(foundBook);
    } catch (error) {
      console.error('❌ Erro ao buscar livro:', error);
      throw error;
    }
  },

  getAllBooks: async () => {
    try {
      const response = await fetch(`${BASE_URL}/books`, { headers });
      const data = await response.json();
      return data.books.map(transformBookFromSheety);
    } catch (error) {
      console.error("Erro ao buscar todos os livros:", error);
      throw error;
    }
  },

  createBook: async (bookData) => {
    try {
      const sheetyBook = {
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        genre: bookData.genre,
        cover: bookData.cover,
        image: bookData.image || bookData.cover,
        rating: bookData.rating?.toString() || '0',
        pages: bookData.pages?.toString() || '0',
        year: bookData.year?.toString() || '0'
      };

      const response = await fetch(`${BASE_URL}/books`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ book: sheetyBook })
      });

      const data = await response.json();
      return transformBookFromSheety(data.book);
    } catch (error) {
      console.error("Erro ao criar livro:", error);
      throw error;
    }
  },

  updateBook: async (id, bookData) => {
    try {
      const sheetyBook = {
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        genre: bookData.genre,
        cover: bookData.cover,
        image: bookData.image || bookData.cover,
        rating: bookData.rating?.toString() || '0',
        pages: bookData.pages?.toString() || '0',
        year: bookData.year?.toString() || '0'
      };

      const response = await fetch(`${BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ book: sheetyBook })
      });

      const data = await response.json();
      return transformBookFromSheety(data.book);
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/books/${id}`, {
        method: 'DELETE',
        headers
      });

      await response.json();
      return { success: true, message: 'Livro eliminado com sucesso' };
    } catch (error) {
      console.error("Erro ao eliminar livro:", error);
      throw error;
    }
  }
};

// API DE COMENTÁRIOS
export const commentApi = {
  getCommentsByBook: async (bookId) => {
    try {
      const response = await fetch(`${BASE_URL}/comments`, { headers });
      const data = await response.json();
      const allComments = data.comments || [];

      const numericBookId = parseInt(bookId);

      // Comentários usam IDs do sistema (1, 2, 3...)
      const bookComments = allComments
        .filter(comment => parseInt(comment.bookId) === numericBookId)
        .map(comment => ({
          id: comment.id,
          bookId: parseInt(comment.bookId),
          user: comment.user,
          text: comment.text,
          date: comment.date,
          rating: parseInt(comment.rating) || 0
        }));

      console.log(`📝 ${bookComments.length} comentários para livro ${numericBookId}`);
      return bookComments;

    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      return [];
    }
  },

  addComment: async (commentData) => {
    try {
      const sheetyComment = {
        bookId: commentData.bookId.toString(),
        user: commentData.user,
        text: commentData.text,
        date: commentData.date || new Date().toISOString().split('T')[0],
        rating: commentData.rating?.toString() || '0'
      };

      const response = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ comment: sheetyComment })
      });

      const data = await response.json();
      return {
        id: data.comment.id,
        bookId: parseInt(data.comment.bookId),
        user: data.comment.user,
        text: data.comment.text,
        date: data.comment.date,
        rating: parseInt(data.comment.rating) || 0
      };
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      throw error;
    }
  }
};

// Funções auxiliares mantêm compatibilidade
export const getBookById = async (bookId) => {
  return await bookApi.getBookById(bookId);
};

export const getSimilarBooks = async (bookId) => {
  try {
    console.log(`🔍 Buscando livros similares para ID ${bookId}...`);

    const currentBook = await bookApi.getBookById(bookId);
    const allBooks = await bookApi.getAllBooks();

    const similar = allBooks
      .filter(book =>
        book.id !== bookId &&
        book.genre === currentBook.genre
      )
      .slice(0, 3);

    console.log(`✅ Encontrados ${similar.length} livros similares`);
    return similar;
  } catch (error) {
    console.error('❌ Erro ao buscar livros similares:', error);
    return [];
  }
};