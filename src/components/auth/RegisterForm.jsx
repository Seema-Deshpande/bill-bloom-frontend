import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { register } from "../../reducers/authSlice";
import "../../App.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm({ onSwitchToLogin }) {
  const dispatch = useDispatch();
  const { loading, register: registerState } = useSelector((state) => state.auth);
  
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const result = await dispatch(register({
        username: form.username,
        email: form.email,
        password: form.password
      })).unwrap();
      setForm({ username: "", email: "", password: "", confirmPassword: "" });
      setErrors({});
    } catch (err) {
      // Error is already handled by Redux, no need to set errors here
    }
  };

  return (
    <Card className="auth-card">
      <Card.Body>
        <Card.Title className="auth-title">Create Account</Card.Title>
        <p className="auth-subtitle">Join Bill Bloom and manage your expenses</p>

        {registerState?.error && <Alert variant="danger" className="mb-3">{registerState.error}</Alert>}

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

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
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