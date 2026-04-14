import { Navigate, useLocation } from 'react-router-dom';

import { getStoredUser, getToken } from '../api/api';

function ProtectedRoute({ children, allowedRoles = null, fallbackTo = '/dashboard' }) {
  const token = getToken();
  const user = getStoredUser();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
