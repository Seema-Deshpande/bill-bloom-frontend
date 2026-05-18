import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import useAuth from "../context/useAuth";

export default function AuthPage({ page }) {
  const [view, setView] = useState(page || "login");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, loading, error } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (email, password) => {
    await login(email, password);
    navigate(location.state?.from || "/", { replace: true });
  };

  const handleRegister = async (data) => {
    await register(data);
    navigate("/login", {
      replace: true,
      state: { message: "Registration successful. Please sign in." },
    });
  };

  const handleSwitchToRegister = () => {
    setView("register");
    navigate("/register", { replace: true });
  };

  const handleSwitchToLogin = () => {
    setView("login");
    navigate("/login", { replace: true, state: location.state });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5}>
          {view === "login" ? (
            <LoginForm
              onSwitchToRegister={handleSwitchToRegister}
              onLogin={handleLogin}
              authError={error}
              loading={loading}
              infoMessage={location.state?.message || ""}
            />
          ) : view === "register" ? (
            <RegisterForm
              onSwitchToLogin={handleSwitchToLogin}
              onRegister={handleRegister}
              authError={error}
              loading={loading}
            />
          ) : (
            <p className="text-muted text-center">Invalid view.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}
