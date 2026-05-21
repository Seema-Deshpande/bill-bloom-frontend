import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Form } from "react-bootstrap";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Legend,
} from "recharts";
import {
  getMonthlyPersonal, getGroupSpending, getPersonalCategories, getGroupCategories,
} from "../services/analyticsService.js";
import { getGroups } from "../services/groupService.js";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PIE_COLORS = ["#6c63ff", "#e94560", "#43C59E", "#f5a623", "#4facfe", "#f093fb", "#a8edea", "#fd746c"];

function SectionCard({ title, loading, error, children }) {
  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <h6 className="fw-bold text-muted text-uppercase mb-3" style={{ letterSpacing: "0.5px", fontSize: "0.8rem" }}>
          {title}
        </h6>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="mb-0">{error}</Alert>
        ) : (
          children
        )}
      </Card.Body>
    </Card>
  );
}

export default function AnalyticsDashboard() {
  const [monthly, setMonthly] = useState([]);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [monthlyError, setMonthlyError] = useState("");

  const [groupSpend, setGroupSpend] = useState([]);
  const [groupSpendLoading, setGroupSpendLoading] = useState(true);
  const [groupSpendError, setGroupSpendError] = useState("");

  const [personalCat, setPersonalCat] = useState([]);
  const [personalCatLoading, setPersonalCatLoading] = useState(true);
  const [personalCatError, setPersonalCatError] = useState("");

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [groupCat, setGroupCat] = useState([]);
  const [groupCatLoading, setGroupCatLoading] = useState(false);
  const [groupCatError, setGroupCatError] = useState("");

  useEffect(() => {
    getMonthlyPersonal()
      .then((data) => {
        const formatted = (data.data || []).map((d) => ({
          label: `${MONTH_NAMES[(d.month || 1) - 1]} ${d.year}`,
          total: d.total,
        }));
        setMonthly(formatted);
      })
      .catch((e) => setMonthlyError(e.message))
      .finally(() => setMonthlyLoading(false));

    getGroupSpending()
      .then((data) => setGroupSpend(data.data || []))
      .catch((e) => setGroupSpendError(e.message))
      .finally(() => setGroupSpendLoading(false));

    getPersonalCategories()
      .then((data) => setPersonalCat(data.data || []))
      .catch((e) => setPersonalCatError(e.message))
      .finally(() => setPersonalCatLoading(false));

    getGroups()
      .then((data) => {
        const list = data.groups || [];
        setGroups(list);
        if (list.length > 0) setSelectedGroupId(list[0]._id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedGroupId) return;
    setGroupCatLoading(true);
    setGroupCatError("");
    getGroupCategories(selectedGroupId)
      .then((data) => setGroupCat(data.data || []))
      .catch((e) => setGroupCatError(e.message))
      .finally(() => setGroupCatLoading(false));
  }, [selectedGroupId]);

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">Analytics Dashboard</h4>

      <Row className="g-4">
        {/* Monthly Personal Spending */}
        <Col xs={12} lg={6}>
          <SectionCard title="Monthly Personal Spending" loading={monthlyLoading} error={monthlyError}>
            {monthly.length === 0 ? (
              <p className="text-muted text-center py-4">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthly} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Total"]} />
                  <Bar dataKey="total" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </SectionCard>
        </Col>

        {/* Group Spending */}
        <Col xs={12} lg={6}>
          <SectionCard title="Spending by Group" loading={groupSpendLoading} error={groupSpendError}>
            {groupSpend.length === 0 ? (
              <p className="text-muted text-center py-4">No group expenses yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={groupSpend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="groupName" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Total"]} />
                  <Bar dataKey="total" fill="#e94560" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </SectionCard>
        </Col>

        {/* Personal Category Breakdown */}
        <Col xs={12} lg={6}>
          <SectionCard title="Personal Expenses by Category" loading={personalCatLoading} error={personalCatError}>
            {personalCat.length === 0 ? (
              <p className="text-muted text-center py-4">No personal expenses yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={personalCat.map((item, i) => ({ ...item, fill: PIE_COLORS[i % PIE_COLORS.length] }))} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={90} label={({ category }) => category} />
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Total"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </SectionCard>
        </Col>

        {/* Group Category Breakdown */}
        <Col xs={12} lg={6}>
          <SectionCard
            title="Group Expenses by Category"
            loading={groupCatLoading && selectedGroupId !== ""}
            error={groupCatError}
          >
            {groups.length === 0 ? (
              <p className="text-muted text-center py-4">No groups found.</p>
            ) : (
              <>
                <Form.Select
                  size="sm"
                  className="mb-3"
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                >
                  {groups.map((g) => (
                    <option key={g._id} value={g._id}>{g.name}</option>
                  ))}
                </Form.Select>
                {groupCatLoading ? (
                  <div className="d-flex justify-content-center py-4">
                    <Spinner animation="border" size="sm" variant="primary" />
                  </div>
                ) : groupCat.length === 0 ? (
                  <p className="text-muted text-center py-4">No expenses for this group.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={groupCat.map((item, i) => ({ ...item, fill: PIE_COLORS[i % PIE_COLORS.length] }))} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category }) => category} />
                      <Tooltip formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Total"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </>
            )}
          </SectionCard>
        </Col>
      </Row>
    </Container>
  );
}
