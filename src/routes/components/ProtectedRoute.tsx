import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export function ProtectedRoute() {
  const { isAuthenticated, token } = useAuthStore();

  if (!isAuthenticated || !token) {
    // Jeśli nie jest zalogowany, przenosi do /auth/login
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}