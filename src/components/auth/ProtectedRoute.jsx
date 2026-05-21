import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useAuth  from "../../context/useAuth.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" style={{ color: "#e94560" }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}