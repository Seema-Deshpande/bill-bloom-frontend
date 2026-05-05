import "../App.css";
import { currentUser } from "../data/dummyData";

export default function HomePage() {

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
