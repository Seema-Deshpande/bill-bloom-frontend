import { useState } from "react";
import "../App.css";
import { currentUser } from "../data/dummyData";
import GroupsPage from "./GroupsPage";
import PersonalExpensesPage from "./PersonalExpensesPage";

export default function HomePage() {
  const [activeView, setActiveView] = useState("home");

  const renderView = () => {
    switch (activeView) {
      case "groups":
        return <GroupsPage />;
      case "personal":
        return <PersonalExpensesPage />;
      case "home":
      default:
        return (
          <div className="page-container">
            {/* Hero */}
            <div className="hero">
              <div className="hero-content">
                <h1 className="hero-title">
                  Welcome back, <span className="hero-accent">{currentUser.username}</span> 👋
                </h1>
                <p className="hero-subtitle">
                  Track your personal and group expenses in one place.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">💰 Bill Bloom</div>
          <ul className="navbar-menu">
            <li>
              <button
                className={`nav-btn ${activeView === "home" ? "nav-btn-active" : ""}`}
                onClick={() => setActiveView("home")}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className={`nav-btn ${activeView === "groups" ? "nav-btn-active" : ""}`}
                onClick={() => setActiveView("groups")}
              >
                Groups
              </button>
            </li>
            <li>
              <button
                className={`nav-btn ${activeView === "personal" ? "nav-btn-active" : ""}`}
                onClick={() => setActiveView("personal")}
              >
                Personal
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Content */}
      {renderView()}
    </div>
  );
}
