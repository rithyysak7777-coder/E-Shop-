import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {

  const { user, token } = useAuth();

  // Not Login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Login Success
  return children;
};

export default PrivateRoute;