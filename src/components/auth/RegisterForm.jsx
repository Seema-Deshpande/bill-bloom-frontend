import { useState } from "react";
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
    <div className="card auth-card">
      <h2 className="auth-title">Create Account</h2>
      <p className="auth-subtitle">Join Bill Bloom and manage your expenses</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label" htmlFor="reg-username">Username</label>
          <input id="reg-username" type="text" name="username" value={form.username}
            onChange={handleChange} placeholder="e.g. alice_wonder"
            className={`form-input${errors.username ? " error" : ""}`} />
          {errors.username && <span className="form-error">{errors.username}</span>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="reg-email">Email</label>
          <input id="reg-email" type="email" name="email" value={form.email}
            onChange={handleChange} placeholder="you@example.com"
            className={`form-input${errors.email ? " error" : ""}`} />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="reg-password">Password</label>
          <input id="reg-password" type="password" name="password" value={form.password}
            onChange={handleChange} placeholder="Minimum 6 characters"
            className={`form-input${errors.password ? " error" : ""}`} />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
          <input id="reg-confirm" type="password" name="confirmPassword" value={form.confirmPassword}
            onChange={handleChange} placeholder="Re-enter your password"
            className={`form-input${errors.confirmPassword ? " error" : ""}`} />
          {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
        </div>

        {successMsg && <div className="success-msg">{successMsg}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Create Account</button>
        </div>
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <button className="btn-link" onClick={onSwitchToLogin}>Sign in</button>
      </p>
    </div>
  );
}