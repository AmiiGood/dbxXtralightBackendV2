import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children }) => {
  const { usuario, loading } = useAuth();

  console.log('🛡️ ProtectedRoute - Loading:', loading);
  console.log('👤 ProtectedRoute - Usuario:', usuario);
  console.log('🔑 ProtectedRoute - Token:', localStorage.getItem('token') ? 'EXISTE' : 'NO EXISTE');

  if (loading) {
    console.log('⏳ Mostrando loading...');
    return <Loading message="Verificando autenticación..." />;
  }

  if (!usuario) {
    console.log('❌ No hay usuario, redirigiendo a login...');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Usuario autenticado, mostrando contenido protegido');
  return children;
};

export default ProtectedRoute;
