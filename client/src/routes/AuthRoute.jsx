import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/user/dashboard" replace />;
  }

  // If not logged in, show the auth page
  return children;
};

export default AuthRoute;
