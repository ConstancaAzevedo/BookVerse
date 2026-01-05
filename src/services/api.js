import { SHEETY_CONFIG } from './sheetyConfig';

const SHEETY_API_ID = SHEETY_CONFIG.PROJECT_ID;
const SHEETY_PROJECT = SHEETY_CONFIG.PROJECT_NAME;
const BASE_URL = SHEETY_CONFIG.API_BASE;
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SHEETY_CONFIG.API_KEY}`
};

const requestCache = new Map();


const cachedFetch = async (url, options = {}) => {
  const cacheKey = `${url}${JSON.stringify(options)}`;

  if (requestCache.has(cacheKey)) {
    console.log(`[CACHE] ${url}`);
    return requestCache.get(cacheKey);
  }

  console.log(`🔄 [FETCH] ${url}`);
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    requestCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(` Erro em ${url}:`, error);
    throw error;
  }
};

const transformBookFromSheety = (sheetyBook) => {
  return {
    id: sheetyBook.id - 1,
    sheetyId: sheetyBook.id,
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
      const data = await cachedFetch(`${BASE_URL}/books`, { headers });
      const allBooks = data.books.map(transformBookFromSheety);

      let filteredBooks = allBooks;

      if (search && search.trim() !== "") {
        const term = search.trim();

        const normalizarTexto = (texto) => {
          if (texto == null) return '';
          const textoString = String(texto);
          return textoString
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
        };

        const termoOriginal = term.toLowerCase();
        const termoNormalizado = normalizarTexto(term);

        filteredBooks = filteredBooks.filter(book => {
          const titulo = String(book.title || "");
          const autor = String(book.author || "");
          const genero = String(book.genre || "");
          const ano = String(book.year || "");

          const tituloNormalizado = normalizarTexto(titulo);
          const autorNormalizado = normalizarTexto(autor);
          const generoNormalizado = normalizarTexto(genero);
          const tituloOriginal = titulo.toLowerCase();
          const anoString = ano;

          return (
            tituloNormalizado.includes(termoNormalizado) ||
            tituloOriginal.includes(termoOriginal) ||
            autorNormalizado.includes(termoNormalizado) ||
            autor.toLowerCase().includes(termoOriginal) ||
            generoNormalizado.includes(termoNormalizado) ||
            genero.toLowerCase().includes(termoOriginal) ||
            anoString.includes(termoOriginal) ||
            titulo.includes(term)
          );
        });

        console.log(`Pesquisa por "${term}": ${filteredBooks.length} resultados`);

        return {
          data: filteredBooks,
          total: filteredBooks.length,
          page: 1,
          totalPages: Math.max(1, Math.ceil(filteredBooks.length / limit)),
          isSearch: true
        };
      }

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
      return { data: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  getAllBooksForAdmin: async () => {
    try {
      console.log("API: Buscando TODOS os livros para admin");
      const data = await cachedFetch(`${BASE_URL}/books`, { headers });

      if (!data.books) {
        console.error(" data.books não existe:", data);
        return { data: [], total: 0 };
      }

      const allBooks = data.books.map(transformBookFromSheety);
      console.log(`API: Encontrados ${allBooks.length} livros para admin`);

      return {
        data: allBooks,
        total: allBooks.length
      };

    } catch (error) {
      console.error(" Erro no getAllBooksForAdmin:", error);
      return { data: [], total: 0 };
    }
  },

  getBookById: async (bookId) => {
    try {
      console.log(`getBookById CHAMADO com:`, bookId);

      let actualBookId = bookId;
      if (typeof bookId === 'object' && bookId !== null) {
        actualBookId = bookId.id || bookId._id || bookId.bookId;
      }

      actualBookId = parseInt(actualBookId);

      if (isNaN(actualBookId)) {
        throw new Error(`ID de livro inválido: ${bookId}`);
      }

      console.log(`Buscando livro ID ${actualBookId}...`);
      const data = await cachedFetch(`${BASE_URL}/books`, { headers });

      if (!data.books || data.books.length === 0) {
        throw new Error('Nenhum livro encontrado na API');
      }

      let foundBook = data.books.find(b => (b.id - 1) == actualBookId);

      if (!foundBook) {
        foundBook = data.books.find(b => b.id == actualBookId);
      }

      if (!foundBook) {
        throw new Error(`Livro ID ${actualBookId} não encontrado`);
      }

      return transformBookFromSheety(foundBook);
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      throw error;
    }
  },

  getAllBooks: async () => {
    try {
      const data = await cachedFetch(`${BASE_URL}/books`, { headers });
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



      const allBooksData = await fetch(`${BASE_URL}/books`, { headers });
      const allBooks = await allBooksData.json();

      const targetBook = allBooks.books.find(book => (book.id - 1) === id);

      if (!targetBook) {
        throw new Error(`Livro com ID interno ${id} não encontrado`);
      }

      const sheetyId = targetBook.id;

      console.log(`Atualizando livro: ID interno=${id}, Sheety ID=${sheetyId}`);


      const response = await fetch(`${BASE_URL}/books/${sheetyId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ book: sheetyBook })
      });

      const data = await response.json();


      const cacheKeys = Array.from(requestCache.keys());
      cacheKeys.forEach(key => {
        if (key.includes('/books')) {
          requestCache.delete(key);
        }
      });

      return transformBookFromSheety(data.book);

    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      throw error;
    }
  },

  deleteBook: async (id) => {

    const sheetyId = Number(id) + 1;

    console.log(`🗑️ Eliminando: ID interno ${id} → Sheety ID ${sheetyId}`);

    await fetch(`${BASE_URL}/books/${sheetyId}`, {
      method: 'DELETE',
      headers
    });

    requestCache.clear();
    return { success: true };
  }
};




