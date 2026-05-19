import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Unauthorized from '../pages/errors/Unauthorized';

const AdminRoute = ({children}) => {
    const { user, token } = useAuth();

    // Not Login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Role promission
    if(user.role != "admin"){
        return <Unauthorized/>;
    }

  return children
}

export default AdminRoute