import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal } from "react-bootstrap";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getUserById, groupExpenses as allGroupExpenses, currentUser, computeGroupSettlements } from "../data/dummyData";
import GroupExpenseForm from "../components/expenses/GroupExpenseForm";
import GroupExpenseLedger from "../components/expenses/GroupExpenseLedger";
import SettlementSummary from "../components/settlements/SettlementSummary";
import PayConfirmation from "../components/settlements/PayConfirmation";
import useAuth from "../context/useAuth";

const PIE_COLORS = ["#e94560", "#4ecdc4", "#a29bfe", "#fdcb6e", "#00b894", "#6c5ce7", "#fd79a8"];

export default function GroupDetailPage({ group, onBack }) {
  const { user } = useAuth();
  const activeUser = user ?? currentUser;
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [successAlert, setSuccessAlert] = useState("");
  const [showSettlements, setShowSettlements] = useState(false);
  const [showSettleConfirm, setShowSettleConfirm] = useState(false);
  const [completedSettlements, setCompletedSettlements] = useState([]);

  useEffect(() => {
    if (!group) return;
    const timer = setTimeout(() => {
      setExpenses(allGroupExpenses.filter((e) => e.groupId === group._id));
      const newSettlements = computeGroupSettlements(group._id);
      setSettlements(newSettlements);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [group]);

  // Dependency-based: re-compute settlements when expenses change
  useEffect(() => {
    if (!group) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettlements(computeGroupSettlements(group._id));
  }, [expenses, group]);

  if (!group) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">No group selected. Please go back and select a group.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#e94560" }} />
          <p className="mt-2 text-muted">Loading group details…</p>
        </div>
      </div>
    );
  }

  const creator = getUserById(group.creator);
  const members = group.members.map((id) => getUserById(id)).filter(Boolean);
  const isGroupCreator = activeUser._id === group.creator;

  // Category pie chart data
  const categoryMap = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const handleAddExpense = (expenseData) => {
    const newExpense = {
      _id: `ge${Date.now()}`,
      groupId: group._id,
      ...expenseData,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setShowExpenseForm(false);
    setSuccessAlert("Expense added successfully!");
    setTimeout(() => setSuccessAlert(""), 3000);
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
    setSuccessAlert("Expense deleted.");
    setTimeout(() => setSuccessAlert(""), 2000);
  };

  const handlePayConfirm = (settlement) => {
    setSettlements((prev) => prev.filter((s) => s.id !== settlement.id));
    setCompletedSettlements((prev) => [...prev, { ...settlement, paidAt: new Date().toISOString() }]);
    setSelectedPayment(null);
    setSuccessAlert(`Payment of ₹${settlement.amount.toLocaleString("en-IN")} confirmed!`);
    setTimeout(() => setSuccessAlert(""), 3000);
  };

  return (
    <Container fluid="xl" className="py-4">
      {/* Back button */}
      {onBack && (
        <Button variant="link" className="mb-3 p-0 text-muted" onClick={onBack}>
          ← Back to Groups
        </Button>
      )}

      {successAlert && (
        <Alert variant="success" dismissible onClose={() => setSuccessAlert("")} className="mb-3">
          {successAlert}
        </Alert>
      )}

      {/* Group header */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <h3 className="fw-bold mb-1" style={{ color: "#1a1a2e" }}>{group.name}</h3>
          <p className="text-muted mb-0 small">
            Created by{" "}
            <span className="fw-semibold text-dark">{creator?.username || "Unknown"}</span>
          </p>
        </Card.Body>
      </Card>

      {/* Members */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-bottom fw-semibold py-3">👥 Members</Card.Header>
        <Card.Body className="p-3">
          <Row xs={2} sm={3} md={4} className="g-2">
            {members.map((user) => (
              <Col key={user._id}>
                <div className="border rounded p-2 text-center small fw-semibold">
                  {user.username}
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Pie Chart */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-bottom fw-semibold py-3">
          📊 Expense by Category
        </Card.Header>
        <Card.Body className="p-3">
          {pieData.length === 0 ? (
            <Alert variant="info" className="small">No expenses yet to visualize.</Alert>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData.map((item, index) => ({ ...item, fill: PIE_COLORS[index % PIE_COLORS.length] }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                />
                <Tooltip formatter={(val) => `₹${val.toLocaleString("en-IN")}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card.Body>
      </Card>

      {/* Settlements */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-3 d-flex flex-column align-items-start gap-3">
          <Button
            variant="danger"
            style={{ backgroundColor: "#e94560", border: "none" }}
            onClick={() => setShowSettleConfirm(true)}
          >
            💰 Make Final Settlement
          </Button>
          {showSettlements && (
            <div className="w-100">
              <SettlementSummary
                settlements={settlements}
                completedSettlements={completedSettlements}
                currentUserId={activeUser._id}
                onPay={(s) => setSelectedPayment(s)}
              />
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Settle Confirm Modal */}
      <Modal show={showSettleConfirm} onHide={() => setShowSettleConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Settlement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to finalize settlements for this group? This will display the full settlement summary.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettleConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            style={{ backgroundColor: "#e94560", border: "none" }}
            onClick={() => {
              setShowSettleConfirm(false);
              setShowSettlements(true);
            }}
          >
            Settle Now
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Expense Ledger - Full Width */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
          <span className="fw-semibold">📒 Expense Ledger</span>
          <Button
            size="sm"
            style={{ backgroundColor: "#e94560", border: "none" }}
            onClick={() => setShowExpenseForm(true)}
          >
            + Add Expense
          </Button>
        </Card.Header>
        <Card.Body className="p-3">
          <GroupExpenseLedger
            expenses={expenses}
            members={members}
            isGroupCreator={isGroupCreator}
            onDelete={handleDeleteExpense}
          />
        </Card.Body>
      </Card>

      {/* Add Expense Modal */}
      <Modal show={showExpenseForm} onHide={() => setShowExpenseForm(false)} centered>
        <Modal.Body>
          <GroupExpenseForm
            members={members}
            onSubmit={handleAddExpense}
            onCancel={() => setShowExpenseForm(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Pay Confirmation Modal */}
      <PayConfirmation
        settlement={selectedPayment}
        onConfirm={handlePayConfirm}
        onCancel={() => setSelectedPayment(null)}
      />
    </Container>
  );
}

