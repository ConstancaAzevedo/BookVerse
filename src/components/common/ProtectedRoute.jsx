// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ajuste o caminho

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  console.log('🛡️ ProtectedRoute:');
  console.log('- User:', user);
  console.log('- Autenticado?', !!user);
  
  if (!user) {
    console.log('❌ Não autenticado - Redirecionando para /login');
    return <Navigate to="/login" />;
  }
  
  console.log('✅ Autenticado - Renderizando conteúdo');
  return children;
}

export default ProtectedRoute;