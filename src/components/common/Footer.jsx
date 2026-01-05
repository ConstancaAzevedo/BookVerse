import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">BookVerse</h3>
          <p className="footer-subtitle">
            Projeto de Interfaces Web 2025-2026
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Desenvolvido por:</h4>
          <ul className="footer-list">
            <li>Constança Azevedo - Nº 25969</li>
            <li>Rui Dias - Nº 25957</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Instituição:</h4>
          <p>Instituto Politécnico de Tomar</p>
          <p>Escola Superior de Tecnologia</p>
          <p>Licenciatura em Engenharia Informática</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} BookVerse - Todos os direitos reservados</p>
        <p className="footer-disclaimer">
          Trabalho académico desenvolvido para a unidade curricular de Interfaces Web
        </p>
      </div>
    </footer>
  );
};

export default Footer;