import { useState } from 'react';
import './SearchBar.css';

/*Barra de Pesquisa*/

function SearchBar({ onSearch, initialValue = "" }) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Pesquisar por título, autor ou género..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="search-buttons">
          <button type="submit" className="search-btn">
            🔍 Buscar
          </button>
          
          {searchTerm && (
            <button 
              type="button" 
              onClick={handleClear}
              className="clear-btn"
            >
              ✕ Limpar
            </button>
          )}
        </div>
      </div>
      
      {searchTerm && (
        <p className="search-info">
          A pesquisar por: "<strong>{searchTerm}</strong>"
        </p>
      )}
    </form>
  );
}

export default SearchBar;