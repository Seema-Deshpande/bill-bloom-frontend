import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "react-bootstrap";
  import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  // Read authentication state from Redux
  const { token, loading } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;

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