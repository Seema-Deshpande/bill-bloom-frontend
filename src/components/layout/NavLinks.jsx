import { Nav, Container } from "react-bootstrap";

const NAV_ITEMS = [
  { key: "Home", label: "Home" },
  { key: "Groups", label: "Groups" },
  { key: "Personal", label: "Personal" },
];

export default function NavLinks({ activePage, onNavigate }) {
  return (
    <div className="bg-white border-bottom mt-3">
      <Container fluid="xl">
        <Nav variant="tabs" className="border-bottom-0">
          {NAV_ITEMS.map((item) => (
            <Nav.Item key={item.key}>
              <Nav.Link
                active={activePage === item.key}
                onClick={() => onNavigate && onNavigate(item.key)}
                className={activePage === item.key ? "fw-bold" : ""}
              >
                {item.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Container>
    </div>
  );
}
