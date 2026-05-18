import { Navbar, Container, Button, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";

const AUTH_LINKS = [
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

const APP_LINKS = [
  { to: "/", label: "Home" },
  { to: "/groups", label: "Groups" },
  { to: "/expenses", label: "Expenses" },
  { to: "/analytics", label: "Analytics" },
];

export default function Header({ onNavigate }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="white" variant="light" expand="md" sticky="top" className="shadow-sm border-bottom">
      <Container fluid="xl">
        <Navbar.Brand
          onClick={() => navigate(isAuthenticated ? "/" : "/login")}
          style={{ cursor: "pointer", fontWeight: 700, fontSize: "1.3rem" }}
        >
          💰 Bill Bloom
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <div className="ms-auto d-flex align-items-center flex-column flex-md-row gap-3 mt-3 mt-md-0">
            <Nav className="align-items-md-center gap-1 gap-md-2 flex-column flex-md-row">
              {(isAuthenticated ? APP_LINKS : AUTH_LINKS).map((item) => (
                <Nav.Link
                  as={NavLink}
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => `px-2 ${isActive ? "fw-bold text-danger" : "text-dark"}`}
                  onClick={() => {
                    if (onNavigate) {
                      if (item.to === "/") onNavigate("Home");
                      if (item.to === "/groups") onNavigate("Groups");
                      if (item.to === "/expenses") onNavigate("Personal");
                      if (item.to === "/analytics") onNavigate("Analytics");
                      if (item.to === "/login") onNavigate("Auth");
                      if (item.to === "/register") onNavigate("Register");
                    }
                  }}
                >
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>

            {isAuthenticated && user ? (
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 36, height: 36, backgroundColor: "#e94560", color: "#fff", fontSize: 15 }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-dark small">{user.username}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-1"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : null}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}