import { SHEETY_CONFIG } from './sheetyConfig';


const SHEETY_API_ID = SHEETY_CONFIG.PROJECT_ID;
const SHEETY_PROJECT = SHEETY_CONFIG.PROJECT_NAME;
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

// API DE LIVROS
export const bookApi = {
  getBooks: async (page = 1, limit = 10, search = "") => {
    try {
      const response = await fetch(`${BASE_URL}/books`, { headers });
      const data = await response.json();
      const allBooks = data.books.map(transformBookFromSheety);

      let filteredBooks = allBooks;

      // Filtrar se houver pesquisa
      if (search && search.trim() !== "") {
        const term = search.trim();

        // Função para remover acentos e converter para minúsculas
        const normalizarTexto = (texto) => {
          if (!texto || typeof texto !== 'string') return '';
          return texto
            .normalize('NFD') // Separa caracteres base de acentos
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .toLowerCase();
        };

        // Normaliza o termo de pesquisa (remove acentos)
        const termoNormalizado = normalizarTexto(term);

        filteredBooks = filteredBooks.filter(book => {
          // Valores seguros (strings vazias se não existir)
          const titulo = book.title || "";
          const autor = book.author || "";
          const genero = book.genre || "";

          // Normaliza os campos do livro (remove acentos)
          const tituloNormalizado = normalizarTexto(titulo);
          const autorNormalizado = normalizarTexto(autor);
          const generoNormalizado = normalizarTexto(genero);

          // Pesquisa APENAS em título, autor e género
          return (
            tituloNormalizado.includes(termoNormalizado) ||
            autorNormalizado.includes(termoNormalizado) ||
            generoNormalizado.includes(termoNormalizado)
          );
        });

        return {
          data: filteredBooks,
          total: filteredBooks.length,
          page: 1,
          totalPages: Math.max(1, Math.ceil(filteredBooks.length / limit)),
          isSearch: true
        };
      }

      // Paginação (sem pesquisa)
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
      return {
        data: [],
        total: 0,
        page: 1,
        totalPages: 1
      };
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

      // Comentários usam IDs do sistema (1, 2, 3...) - subtraindo 1 do ID do Sheety
      const bookComments = allComments
        .filter(comment => parseInt(comment.bookId) === numericBookId)
        .map(comment => ({
          id: parseInt(comment.id) - 1, // ⬅️ AQUI: Sistema ID = Sheety ID - 1
          sheetyId: parseInt(comment.id), // ⬅️ ID original do Sheety
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
      console.log("🔍 DEBUG: Iniciando addComment");
      console.log("🔍 DEBUG: Dados recebidos:", commentData);

      // 1. Buscar TODOS os comentários para calcular próximo ID
      const getAllResponse = await fetch(`${BASE_URL}/comments`, { headers });
      const allData = await getAllResponse.json();
      const allComments = allData.comments || [];

      // Calcular próximo ID do Sheety (não do sistema)
      let nextSheetyId = 1;
      if (allComments.length > 0) {
        const sheetyIds = allComments.map(c => parseInt(c.id || c.Id || c.ID || 0));
        const maxSheetyId = Math.max(...sheetyIds.filter(id => !isNaN(id)));
        nextSheetyId = maxSheetyId + 1;
      }

      // ID do sistema será nextSheetyId - 1
      const systemId = nextSheetyId - 1;

      console.log(`🔢 Próximo ID Sheety: ${nextSheetyId}, ID Sistema: ${systemId}`);

      // 2. Garantir data atual
      const today = new Date().toISOString().split('T')[0];

      // 3. Estrutura para o Sheety
      const payload = {
        comment: {
          id: nextSheetyId.toString(), // ID do Sheety
          bookId: commentData.bookId.toString(),
          user: commentData.user || commentData.userName || "Anónimo",
          text: commentData.text || "",
          date: today,
          rating: (commentData.rating || 0).toString()
        }
      };

      console.log("📤 Enviando dados:", payload);

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
      console.log("✅ Comentário adicionado:", data);

      // Retornar com ID do sistema
      const returnedComment = data.comment || data;
      return {
        id: systemId, // ⬅️ ID do sistema
        sheetyId: nextSheetyId, // ⬅️ ID do Sheety
        bookId: parseInt(returnedComment.bookId || commentData.bookId),
        user: returnedComment.user || commentData.user,
        text: returnedComment.text || commentData.text,
        date: returnedComment.date || today,
        rating: parseInt(returnedComment.rating || commentData.rating) || 0
      };

    } catch (error) {
      console.error("❌ ERRO CRÍTICO em addComment:", error);
      throw error;
    }
  }
};

// Funções auxiliares mantêm compatibilidade
export const getBookById = async (bookId) => {
  return await bookApi.getBookById(bookId);
};

//API DE LIVROS SIMILARES
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


// API DE LIKES EM COMENTÁRIOS
export const likesApi = {
  // Dar like a um comentário
  likeComment: async (commentId, userId) => {
    try {
      console.log("❤️ Tentando dar like ao comentário:", commentId, "userId:", userId);

      // 1. PRIMEIRO: Buscar o próximo ID disponível
      let nextId = 1;
      try {
        const response = await fetch(`${BASE_URL}/commentLikes`, { headers });
        if (response.ok) {
          const data = await response.json();
          const allLikes = data.commentLikes || [];

          if (allLikes.length > 0) {
            // Encontrar o maior ID existente
            const ids = allLikes
              .map(like => parseInt(like.id || 0))
              .filter(id => !isNaN(id) && id > 0);

            if (ids.length > 0) {
              nextId = Math.max(...ids) + 1;
            }
          }
        }
      } catch (error) {
        console.warn("⚠️ Não foi possível buscar IDs existentes, usando ID 1", error);
      }

      console.log(`🔢 Próximo ID para like: ${nextId}`);

      const dataValue = new Date().toISOString();

      // ⭐⭐ ENVIAR O ID EXPLICITAMENTE ⭐⭐
      const payload = {
        commentLike: {
          id: nextId.toString(),      // ⬅️ ADICIONAR ID AQUI!
          commentId: commentId.toString(),
          userId: userId.toString(),
          data: dataValue
        }
      };

      console.log("📤 Enviando dados:", payload);

      const response = await fetch(`${BASE_URL}/commentLikes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      console.log("📡 Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Like adicionado:", data);
      return data;

    } catch (error) {
      console.error("❌ Erro ao dar like:", error);
      throw error;
    }
  },


  // Remover like de um comentário
  unlikeComment: async (commentId, userId) => {
    try {
      console.log("🚫 Tentando remover like do comentário:", commentId);

      const response = await fetch(`${BASE_URL}/commentLikes`, { headers });

      if (!response.ok) {
        throw new Error(`Erro ao buscar likes: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Likes existentes:", data);

      const allLikes = data.commentLikes || [];

      // Converter commentId do sistema para Sheety se necessário
      const sheetyCommentId = parseInt(commentId) + 1; // Se usar sistema de IDs

      // Encontrar like deste user para este comentário
      const userLike = allLikes.find(like =>
        like &&
        (parseInt(like.commentId) === parseInt(commentId) || // ID sistema
          parseInt(like.commentId) === sheetyCommentId) && // OU ID Sheety
        like.userId === userId.toString()
      );

      console.log("🔍 Like encontrado para eliminar:", userLike);

      if (userLike && userLike.id) {
        // Eliminar o like encontrado
        const deleteResponse = await fetch(`${BASE_URL}/commentLikes/${userLike.id}`, {
          method: 'DELETE',
          headers
        });

        console.log("✅ Like removido, status:", deleteResponse.status);
        return await deleteResponse.json();
      }

      return { success: false, message: 'Like não encontrado' };

    } catch (error) {
      console.error("❌ Erro ao remover like do comentário:", error);
      throw error;
    }
  },

  // Contar likes de um comentário
  getCommentLikes: async (commentId) => {
    try {
      console.log("🔢 Contando likes do comentário:", commentId);

      const response = await fetch(`${BASE_URL}/commentLikes`, { headers });

      if (!response.ok) {
        console.log("⚠️ Não foi possível buscar likes, assumindo 0");
        return { count: 0, likes: [] };
      }

      const data = await response.json();
      console.log("📊 Resposta completa:", data);

      // Estrutura correta: { commentLikes: [...] }
      const allLikes = data.commentLikes || [];

      // Filtrar likes deste comentário
      const commentLikes = allLikes.filter(like =>
        like && parseInt(like.commentId) === parseInt(commentId)
      );

      console.log(`✅ ${commentLikes.length} likes para comentário ${commentId}`);

      return {
        count: commentLikes.length,
        likes: commentLikes
      };

    } catch (error) {
      console.error("❌ Erro ao contar likes do comentário:", error);
      return { count: 0, likes: [] };
    }
  },

  // Verificar se user já deu like ao comentário
  hasUserLikedComment: async (commentId, userId) => {
    try {
      console.log("🔍 Verificando se user", userId, "deu like ao comentário", commentId);

      const response = await fetch(`${BASE_URL}/commentLikes`, { headers });

      if (!response.ok) {
        console.log("⚠️ Não foi possível verificar likes");
        return false;
      }

      const data = await response.json();

      // Estrutura correta
      const allLikes = data.commentLikes || [];

      const userLike = allLikes.find(like =>
        like &&
        parseInt(like.commentId) === parseInt(commentId) &&
        like.userId === userId.toString()
      );

      const hasLiked = !!userLike;
      console.log("✅ User já deu like?", hasLiked);

      return hasLiked;

    } catch (error) {
      console.error("❌ Erro ao verificar like do comentário:", error);
      return false;
    }
  },

  // Toggle like em comentário
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
      console.error("❌ Erro no toggle:", error);
      throw error;
    }
  }
};

