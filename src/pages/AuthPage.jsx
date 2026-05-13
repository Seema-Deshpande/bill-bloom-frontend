import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage({ page }) {
  const [view, setView] = useState(page || "login");

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5}>
          {view === "login" ? (
            <LoginForm onSwitchToRegister={() => setView("register")} />
          ) : view === "register" ? (
            <RegisterForm onSwitchToLogin={() => setView("login")} />
          ) : (
            <p className="text-muted text-center">Invalid view.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}
