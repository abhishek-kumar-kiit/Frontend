// src/components/AdminProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminProtectedRoute = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        // While loading, render a loading indicator or nothing at all
        // This prevents the redirect from happening prematurely
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Authenticating...</p>
            </div>
        );
    }
    // Show a loading state while user data is being checked
    if (isAuthenticated === undefined) {
        return <div>Loading...</div>; // Or a proper spinner component
    }

    // Redirect if not authenticated or if the user is not an Admin
    if (!isAuthenticated || user?.role !== 'Admin') {
        return <Navigate to="/login" replace />;
    }

    // If authenticated and is an Admin, render the child routes
    return <Outlet />;
};

export default AdminProtectedRoute;