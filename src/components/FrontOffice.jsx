import { useState, useEffect } from 'react';
import { livrosService } from '../services/api';

function FrontOffice() {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const livrosPorPagina = 6;

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await livrosService.getAll();
        setLivros(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  // Cálculos para paginação
  const indexUltimoLivro = paginaAtual * livrosPorPagina;
  const indexPrimeiroLivro = indexUltimoLivro - livrosPorPagina;
  const livrosAtuais = livros.slice(indexPrimeiroLivro, indexUltimoLivro);
  const totalPaginas = Math.ceil(livros.length / livrosPorPagina);

  // Mudar página
  const mudarPagina = (numeroPagina) => setPaginaAtual(numeroPagina);

  if (loading) return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>📚 A carregar livros...</h2>
    </div>
  );

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#2c3e50',
        marginBottom: '30px'
      }}>
        📚 BookVerse - Catálogo de Livros
      </h1>

      {/* Informação da paginação */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#666'
      }}>
        <p>Página {paginaAtual} de {totalPaginas} • {livros.length} livros no total</p>
      </div>
      
      {/* Grid de livros */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        padding: '20px 0'
      }}>
        {livrosAtuais.map(livro => (
          <div key={livro.id} style={{ 
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <img 
                src={livro.imagem} 
                alt={livro.titulo}
                style={{ 
                  width: '120px', 
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
            </div>
            
            <h3 style={{ 
              margin: '0 0 10px 0',
              color: '#2c3e50',
              fontSize: '1.2em'
            }}>
              {livro.titulo}
            </h3>
            
            <p style={{ 
              margin: '5px 0',
              color: '#7f8c8d',
              fontSize: '0.9em'
            }}>
              <strong>Autor:</strong> {livro.autor}
            </p>
            
            <p style={{ 
              margin: '10px 0 0 0',
              color: '#555',
              fontSize: '0.9em',
              lineHeight: '1.4'
            }}>
              {livro.descricao}
            </p>
          </div>
        ))}
      </div>

      {/* Navegação de páginas */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        marginTop: '30px',
        flexWrap: 'wrap'
      }}>
        {/* Botão Anterior */}
        <button
          onClick={() => mudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
          style={{
            padding: '8px 16px',
            border: '1px solid #007bff',
            backgroundColor: paginaAtual === 1 ? '#f8f9fa' : '#007bff',
            color: paginaAtual === 1 ? '#6c757d' : 'white',
            borderRadius: '6px',
            cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          ← Anterior
        </button>

        {/* Números das páginas */}
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
          <button
            key={numero}
            onClick={() => mudarPagina(numero)}
            style={{
              padding: '8px 12px',
              border: '1px solid #dee2e6',
              backgroundColor: paginaAtual === numero ? '#007bff' : 'white',
              color: paginaAtual === numero ? 'white' : '#007bff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: paginaAtual === numero ? 'bold' : 'normal'
            }}
          >
            {numero}
          </button>
        ))}

        {/* Botão Próximo */}
        <button
          onClick={() => mudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
          style={{
            padding: '8px 16px',
            border: '1px solid #007bff',
            backgroundColor: paginaAtual === totalPaginas ? '#f8f9fa' : '#007bff',
            color: paginaAtual === totalPaginas ? '#6c757d' : 'white',
            borderRadius: '6px',
            cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer'
          }}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}

export default FrontOffice;