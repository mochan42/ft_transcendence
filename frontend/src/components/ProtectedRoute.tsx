import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuth: boolean;
  path: string;
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuth, element }) => {
	return (
		isAuth ? <>{element}</> : <Navigate to='/login' />
	)
   };

export default ProtectedRoute;