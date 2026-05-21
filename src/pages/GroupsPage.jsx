import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert, Spinner, Card, Modal } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import GroupCard from "../components/groups/GroupCard";
import CreateGroupForm from "../components/groups/CreateGroupForm";
import EditGroupForm from "../components/groups/EditGroupForm";
import { getGroups, createGroup, updateGroup, deleteGroup } from "../services/groupService";
import { getGroupSpending } from "../services/analyticsService";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [successAlert, setSuccessAlert] = useState("");
  const [chartData, setChartData] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [deletingGroup, setDeletingGroup] = useState(null);

  const fetchGroups = async () => {
    try {
      const data = await getGroups();
      setGroups(data.groups || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChart = async () => {
    try {
      const data = await getGroupSpending();
      setChartData(
        (data.data || []).map((d) => ({
          name: d.groupName.length > 12 ? d.groupName.slice(0, 12) + "..." : d.groupName,
          amount: Math.round(d.total),
        }))
      );
    } catch {}
  };

  useEffect(() => {
    fetchGroups();
    fetchChart();
  }, []);

  const handleCreateGroup = async (payload) => {
    try {
      await createGroup(payload);
      setShowForm(false);
      setSuccessAlert(`Group "${payload.name}" created successfully!`);
      setTimeout(() => setSuccessAlert(""), 3000);
      fetchGroups();
      fetchChart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditGroup = async (payload) => {
    try {
      await updateGroup(editingGroup._id, payload);
      setEditingGroup(null);
      setSuccessAlert(`Group "${payload.name}" updated successfully!`);
      setTimeout(() => setSuccessAlert(""), 3000);
      fetchGroups();
      fetchChart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(deletingGroup._id);
      setDeletingGroup(null);
      setSuccessAlert(`Group "${deletingGroup.name}" deleted successfully!`);
      setTimeout(() => setSuccessAlert(""), 3000);
      fetchGroups();
      fetchChart();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#e94560" }} />
          <p className="mt-2 text-muted">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <Container fluid="xl" className="py-4">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
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

      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Body>
          <CreateGroupForm onSubmit={handleCreateGroup} onCancel={() => setShowForm(false)} />
        </Modal.Body>
      </Modal>

      <Modal show={!!editingGroup} onHide={() => setEditingGroup(null)} centered>
        <Modal.Body>
          {editingGroup && (
            <EditGroupForm
              group={editingGroup}
              onSubmit={handleEditGroup}
              onCancel={() => setEditingGroup(null)}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={!!deletingGroup} onHide={() => setDeletingGroup(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{deletingGroup?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletingGroup(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteGroup}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {chartData.length > 0 && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white border-bottom fw-semibold py-3">
            Your Spending Across Groups
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`Rs.${value.toLocaleString("en-IN")}`, "Total"]} />
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
                onEdit={setEditingGroup}
                onDelete={setDeletingGroup}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
