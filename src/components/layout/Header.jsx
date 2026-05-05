import "../../App.css";
import { currentUser } from "../../data/dummyData";

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-logo">💸</span>
        <span className="header-app-name">Bill Bloom</span>
      </div>

      <div className="header-user">
        <div className="user-avatar">
          {currentUser.username.charAt(0).toUpperCase()}
        </div>
        <span className="user-name">{currentUser.username}</span>
      </div>
    </header>
  );
}
