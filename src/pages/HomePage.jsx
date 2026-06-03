import { useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGroups } from "../reducers/groupSlice";
import { fetchPersonalAnalytics } from "../reducers/analyticsSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Read from Redux store
  const { user } = useSelector((state) => state.auth);
  const { list: groupsList } = useSelector((state) => state.group);
  const { personal: personalAnalytics } = useSelector((state) => state.analytics);

  useEffect(() => {
    // Dispatch async thunks
    dispatch(fetchAllGroups());
    dispatch(fetchPersonalAnalytics());
  }, [dispatch]);

  // Calculate stats from Redux data
  const calculateStats = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Safely extract data arrays from Redux state
    let personalData = [];
    if (personalAnalytics) {
      // Handle if data is nested or direct array
      if (Array.isArray(personalAnalytics?.data)) {
        personalData = personalAnalytics.data;
      } else if (personalAnalytics?.data?.data && Array.isArray(personalAnalytics.data.data)) {
        personalData = personalAnalytics.data.data;
      }
    }

    let groupsData = [];
    if (groupsList) {
      if (Array.isArray(groupsList?.data)) {
        groupsData = groupsList.data;
      } else if (groupsList?.data?.data && Array.isArray(groupsList.data.data)) {
        groupsData = groupsList.data.data;
      }
    }
    
    const thisMonth = Array.isArray(personalData)
      ? personalData
          .filter((d) => d?.year === currentYear && d?.month === currentMonth)
          .reduce((sum, d) => sum + (d?.total || 0), 0)
      : 0;

    const thisYear = Array.isArray(personalData)
      ? personalData
          .filter((d) => d?.year === currentYear)
          .reduce((sum, d) => sum + (d?.total || 0), 0)
      : 0;

    const groupCount = Array.isArray(groupsData) ? groupsData.length : 0;

    return [
      { label: "My Groups",             value: groupCount,                                         icon: "👥", color: "#4ecdc4", path: "/groups"},
      { label: "Total Groups Joined",   value: groupCount,                                         icon: "🤝", color: "#a29bfe", path: "/groups"   },
      { label: "This Month's Expenses", value: `₹${thisMonth.toLocaleString("en-IN")}`,            icon: "📅", color: "#fdcb6e", path: "/expenses" },
      { label: "This Year's Expenses",  value: `₹${thisYear.toLocaleString("en-IN")}`,             icon: "💸", color: "#e94560", path: "/expenses" },
    ];
  };

  const stats = calculateStats();
  const isLoading = groupsList?.loading || personalAnalytics?.loading;
  const errorMsg = groupsList?.error || personalAnalytics?.error;

  if (isLoading) {
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
    { icon: "➕", label: "Add Personal Expense", path: "/expenses" , onClick: () => navigate("/expenses")},
    { icon: "👥", label: "View My Groups",        path: "/groups", onClick: () => navigate("/groups") },
    { icon: "💳", label: "Create a Group",        path: "/groups",  onClick: () => navigate("/groups") },
    { icon: "📊", label: "Expense Analysis",      path: "/analytics", onClick: () => navigate("/analytics") },
  ];

  return (
    <Container fluid="xl" className="py-4">
      {errorMsg && (
        <Alert variant="danger" dismissible onClose={() => {}} className="mb-4">
          {errorMsg}
        </Alert>
      )}
      {/* Hero */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 d-flex align-items-center justify-content-between"
        style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", color: "#1a1a2e", minHeight: 180, border: "1px solid #dee2e6" }}
      >
        <div>
          <h1 className="fw-bold mb-1" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
            Welcome back,{" "}
            <span style={{ color: "#e94560" }}>{user?.username}</span> 👋
          </h1>
          <p className="text-muted mb-3">Track your personal and group expenses in one place.</p>
          <div className="d-flex gap-2 flex-wrap">
            <Button
              style={{ backgroundColor: "#e94560", border: "none" }}
              onClick={() => navigate("/expenses")}
            >
              Track Expenses
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate("/groups")}>
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
              onClick={() => navigate(stat.path)}
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
              onClick={() => navigate(item.path)}
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

