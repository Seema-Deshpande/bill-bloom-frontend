import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner, Modal } from "react-bootstrap";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Legend,
} from "recharts";
import PersonalExpenseForm from "../components/expenses/PersonalExpenseForm";
import PersonalExpenseLedger from "../components/expenses/PersonalExpenseLedger";
import { personalExpenses as rawExpenses, currentUser } from "../data/dummyData";
import useAuth from "../context/useAuth";

const PIE_COLORS = ["#e94560", "#4ecdc4", "#a29bfe", "#fdcb6e", "#00b894", "#6c5ce7", "#fd79a8", "#dfe6e9", "#b2bec3"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function PersonalExpensesPage() {
  const { user } = useAuth();
  const activeUser = user ?? currentUser;
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successAlert, setSuccessAlert] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpenses(rawExpenses.filter((e) => e.userId === activeUser._id));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeUser._id]);

  const handleAddExpense = (data) => {
    const newExpense = { _id: `pe${Date.now()}`, userId: activeUser._id, ...data, createdAt: new Date().toISOString() };
    setExpenses((prev) => [newExpense, ...prev]);
    setShowForm(false);
    setSuccessAlert("Expense added successfully!");
    setTimeout(() => setSuccessAlert(""), 3000);
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
    setSuccessAlert("Expense deleted.");
    setTimeout(() => setSuccessAlert(""), 2000);
  };

  // Monthly bar chart data
  const monthlyMap = expenses.reduce((acc, e) => {
    const month = new Date(e.date).getMonth();
    acc[month] = (acc[month] || 0) + e.amount;
    return acc;
  }, {});
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([month, amount]) => ({ name: MONTH_LABELS[Number(month)], amount }));

  // Category pie chart data
  const categoryMap = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#e94560" }} />
          <p className="mt-2 text-muted">Loading expenses…</p>
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
          <h2 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>Personal Expenses</h2>
          <p className="text-muted small mb-0">
            Total:{" "}
            <span className="fw-bold" style={{ color: "#e94560" }}>
              ₹{totalSpent.toLocaleString("en-IN")}
            </span>
            {" "}across {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          style={{ backgroundColor: "#e94560", border: "none" }}
          onClick={() => setShowForm(true)}
        >
          + Add Expense
        </Button>
      </div>

      {/* Add Expense Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Body>
          <PersonalExpenseForm
            onSubmit={handleAddExpense}
            onCancel={() => setShowForm(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Analytics Charts */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={7}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom fw-semibold py-3">
              📅 Monthly Expenses
            </Card.Header>
            <Card.Body>
              {monthlyData.length === 0 ? (
                <Alert variant="info" className="small">No data to chart yet.</Alert>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Spent"]} />
                    <Bar dataKey="amount" fill="#4ecdc4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={5}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom fw-semibold py-3">
              🍕 Category Breakdown
            </Card.Header>
            <Card.Body>
              {pieData.length === 0 ? (
                <Alert variant="info" className="small">No data to chart yet.</Alert>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData.map((item, index) => ({ ...item, fill: PIE_COLORS[index % PIE_COLORS.length] }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={90}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    />
                    <Tooltip formatter={(val) => `₹${val.toLocaleString("en-IN")}`} />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Expense Ledger */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom fw-semibold py-3">
          📋 Expense Ledger
        </Card.Header>
        <Card.Body className="p-3">
          <PersonalExpenseLedger
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
          />
        </Card.Body>
      </Card>
    </Container>
  );
}
