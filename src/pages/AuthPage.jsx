import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { clearError } from "../reducers/authSlice";

export default function AuthPage({ page }) {
  const [view, setView] = useState(page || "login");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Read from Redux store
  const { token, register: registerState } = useSelector(
    (state) => state.auth
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  // Redirect on successful registration
  useEffect(() => {
    if (registerState?.status === 'succeeded') {
      navigate("/login", {
        replace: true,
        state: { message: "Registration successful. Please sign in." },
      });
    }
  }, [registerState?.status, navigate]);

  // Clear errors when navigating between login/register
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [view, dispatch]);

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
            />
          ) : view === "register" ? (
            <RegisterForm
              onSwitchToLogin={handleSwitchToLogin}
            />
          ) : (
            <p className="text-muted text-center">Invalid view.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}
