import { useState, useEffect, useMemo } from "react";
import {
  Container, Row, Col, Card, Button, Alert, Spinner, Modal,
} from "react-bootstrap";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Legend,
} from "recharts";
import PersonalExpenseForm from "../components/expenses/PersonalExpenseForm";
import PersonalExpenseLedger from "../components/expenses/PersonalExpenseLedger";
import { useDispatch, useSelector } from "react-redux";
import {
  createExpense,
  deleteExpense,
  fetchPersonalExpenses,
} from "../reducers/expenseSlice";
import { fetchPersonalAnalytics, fetchPersonalCategoryAnalytics } from "../reducers/analyticsSlice";
import { fetchPersonalAnalysis, clearAnalysis } from "../reducers/aiSlice";
import { toMonthlyChartData, toCategoryChartData } from "../utils/chartUtils";

const PIE_COLORS = [
  "#e94560", "#4ecdc4", "#a29bfe", "#fdcb6e",
  "#00b894", "#6c5ce7", "#fd79a8", "#dfe6e9", "#b2bec3",
];

export default function PersonalExpensesPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const personalExpenses          = useSelector((s) => s.expense.personal);
  const personalAnalytics         = useSelector((s) => s.analytics.personal);
  const personalCategoryAnalytics = useSelector((s) => s.analytics.personalCategories);
  const aiAnalysis                = useSelector((s) => s.ai.analysis);

  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm]             = useState(false);

  const monthlyData  = useMemo(() => toMonthlyChartData(personalAnalytics?.data),         [personalAnalytics?.data]);
  const categoryData = useMemo(() => toCategoryChartData(personalCategoryAnalytics?.data), [personalCategoryAnalytics?.data]);

  useEffect(() => {
    dispatch(fetchPersonalExpenses());
    dispatch(fetchPersonalAnalytics());
    dispatch(fetchPersonalCategoryAnalytics());
  }, [dispatch]);

  const handleAddExpense = async (formData) => {
    const result = await dispatch(
      createExpense({ ...formData, type: "personal", paidBy: user?._id || user?.id })
    );
    if (result.type === createExpense.fulfilled.type) {
      setShowForm(false);
      setSuccessMessage("Expense added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(fetchPersonalExpenses());
      dispatch(fetchPersonalAnalytics());
      dispatch(fetchPersonalCategoryAnalytics());
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    const result = await dispatch(deleteExpense(expenseId));
    if (result.type === deleteExpense.fulfilled.type) {
      setSuccessMessage("Expense deleted.");
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(fetchPersonalExpenses());
      dispatch(fetchPersonalAnalytics());
      dispatch(fetchPersonalCategoryAnalytics());
    }
  };

  const handleAnalyse = () => {
    dispatch(clearAnalysis());
    dispatch(fetchPersonalAnalysis());
  };

  const totalSpent = Array.isArray(personalExpenses?.data)
    ? personalExpenses.data.reduce((sum, e) => sum + (e?.amount || 0), 0)
    : 0;

  if (personalExpenses.loading) {
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
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage("")} className="mb-3">
          {successMessage}
        </Alert>
      )}

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>Personal Expenses</h2>
          <p className="text-muted small mb-0">
            Total:{" "}
            <span className="fw-bold" style={{ color: "#e94560" }}>
              ₹{totalSpent.toLocaleString("en-IN")}
            </span>
            {" "}across {personalExpenses.data?.length || 0}{" "}
            expense{personalExpenses.data?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant="outline-secondary"
            onClick={handleAnalyse}
            disabled={aiAnalysis.loading}
          >
            {aiAnalysis.loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-1" />
                Analysing…
              </>
            ) : (
              "✨ AI Analyse"
            )}
          </Button>
          <Button
            style={{ backgroundColor: "#e94560", border: "none" }}
            onClick={() => setShowForm(true)}
          >
            + Add Expense
          </Button>
        </div>
      </div>

      {/* ── AI Analysis Card ─────────────────────────────────────────────────── */}
      {(aiAnalysis.data || aiAnalysis.error) && (
        <Card
          className="border-0 shadow-sm mb-4"
          style={{ borderLeft: "4px solid #e94560 !important" }}
        >
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <h6 className="fw-bold mb-3" style={{ color: "#1a1a2e" }}>
                ✨ AI Spending Insights
              </h6>
              <Button
                variant="outline-secondary"
                size="sm"
                className="flex-shrink-0"
                onClick={() => dispatch(clearAnalysis())}
              >
                ✕ Dismiss
              </Button>
            </div>

            {aiAnalysis.error && (
              <Alert variant="danger" className="small mb-0">
                {aiAnalysis.error}
              </Alert>
            )}

            {aiAnalysis.data && (
              <>
                {/* Summary text */}
                {aiAnalysis.data.summary && (
                  <p className="text-secondary mb-3" style={{ lineHeight: "1.7" }}>
                    {aiAnalysis.data.summary}
                  </p>
                )}

                {/* Stats row */}
                {aiAnalysis.data.totalSpent != null && (
                  <Row className="g-3 text-center">
                    <Col xs={12} sm={4}>
                      <div className="p-3 rounded" style={{ backgroundColor: "#fff5f7" }}>
                        <div className="small text-muted mb-1">Total Spent</div>
                        <div className="fw-bold fs-5" style={{ color: "#e94560" }}>
                          ₹{Number(aiAnalysis.data.totalSpent).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </Col>
                    {aiAnalysis.data.highestCategory && (
                      <Col xs={12} sm={4}>
                        <div className="p-3 rounded" style={{ backgroundColor: "#f0fff4" }}>
                          <div className="small text-muted mb-1">Highest Category</div>
                          <div className="fw-bold text-success">
                            {aiAnalysis.data.highestCategory.category}
                          </div>
                          <div className="small text-muted">
                            ₹{Number(aiAnalysis.data.highestCategory.total).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </Col>
                    )}
                    {aiAnalysis.data.lowestCategory && (
                      <Col xs={12} sm={4}>
                        <div className="p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                          <div className="small text-muted mb-1">Lowest Category</div>
                          <div className="fw-bold text-secondary">
                            {aiAnalysis.data.lowestCategory.category}
                          </div>
                          <div className="small text-muted">
                            ₹{Number(aiAnalysis.data.lowestCategory.total).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      )}

      {/* ── Add Expense Modal ────────────────────────────────────────────────── */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Body>
          <PersonalExpenseForm
            onSubmit={handleAddExpense}
            onCancel={() => setShowForm(false)}
          />
        </Modal.Body>
      </Modal>

      {/* ── Analytics Charts ─────────────────────────────────────────────────── */}
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
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Spent"]} />
                    <Bar dataKey="total" fill="#4ecdc4" radius={[4, 4, 0, 0]} />
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
              {categoryData.length === 0 ? (
                <Alert variant="info" className="small">No data to chart yet.</Alert>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData.map((item, index) => ({
                        ...item,
                        fill: PIE_COLORS[index % PIE_COLORS.length],
                      }))}
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

      {/* ── Expense Ledger ───────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom fw-semibold py-3">
          📋 Expense Ledger
        </Card.Header>
        <Card.Body className="p-3">
          <PersonalExpenseLedger
            expenses={personalExpenses.data || []}
            onDeleteExpense={handleDeleteExpense}
          />
        </Card.Body>
      </Card>
    </Container>
  );
}
