import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Navbar.css';

/*Navbar com Login*/

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verificar se está logado
  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem('bookverse_admin');
      setIsLoggedIn(savedAuth === 'true');
    };

    checkAuth();
    // Verificar a cada mudança de storage (se outro tab fizer logout)
    window.addEventListener('storage', checkAuth);

    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bookverse_admin');
    setIsLoggedIn(false);
    navigate('/');
  };

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
                <button onClick={handleLogout} className="action-btn logout-btn">
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