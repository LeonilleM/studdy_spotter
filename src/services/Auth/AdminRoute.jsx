import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PropTypes from 'prop-types';
import { loadingComponent } from '../../components/Loading';

const AdminRoute = ({ Component }) => {
    const { isAuthenticated, isLoading, isAdmin } = useContext(AuthContext);
    const location = useLocation();
    if (isLoading) return loadingComponent("Checking Credentials...");

    return isAuthenticated && isAdmin() ? (
        <Component />
    ) : (
        <Navigate to="/" state={{ from: location }} replace />
    );
};

AdminRoute.propTypes = {
    Component: PropTypes.elementType.isRequired,
};

export default AdminRoute;