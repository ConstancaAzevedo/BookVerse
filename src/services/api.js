const API_URL = "http://localhost:3001";

// DADOS MOCK DE LIVROS
const MOCK_BOOKS = {
  1: { 
    id: 1, 
    title: 'Harry Potter e a Pedra Filosofal', 
    author: 'J.K. Rowling',
    description: 'O primeiro livro da saga Harry Potter. Harry descobre que é um bruxo e inicia sua jornada em Hogwarts.',
    cover: 'https://www.presenca.pt/cdn/shop/products/image-1_f70b8d09-28e7-49d0-9273-a196230a7638_300x.jpg?v=1635288216',
    image: 'https://www.presenca.pt/cdn/shop/products/image-1_f70b8d09-28e7-49d0-9273-a196230a7638_300x.jpg?v=1635288216',
    rating: 4.8,
    pages: 223,
    year: 1997,
    genre: 'Fantasia'
  },
  2: { 
    id: 2, 
    title: '1984', 
    author: 'George Orwell',
    description: 'Um clássico da literatura distópica sobre vigilância totalitária e controle mental.',
    cover: 'https://static.fnac-static.com/multimedia/Images/PT/NR/f8/9e/0d/892664/1507-1/tsp20150715100812/1984.jpg',
    image: 'https://static.fnac-static.com/multimedia/Images/PT/NR/f8/9e/0d/892664/1507-1/tsp20150715100812/1984.jpg',
    rating: 4.7,
    pages: 328,
    year: 1949,
    genre: 'Ficção Científica'
  },
  3: {
    id: 3,
    title: 'O Senhor dos Anéis',
    author: 'J.R.R. Tolkien',
    description: 'A trilogia épica da Terra Média, seguindo a jornada de Frodo para destruir o Um Anel.',
    cover: 'https://img.wook.pt/images/o-senhor-dos-aneis-i-j-r-r-tolkien/MXw2NTQ0N3w5NTUxNHwxNTI4OTY3Nzc2MDAw/500x',
    image: 'https://img.wook.pt/images/o-senhor-dos-aneis-i-j-r-r-tolkien/MXw2NTQ0N3w5NTUxNHwxNTI4OTY3Nzc2MDAw/500x',
    rating: 4.9,
    pages: 1178,
    year: 1954,
    genre: 'Fantasia'
  },
  4: {
    id: 4,
    title: 'Orgulho e Preconceito',
    author: 'Jane Austen',
    description: 'Romance clássico sobre Elizabeth Bennet e sua relação com o sr. Darcy.',
    cover: 'https://www.presenca.pt/cdn/shop/products/image-1_22ec9f6b-b9cc-4f77-adf2-aaab91e54920_1024x1024.jpg?v=1604974222',
    image: 'https://www.presenca.pt/cdn/shop/products/image-1_22ec9f6b-b9cc-4f77-adf2-aaab91e54920_1024x1024.jpg?v=1604974222',
    rating: 4.6,
    pages: 432,
    year: 1813,
    genre: 'Romance'
  },
  5: {
    id: 5,
    title: 'O Grande Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'História sobre a busca do Sonho Americano durante os anos 20.',
    cover: 'https://imgv2-1-f.scribdassets.com/img/word_document/485318710/original/fcac25551d/1?v=1',
    image: 'https://imgv2-1-f.scribdassets.com/img/word_document/485318710/original/fcac25551d/1?v=1',
    rating: 4.5,
    pages: 218,
    year: 1925,
    genre: 'Clássico'
  },
  6: {
    id: 6,
    title: 'Moby Dick',
    author: 'Herman Melville',
    description: 'A caça obsessiva do capitão Ahab à baleia branca.',
    cover: 'https://img.wook.pt/images/moby-dick-herman-melville/MXwxOTI3NjgyMHwxNTA4MTc0MHwxNDkxOTI1ODkwMDAw/500x',
    image: 'https://img.wook.pt/images/moby-dick-herman-melville/MXwxOTI3NjgyMHwxNTA4MTc0MHwxNDkxOTI1ODkwMDAw/500x',
    rating: 4.4,
    pages: 585,
    year: 1851,
    genre: 'Aventura'
  },
  7: {
    id: 7,
    title: 'Crime e Castigo',
    author: 'Fiódor Dostoiévski',
    description: 'Estudo psicológico de um estudante que comete um assassinato.',
    cover: 'https://www.relogiodagua.pt/wp-content/uploads/2023/11/9789896410803-scaled.jpg',
    image: 'https://www.relogiodagua.pt/wp-content/uploads/2023/11/9789896410803-scaled.jpg',
    rating: 4.7,
    pages: 671,
    year: 1866,
    genre: 'Filosófico'
  },
  8: {
    id: 8,
    title: 'A Metamorfose',
    author: 'Franz Kafka',
    description: 'Gregor Samsa acorda transformado num inseto monstruoso.',
    cover: 'https://www.presenca.pt/cdn/shop/products/image-1_769b8631-d1ab-4f47-b2d1-1738cb25d507_1024x1024.jpg?v=1604750759',
    image: 'https://www.presenca.pt/cdn/shop/products/image-1_769b8631-d1ab-4f47-b2d1-1738cb25d507_1024x1024.jpg?v=1604750759',
    rating: 4.3,
    pages: 201,
    year: 1915,
    genre: 'Ficção Absurda'
  }
};

