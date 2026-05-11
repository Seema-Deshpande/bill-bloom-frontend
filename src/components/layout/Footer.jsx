import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-center py-4 mt-auto">
      <Container>
        <p className="footer-tagline mb-2">Bill Bloom — Split smarter, stress less.</p>
        <p className="footer-copy mb-0">&copy; {year} Bill Bloom. All rights reserved.</p>
      </Container>
    </footer>
  );
}
