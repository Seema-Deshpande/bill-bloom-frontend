import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { groups, groupExpenses, personalExpenses, currentUser } from "../data/dummyData";
import useAuth from "../context/useAuth";

const COLORS = ["#e94560", "#4ecdc4", "#a29bfe", "#fdcb6e", "#00b894", "#6c5ce7"];

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const activeUser = user ?? currentUser;

  const myPersonalExpenses = personalExpenses.filter((expense) => expense.userId === activeUser._id);
  const myGroups = groups.filter((group) => group.members.includes(activeUser._id));
  const myGroupExpenses = groupExpenses.filter((expense) => expense.participants.includes(activeUser._id));

  const categoryMap = myPersonalExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const groupSpendData = myGroups.map((group) => {
    const total = myGroupExpenses
      .filter((expense) => expense.groupId === group._id)
      .reduce((sum, expense) => sum + expense.amount / expense.participants.length, 0);

    return {
      name: group.name.length > 10 ? `${group.name.slice(0, 10)}…` : group.name,
      amount: Math.round(total),
    };
  });

  const personalTotal = myPersonalExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const groupTotal = myGroupExpenses.reduce(
    (sum, expense) => sum + expense.amount / expense.participants.length,
    0,
  );

  return (
    <Container fluid="xl" className="py-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: "#1a1a2e" }}>Analytics Dashboard</h2>
        <p className="text-muted mb-0">Insights for your personal and group spending.</p>
      </div>

      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small mb-1">Personal Spend</div>
              <div className="fw-bold fs-3">₹{personalTotal.toLocaleString("en-IN")}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small mb-1">Group Share</div>
              <div className="fw-bold fs-3">₹{Math.round(groupTotal).toLocaleString("en-IN")}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small mb-1">Active Groups</div>
              <div className="fw-bold fs-3">{myGroups.length}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom fw-semibold py-3">Category Split</Card.Header>
            <Card.Body>
              {categoryData.length === 0 ? (
                <Alert variant="info" className="mb-0">No personal expenses available yet.</Alert>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData.map((item, index) => ({
                        ...item,
                        fill: COLORS[index % COLORS.length],
                      }))}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={95}
                      cx="50%"
                      cy="45%"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom fw-semibold py-3">Group Spending</Card.Header>
            <Card.Body>
              {groupSpendData.length === 0 ? (
                <Alert variant="info" className="mb-0">No group spending available yet.</Alert>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupSpendData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Your share"]} />
                    <Bar dataKey="amount" fill="#4ecdc4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}