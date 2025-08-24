import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Protected({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role?.toUpperCase())) return <Navigate to="/" replace />;
  return children;
}
