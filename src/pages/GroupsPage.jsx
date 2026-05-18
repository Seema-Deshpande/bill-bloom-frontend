import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert, Spinner, Card, Modal } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import GroupCard from "../components/groups/GroupCard";
import CreateGroupForm from "../components/groups/CreateGroupForm";
import { groups as rawGroups, groupExpenses, currentUser } from "../data/dummyData";
import useAuth from "../context/useAuth";

export default function GroupsPage({ onNavigate }) {
  const { user } = useAuth();
  const activeUser = user ?? currentUser;
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successAlert, setSuccessAlert] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setGroups(rawGroups.filter((g) => g.members.includes(activeUser._id)));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeUser._id]);

  const handleCreateGroup = (payload) => {
    const newGroup = {
      _id: `g${Date.now()}`,
      name: payload.name,
      creator: activeUser._id,
      members: Array.from(new Set([activeUser._id, ...payload.memberIds])),
      createdAt: new Date().toISOString(),
    };
    setGroups((prev) => [newGroup, ...prev]);
    setShowForm(false);
    setSuccessAlert(`Group "${payload.name}" created successfully!`);
    setTimeout(() => setSuccessAlert(""), 3000);
  };

  // Bar chart data: user's share of spending per group
  const chartData = groups
    .filter((g) => g.members.includes(activeUser._id))
    .map((g) => {
      const expenses = groupExpenses.filter(
        (e) => e.groupId === g._id && e.participants.includes(activeUser._id)
      );
      const total = expenses.reduce((sum, e) => sum + e.amount / e.participants.length, 0);
      return { name: g.name.length > 12 ? g.name.slice(0, 12) + "…" : g.name, amount: Math.round(total) };
    });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#e94560" }} />
          <p className="mt-2 text-muted">Loading groups…</p>
        </div>
      </div>
    );
  }

  return (
    <Container fluid="xl" className="py-4">
      {successAlert && (
        <Alert variant="success" dismissible onClose={() => setSuccessAlert("")} className="mb-3">
          {successAlert}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>My Groups</h2>
          <p className="text-muted small mb-0">
            {groups.length} group{groups.length !== 1 ? "s" : ""} in total
          </p>
        </div>
        <Button
          style={{ backgroundColor: "#e94560", border: "none" }}
          onClick={() => setShowForm(true)}
        >
          + New Group
        </Button>
      </div>

      {/* Create Group Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Body>
          <CreateGroupForm onSubmit={handleCreateGroup} onCancel={() => setShowForm(false)} />
        </Modal.Body>
      </Modal>

      {/* Group spending bar chart */}
      {chartData.length > 0 && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white border-bottom fw-semibold py-3">
            📊 Your Spending Across Groups
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Your Share"]} />
                <Bar dataKey="amount" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      )}

      {groups.length === 0 ? (
        <Alert variant="info">No groups yet. Create your first group using the button above!</Alert>
      ) : (
        <Row className="g-3">
          {groups.map((group) => (
            <Col key={group._id} xs={12} sm={6} lg={4}>
              <GroupCard
                group={group}
                onOpenGroup={(g) => onNavigate && onNavigate("GroupDetail", g)}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

