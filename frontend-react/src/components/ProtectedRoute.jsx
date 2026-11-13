import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute() {
    const { user, isPending, token } = useAuth();

    // Attendre la vérification du token
    if (token && isPending) {
        return <p>Vérification de la connexion...</p>;
    }

    // Aucun utilisateur connecté
    if (!user) {
        return <Navigate to="/connexion" replace />;
    }

    // Utilisateur connecté : afficher la page demandée
    return <Outlet />;
}

export default ProtectedRoute;