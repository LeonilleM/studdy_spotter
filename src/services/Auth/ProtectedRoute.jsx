import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PropTypes from 'prop-types';
import { loadingComponent } from '../../components/Loading';

const ProtectedRoute = ({ Component }) => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const location = useLocation();
    // Load first
    if (isLoading) return loadingComponent("Checking Authentication...");

    // Final check
    return isAuthenticated ? (
        <Component />
    ) : (
        <Navigate to="/signin" state={{ from: location }} replace />
    );
};

ProtectedRoute.propTypes = {
    Component: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;