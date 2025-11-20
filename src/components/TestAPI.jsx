import { useState, useEffect } from 'react';
import { livrosService } from '../services/api';

function TestAPI() {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);

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
        📚 Meu Catálogo de Livros
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px 0'
      }}>
        {livros.map(livro => (
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
    </div>
  );
}

export default TestAPI;