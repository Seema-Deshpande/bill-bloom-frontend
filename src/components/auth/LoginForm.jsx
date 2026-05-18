import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "../../App.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({ onSwitchToRegister, onLogin, authError = "", loading = false, infoMessage = "" }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (onLogin) {
      try {
        await onLogin(form.email, form.password);
        setForm({ email: "", password: "" });
        setErrors({});
      } catch {
        // Auth error is rendered via props.
      }
    }
  };

  return (
    <Card className="auth-card">
      <Card.Body>
        <Card.Title className="auth-title">Welcome Back</Card.Title>
        <p className="auth-subtitle">Sign in to your Bill Bloom account</p>

        {infoMessage && <Alert variant="success" className="mb-3">{infoMessage}</Alert>}
        {authError && <Alert variant="danger" className="mb-3">{authError}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="login-email">Email</Form.Label>
            <Form.Control
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="login-password">Password</Form.Label>
            <Form.Control
              id="login-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Form>

        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Button variant="link" className="p-0 align-baseline" onClick={onSwitchToRegister}>
            Register here
          </Button>
        </p>
      </Card.Body>
    </Card>
  );
}