// CONVERTE O OBJETO PARA ARRAY
const ALL_BOOKS_ARRAY = Object.values(MOCK_BOOKS);

// API DE LIVROS
export const bookApi = {
  getBooks: async (page = 1, limit = 6, search = "") => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simular delay
      
      let filteredBooks = ALL_BOOKS_ARRAY;
      
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

  // ADICIONA A FUNÇÃO getBookById AO OBJETO bookApi
  getBookById: async (bookId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const book = MOCK_BOOKS[bookId];
      
      if (!book) {
        throw new Error('Livro não encontrado');
      }
      
      return book;
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      throw error;
    }
  },

  createBook: async (bookData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock: Criar livro', bookData);
    return { ...bookData, id: Date.now() };
  },

  updateBook: async (id, bookData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock: Atualizar livro', id, bookData);
    return { ...bookData, id };
  },

  deleteBook: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock: Eliminar livro', id);
    return true;
  }
};

// FUNÇÃO INDIVIDUAL getBookById (mantém compatibilidade)
export const getBookById = async (bookId) => {
  return await bookApi.getBookById(bookId);
};

// LIVROS SIMILARES
export const getSimilarBooks = async (bookId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentBook = MOCK_BOOKS[bookId];
    if (!currentBook) return [];
    
    // Encontrar livros com o mesmo gênero
    const similar = ALL_BOOKS_ARRAY.filter(book => 
      book.id !== bookId && 
      book.genre === currentBook.genre
    ).slice(0, 3); // Limitar a 3 livros
    
    return similar;
  } catch (error) {
    console.error('Erro ao buscar livros similares:', error);
    return [];
  }
};

// API DE COMENTÁRIOS
export const commentApi = {
  getCommentsByBook: async (bookId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Comentários mock
      const mockComments = {
        1: [
          { id: 1, bookId: 1, user: 'João Silva', text: 'Adorei este livro!', date: '2024-01-15', rating: 5 },
          { id: 2, bookId: 1, user: 'Maria Santos', text: 'Muito bom para iniciantes na leitura.', date: '2024-01-10', rating: 4 },
          { id: 3, bookId: 1, user: 'Carlos Oliveira', text: 'Clássico imperdível!', date: '2024-01-05', rating: 5 }
        ],
        2: [
          { id: 4, bookId: 2, user: 'Ana Pereira', text: 'Assustadoramente atual.', date: '2024-01-12', rating: 5 },
          { id: 5, bookId: 2, user: 'Rui Costa', text: 'Leitura obrigatória.', date: '2024-01-08', rating: 4 }
        ],
        3: [
          { id: 6, bookId: 3, user: 'Sofia Almeida', text: 'Épico! Melhor fantasia de sempre.', date: '2024-01-20', rating: 5 }
        ],
        4: [
          { id: 7, bookId: 4, user: 'Luís Fernandes', text: 'Romance atemporal.', date: '2024-01-18', rating: 5 }
        ],
        5: [
          { id: 8, bookId: 5, user: 'Teresa Lima', text: 'Retrato perfeito de uma época.', date: '2024-01-14', rating: 4 }
        ]
      };
      
      return mockComments[bookId] || [];
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      return [];
    }
  },

  addComment: async (commentData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simular salvamento
      const newComment = {
        id: Date.now(),
        ...commentData,
        date: new Date().toISOString().split('T')[0]
      };
      
      console.log('Mock: Comentário adicionado', newComment);
      return newComment;
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      throw error;
    }
  }
};