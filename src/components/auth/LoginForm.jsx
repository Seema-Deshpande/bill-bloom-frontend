import { useState } from "react";
import "../../App.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({ onSwitchToRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

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
    if (successMsg) setSuccessMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("Login form data:", { email: form.email, password: form.password });
    setSuccessMsg("Login successful! Welcome back.");
    setForm({ email: "", password: "" });
    setErrors({});
  };

  return (
    <div className="card auth-card">
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Sign in to your Bill Bloom account</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`form-input${errors.email ? " error" : ""}`}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            className={`form-input${errors.password ? " error" : ""}`}
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        {successMsg && <div className="success-msg">{successMsg}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Sign In</button>
        </div>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account?{" "}
        <button className="btn-link" onClick={onSwitchToRegister}>Register here</button>
      </p>
    </div>
  );
}