export const commentApi = {
  getCommentsByBook: async (bookId) => {
    try {
      const data = await cachedFetch(`${BASE_URL}/comments`, { headers });
      const allComments = data.comments || [];

      const numericBookId = parseInt(bookId);

      const bookComments = allComments
        .filter(comment => parseInt(comment.bookId) === numericBookId)
        .map(comment => ({
          id: parseInt(comment.id) - 1,
          sheetyId: parseInt(comment.id),
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
      console.log("DEBUG: Iniciando addComment");


      const allData = await cachedFetch(`${BASE_URL}/comments`, { headers });
      const allComments = allData.comments || [];

      let nextSheetyId = 1;
      if (allComments.length > 0) {
        const sheetyIds = allComments.map(c => parseInt(c.id || 0));
        const maxSheetyId = Math.max(...sheetyIds.filter(id => !isNaN(id)));
        nextSheetyId = maxSheetyId + 1;
      }

      const systemId = nextSheetyId - 1;
      const today = new Date().toISOString().split('T')[0];

      const payload = {
        comment: {
          id: nextSheetyId.toString(),
          bookId: commentData.bookId.toString(),
          user: commentData.user || commentData.userName || "Anónimo",
          text: commentData.text || "",
          date: today,
          rating: (commentData.rating || 0).toString()
        }
      };

      console.log("Enviando dados:", payload);


      const response = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      console.log("Comentário adicionado:", data);

      const returnedComment = data.comment || data;
      return {
        id: systemId,
        sheetyId: nextSheetyId,
        bookId: parseInt(returnedComment.bookId || commentData.bookId),
        user: returnedComment.user || commentData.user,
        text: returnedComment.text || commentData.text,
        date: returnedComment.date || today,
        rating: parseInt(returnedComment.rating || commentData.rating) || 0
      };

    } catch (error) {
      console.error(" ERRO CRÍTICO em addComment:", error);
      throw error;
    }
  }
};


export const likesApi = {
  likeComment: async (commentId, userId) => {
    try {
      console.log("Tentando dar like ao comentário:", commentId);


      const data = await cachedFetch(`${BASE_URL}/commentLikes`, { headers });
      const allLikes = data.commentLikes || [];

      let nextId = 1;
      if (allLikes.length > 0) {
        const ids = allLikes.map(like => parseInt(like.id || 0)).filter(id => !isNaN(id) && id > 0);
        if (ids.length > 0) {
          nextId = Math.max(...ids) + 1;
        }
      }

      const dataValue = new Date().toISOString();
      const payload = {
        commentLike: {
          id: nextId.toString(),
          commentId: commentId.toString(),
          userId: userId.toString(),
          data: dataValue
        }
      };

      console.log("Enviando dados:", payload);


      const response = await fetch(`${BASE_URL}/commentLikes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("Like adicionado:", result);
      return result;

    } catch (error) {
      console.error("Erro ao dar like:", error);
      throw error;
    }
  },

  unlikeComment: async (commentId, userId) => {
    try {
      console.log("Tentando remover like do comentário:", commentId);


      const data = await cachedFetch(`${BASE_URL}/commentLikes`, { headers });
      const allLikes = data.commentLikes || [];

      const sheetyCommentId = parseInt(commentId) + 1;
      const userLike = allLikes.find(like =>
        like &&
        (parseInt(like.commentId) === parseInt(commentId) ||
          parseInt(like.commentId) === sheetyCommentId) &&
        like.userId === userId.toString()
      );

      if (userLike && userLike.id) {

        const deleteResponse = await fetch(`${BASE_URL}/commentLikes/${userLike.id}`, {
          method: 'DELETE',
          headers
        });

        const result = await deleteResponse.json();
        console.log("Like removido:", result);
        return result;
      }

      return { success: false, message: 'Like não encontrado' };

    } catch (error) {
      console.error("Erro ao remover like:", error);
      throw error;
    }
  },

  getCommentLikes: async (commentId) => {
    try {
      const data = await cachedFetch(`${BASE_URL}/commentLikes`, { headers });
      const allLikes = data.commentLikes || [];

      const commentLikes = allLikes.filter(like =>
        like && parseInt(like.commentId) === parseInt(commentId)
      );

      console.log(`${commentLikes.length} likes para comentário ${commentId}`);
      return { count: commentLikes.length, likes: commentLikes };

    } catch (error) {
      console.error("Erro ao contar likes:", error);
      return { count: 0, likes: [] };
    }
  },

  hasUserLikedComment: async (commentId, userId) => {
    try {
      const data = await cachedFetch(`${BASE_URL}/commentLikes`, { headers });
      const allLikes = data.commentLikes || [];

      const userLike = allLikes.find(like =>
        like &&
        parseInt(like.commentId) === parseInt(commentId) &&
        like.userId === userId.toString()
      );

      const hasLiked = !!userLike;
      console.log(`User ${userId} já deu like? ${hasLiked}`);
      return hasLiked;

    } catch (error) {
      console.error(" Erro ao verificar like:", error);
      return false;
    }
  },

  toggleCommentLike: async (commentId, userId) => {
    try {
      console.log("🔄 Alternando like para comentário:", commentId);
      const hasLiked = await likesApi.hasUserLikedComment(commentId, userId);

      if (hasLiked) {
        console.log("🔄 Removendo like existente...");
        return await likesApi.unlikeComment(commentId, userId);
      } else {
        console.log("🔄 Adicionando novo like...");
        return await likesApi.likeComment(commentId, userId);
      }
    } catch (error) {
      console.error(" Erro no toggle:", error);
      throw error;
    }
  }
};

export const getBookById = async (bookId) => {
  return await bookApi.getBookById(bookId);
};

export const getSimilarBooks = async (bookId) => {
  try {
    console.log(`🔍 Buscando livros similares para ID ${bookId}...`);
    const currentBook = await bookApi.getBookById(bookId);
    const allBooks = await bookApi.getAllBooks();

    const similar = allBooks
      .filter(book => book.id !== bookId && book.genre === currentBook.genre)
      .slice(0, 3);

    console.log(`Encontrados ${similar.length} livros similares`);
    return similar;
  } catch (error) {
    console.error('Erro ao buscar livros similares:', error);
    return [];
  }
};

export const livrosService = {
  getAll: bookApi.getAllBooks
};