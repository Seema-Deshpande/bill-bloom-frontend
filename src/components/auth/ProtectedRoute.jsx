import { Navigate, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useAuth from "../../context/useAuth";

function RouteLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="text-center">
        <Spinner animation="border" style={{ color: "#e94560" }} />
        <p className="mt-2 mb-0 text-muted">Loading...</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <RouteLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}