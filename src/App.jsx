import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Login from './components/admin/Login';
import Admin from './pages/Admin';
import ScrollToTop from './components/common/ScrollToTop';
import Footer from './components/common/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />

        <div className="App-content">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/login" element={<Login />} />

            {/* Rota protegida - Admin */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin onLogout={() => {
                  console.log('Logout from App');
                }} />
              </ProtectedRoute>
            } />

            {/* Rota catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ScrollToTop />
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;