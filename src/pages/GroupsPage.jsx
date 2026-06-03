import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner, Card, Modal } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import GroupCard from "../components/groups/GroupCard";
import CreateGroupForm from "../components/groups/CreateGroupForm";
import EditGroupForm from "../components/groups/EditGroupForm";
import { fetchAllGroups, createGroup, updateGroup, deleteGroup } from "../reducers/groupSlice";
import { fetchGroupAnalytics } from "../reducers/analyticsSlice";

export default function GroupsPage() {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [deletingGroup, setDeletingGroup] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Read from Redux store
  const { list: groupsList, create: createState, update: updateState, delete: deleteState } = useSelector((state) => state.group);
  const { group: groupAnalytics } = useSelector((state) => state.analytics);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchAllGroups());
    dispatch(fetchGroupAnalytics());
  }, [dispatch]);

  // Handle create group
  const handleCreateGroup = async (payload) => {
    const result = await dispatch(createGroup(payload));
    if (result.type === createGroup.fulfilled.type) {
      setShowForm(false);
      setSuccessMessage("Group created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(fetchAllGroups());
      dispatch(fetchGroupAnalytics());
    }
  };

  // Handle update group
  const handleEditGroup = async (payload) => {
    if (!editingGroup) return;
    const result = await dispatch(updateGroup({ groupId: editingGroup._id, groupData: payload }));
    if (result.type === updateGroup.fulfilled.type) {
      setEditingGroup(null);
      setShowEditModal(false);
      setSuccessMessage("Group updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(fetchAllGroups());
    }
  };

  // Handle delete group
  const handleDeleteGroup = async (groupId) => {
    const result = await dispatch(deleteGroup(groupId));
    if (result.type === deleteGroup.fulfilled.type) {
      setDeletingGroup(null);
      setShowDeleteConfirm(false);
      setSuccessMessage("Group deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(fetchAllGroups());
      dispatch(fetchGroupAnalytics());
    }
  };

  // Transform analytics data for chart
  let analyticsData = [];
  if (groupAnalytics?.data) {
    // Handle both nested { data: [] } and direct array [] structures
    if (Array.isArray(groupAnalytics.data)) {
      analyticsData = groupAnalytics.data;
    } else if (groupAnalytics.data?.data && Array.isArray(groupAnalytics.data.data)) {
      analyticsData = groupAnalytics.data.data;
    }
  }
  
  const chartData = analyticsData.map((d) => ({
    name: d.groupName?.length > 12 ? d.groupName.slice(0, 12) + "..." : d.groupName,
    amount: Math.round(d.total || 0),
  }));

  const isLoading = groupsList?.loading;
  const errorMsg = groupsList?.error || createState?.error || updateState?.error || deleteState?.error;

  if (isLoading) {
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
      {errorMsg && (
        <Alert variant="danger" dismissible onClose={() => {}} className="mb-3">
          {errorMsg}
        </Alert>
      )}
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage("")} className="mb-3">
          {successMessage}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>My Groups</h2>
          <p className="text-muted small mb-0">
            {Array.isArray(groupsList?.data) ? groupsList.data.length : 0} group{Array.isArray(groupsList?.data) && groupsList.data.length !== 1 ? "s" : ""} in total
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
          <CreateGroupForm onSubmit={handleCreateGroup} onCancel={() => setShowForm(false)} loading={createState.loading} />
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Body>
          {editingGroup && (
            <EditGroupForm
              group={editingGroup}
              onSubmit={handleEditGroup}
              onCancel={() => setShowEditModal(false)}
              loading={updateState.loading}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{deletingGroup?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletingGroup(null)}>Cancel</Button>
          <Button 
            variant="danger" 
            onClick={() => handleDeleteGroup(deletingGroup._id)}
            disabled={deleteState.loading}
          >
            {deleteState.loading ? "Deleting..." : "Delete"}
          </Button>
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

      {Array.isArray(groupsList?.data) && groupsList.data.length === 0 ? (
        <Alert variant="info">No groups yet. Create your first group using the button above!</Alert>
      ) : Array.isArray(groupsList?.data) ? (
        <Row className="g-3">
          {groupsList.data.map((group) => (
            <Col key={group._id} xs={12} sm={6} lg={4}>
              <GroupCard
                group={group}
                onEdit={(g) => {
                  setEditingGroup(g);
                  setShowEditModal(true);
                }}
                onDelete={(g) => {
                  setDeletingGroup(g);
                  setShowDeleteConfirm(true);
                }}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="warning">Unable to load groups. Please try refreshing the page.</Alert>
      )}
    </Container>
  );
}
