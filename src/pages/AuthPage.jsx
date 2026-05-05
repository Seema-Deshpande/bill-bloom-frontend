import { useState } from "react";
import "../App.css";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage({ page }) {
    const [view, setView] = useState(page);

    return (
        <div className="auth-page">
            {view === "login" ? (
                <LoginForm onSwitchToRegister={() => setView("register")} />
            ) : (view === "register" ? (
                <RegisterForm onSwitchToLogin={() => setView("login")} />
            ) : (<p className="empty-state">Invalid view. Please choose "login" or "register".</p>)
            )
            }
        </div>
    );
}
