import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { groups as allGroups, personalExpenses as allPersonalExpenses, groupExpenses, currentUser } from "../data/dummyData";
import useAuth from "../context/useAuth";

export default function HomePage({ onNavigate }) {
  const { user } = useAuth();
  const activeUser = user ?? currentUser;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const myGroups = allGroups.filter((g) => g.members.includes(activeUser._id));
      const totalPersonal = allPersonalExpenses
        .filter((e) => e.userId === activeUser._id)
        .reduce((sum, e) => sum + e.amount, 0);
      const totalGroup = groupExpenses
        .filter((e) => e.participants.includes(activeUser._id))
        .reduce((sum, e) => sum + e.amount / e.participants.length, 0);

      const now = new Date();
      const myPersonal = allPersonalExpenses.filter((e) => e.userId === activeUser._id);
      const currentMonthSpent = myPersonal
        .filter((e) => {
          const d = new Date(e.date);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        })
        .reduce((sum, e) => sum + e.amount, 0);
      const currentYearSpent = myPersonal
        .filter((e) => new Date(e.date).getFullYear() === now.getFullYear())
        .reduce((sum, e) => sum + e.amount, 0);

      setStats([
        { label: "My Groups",              value: myGroups.length,                                          icon: "👥", color: "#4ecdc4",  action: "Groups"   },
        { label: "Group Share",            value: `₹${Math.round(totalGroup).toLocaleString("en-IN")}`,    icon: "🤝", color: "#a29bfe",  action: "Groups"   },
        { label: "This Month's Expenses",  value: `₹${currentMonthSpent.toLocaleString("en-IN")}`,         icon: "📅", color: "#fdcb6e",  action: "Personal" },
        { label: "This Year's Expenses",   value: `₹${currentYearSpent.toLocaleString("en-IN")}`,          icon: "💸", color: "#e94560",  action: "Personal" },
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [activeUser._id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#e94560" }} />
          <p className="mt-2 text-muted">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    { icon: "➕", label: "Add Personal Expense", action: "Personal" },
    { icon: "👥", label: "View My Groups",        action: "Groups"   },
    { icon: "💳", label: "Create a Group",        action: "Groups"   },
    { icon: "📊", label: "Expense Analysis",      action: "Personal" },
  ];

  return (
    <Container fluid="xl" className="py-4">
      {/* Hero */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 d-flex align-items-center justify-content-between"
        style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", color: "#1a1a2e", minHeight: 180, border: "1px solid #dee2e6" }}
      >
        <div>
          <h1 className="fw-bold mb-1" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
            Welcome back,{" "}
            <span style={{ color: "#e94560" }}>{activeUser.username}</span> 👋
          </h1>
          <p className="text-muted mb-3">Track your personal and group expenses in one place.</p>
          <div className="d-flex gap-2 flex-wrap">
            <Button
              style={{ backgroundColor: "#e94560", border: "none" }}
              onClick={() => onNavigate && onNavigate("Personal")}
            >
              Track Expenses
            </Button>
            <Button variant="outline-secondary" onClick={() => onNavigate && onNavigate("Groups")}>
              View Groups
            </Button>
          </div>
        </div>
        <div style={{ fontSize: "clamp(3rem, 8vw, 5rem)", opacity: 0.35 }}>💰</div>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-4">
        {stats.map((stat) => (
          <Col key={stat.label} xs={6} lg={3}>
            <Card
              className="h-100 border-0 shadow-sm text-center p-3"
              style={{ cursor: "pointer", transition: "transform 0.15s" }}
              onClick={() => onNavigate && onNavigate(stat.action)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = ""}
            >
              <div
                className="rounded-3 d-flex align-items-center justify-content-center mx-auto mb-2"
                style={{ width: 44, height: 44, backgroundColor: `${stat.color}22`, fontSize: 22 }}
              >
                {stat.icon}
              </div>
              <div className="fw-bold fs-4" style={{ color: "#1a1a2e" }}>{stat.value}</div>
              <div className="text-muted small">{stat.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <h5 className="fw-bold mb-3">Quick Actions</h5>
      <Row className="g-3">
        {quickActions.map((item) => (
          <Col key={item.label} xs={6} sm={3}>
            <Card
              className="border-0 shadow-sm text-center p-3 h-100"
              style={{ cursor: "pointer", transition: "transform 0.15s" }}
              onClick={() => onNavigate && onNavigate(item.action)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = ""}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>{item.icon}</div>
              <div className="small fw-semibold" style={{ color: "#1a1a2e" }}>{item.label}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

