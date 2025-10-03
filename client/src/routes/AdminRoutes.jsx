import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoutes = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoutes;
