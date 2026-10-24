import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({children}) => {
  const { user, loading } = useAuth();

  // Wait for the /auth/me session check before deciding
  if (loading) {
    return <div className="p-6 text-gray-500 text-center">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;