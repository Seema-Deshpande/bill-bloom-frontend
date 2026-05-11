import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "../../App.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm({ onSwitchToLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (form.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }
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
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (successMsg) setSuccessMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...dataToLog } = form;
    console.log("Register form data:", dataToLog);
    setSuccessMsg("Registration successful! Redirecting to login...");
    setForm({ username: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setTimeout(() => {
      setSuccessMsg("");
      onSwitchToLogin && onSwitchToLogin();
    }, 2000);
  };

  return (
    <Card className="auth-card">
      <Card.Body>
        <Card.Title className="auth-title">Create Account</Card.Title>
        <p className="auth-subtitle">Join Bill Bloom and manage your expenses</p>

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="reg-username">Username</Form.Label>
            <Form.Control
              id="reg-username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. alice_wonder"
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="reg-email">Email</Form.Label>
            <Form.Control
              id="reg-email"
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
            <Form.Label htmlFor="reg-password">Password</Form.Label>
            <Form.Control
              id="reg-password"
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

          <Form.Group className="mb-3">
            <Form.Label htmlFor="reg-confirm">Confirm Password</Form.Label>
            <Form.Control
              id="reg-confirm"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {successMsg && <Alert variant="success" className="mb-3">{successMsg}</Alert>}

          <Button variant="primary" type="submit" className="w-100">
            Create Account
          </Button>
        </Form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Button variant="link" className="p-0 align-baseline" onClick={onSwitchToLogin}>
            Sign in
          </Button>
        </p>
      </Card.Body>
    </Card>
  );
}