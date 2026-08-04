import { Navigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useData();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;