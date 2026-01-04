import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // ← ADICIONA
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // ← USA O CONTEXTO
  const isLoggedIn = !!user; // ← SIMPLES!

  const handleLogin = () => {
    navigate('/login');
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <img
              src="src\imagens\bookverse_logo.png"
              alt="BookVerse Logo"
              className="navbar-logo-image"
              style={{ width: '40px', height: '40px' }}
            />
            BookVerse
          </Link>
        </div>

        {/* Menu Mobile Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Menu Items */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Início
            </Link>
            <Link to="/#catalogo" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Catálogo
            </Link>
            <a href="#sobre" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Sobre
            </a>
            <a href="#contacto" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Contacto
            </a>
          </div>

          {/* User Actions */}
          <div className="navbar-actions">
            {isLoggedIn ? (
              <div className="user-menu">
                <button onClick={handleAdmin} className="action-btn admin-btn">
                  Admin
                </button>
                <button onClick={logout} className="action-btn logout-btn">
                  Sair
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="action-btn login-btn">
                🔐 Login Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;