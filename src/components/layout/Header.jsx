import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth.jsx";
import { Button } from "react-bootstrap";
import { Navbar, Container } from "react-bootstrap";

export default function Header() {
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
          as={Link}
          to="/"
          style={{ cursor: "pointer", fontWeight: 700, fontSize: "1.3rem" }}
        >
          💰 Bill Bloom
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <div className="ms-auto d-flex align-items-center flex-column flex-md-row gap-3 mt-3 mt-md-0">
            {isAuthenticated ?(
              <>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 36, height: 36, backgroundColor: "#e94560", color: "#fff", fontSize: 15 }}
                >
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-dark small">{user?.username}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-1"
                  onClick={handleLogout}
                >
                  Logout
                </Button> 
              </>
            ): (
              <>
              <Button
                as={Link}
                to="/login"
                variant="outline-primary"
                size="sm"
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/register"
                variant="primary"
                size="sm"
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