import { Navbar, Container } from "react-bootstrap";
import "../../App.css";
import { currentUser } from "../../data/dummyData";

export default function Header() {
  return (
    <Navbar bg="dark" expand="lg" sticky="top" className="navbar-header">
      <Container>
        <Navbar.Brand href="#" className="fw-bold">
          <span className="header-logo">💸</span>
          <span className="header-app-name">Bill Bloom</span>
        </Navbar.Brand>
        <div className="header-user ms-auto">
          <div className="user-avatar">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <span className="user-name">{currentUser.username}</span>
        </div>
      </Container>
    </Navbar>
  );
}
