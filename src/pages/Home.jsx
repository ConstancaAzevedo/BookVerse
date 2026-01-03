import BookList from '../components/frontoffice/BookList';


function Home() {
  return (
    <div className="home-page">
      {/* Hero Section - Opcional */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Bem-vindo ao BookVerse</h1>
          <p>Descobre milhares de livros e partilha as tuas opiniões</p>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <main>
        <BookList />
      </main>
    </div>
  );
}

export default Home;