import { Navbar, Container, Button } from "react-bootstrap";
import { currentUser } from "../../data/dummyData";

export default function Header({ onNavigate, isLoggedIn, onLogout }) {
  return (
    <Navbar bg="white" variant="light" expand="md" sticky="top" className="shadow-sm border-bottom">
      <Container fluid="xl">
        <Navbar.Brand
          onClick={() => onNavigate && onNavigate("Home")}
          style={{ cursor: "pointer", fontWeight: 700, fontSize: "1.3rem" }}
        >
          💰 Bill Bloom
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <div className="ms-auto d-flex align-items-center gap-2 mt-2 mt-md-0">
            {isLoggedIn ? (
              <>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 36, height: 36, backgroundColor: "#e94560", color: "#fff", fontSize: 15 }}
                >
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-dark small">{currentUser.username}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-1"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => onNavigate && onNavigate("Auth")}
                >
                  Login
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  style={{ backgroundColor: "#e94560", border: "none" }}
                  onClick={() => onNavigate && onNavigate("Register")}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}