import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Card, Button, Spinner, Alert, Modal, Form
} from "react-bootstrap";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroupById,
  updateGroup,
  deleteGroup,
} from "../reducers/groupSlice";
import {  
  createExpense,
  deleteExpense,
  fetchGroupExpenses,
} from "../reducers/expenseSlice";
import {
  calculateSettlements,
  recordSettlement,
  fetchGroupSettlementHistory,
} from "../reducers/settlementSlice";
import {
  fetchGroupCategoryAnalytics
} from "../reducers/analyticsSlice";
import GroupExpenseForm from "../components/expenses/GroupExpenseForm";
import GroupExpenseLedger from "../components/expenses/GroupExpenseLedger";
import SettlementSummary from "../components/settlements/SettlementSummary";
import PayConfirmation from "../components/settlements/PayConfirmation";
import { toCategoryChartData } from "../utils/chartUtils";

const PIE_COLORS = ["#e94560", "#4ecdc4", "#a29bfe", "#fdcb6e", "#00b894", "#6c5ce7", "#fd79a8"];

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { detail: groupDetail } = useSelector((state) => state.group);
  const expenseGroupData = useSelector((state) => state.expense.group.data);
  const analyticsData = useSelector((state) => state.analytics.groupCategories);
  const settlementCalculatedData = useSelector((state) => state.settlement.calculated.data);
  const settlementHistoryData = useSelector((state) => state.settlement.history.data);
  
  // Memoized selectors to prevent unnecessary rerenders
  const groupExpenses = useMemo(
    () => expenseGroupData?.[groupId] ?? [],
    [expenseGroupData, groupId]
  );
  
  const groupCategories = useMemo(
    () => analyticsData,
    [analyticsData]
  );
  
  const calculatedSettlements = useMemo(
    () => settlementCalculatedData?.[groupId] ?? [],
    [settlementCalculatedData, groupId]
  );
  
  const settlementsHistory = useMemo(
    () => settlementHistoryData?.[groupId] ?? [],
    [settlementHistoryData, groupId]
  );

  const pieData = useMemo(
    () => toCategoryChartData(groupCategories?.data?.[groupId]),
    [groupCategories?.data, groupId]
  );

  const [successMessage, setSuccessMessage] = useState("");

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettleConfirm, setShowSettleConfirm] = useState(false);
  const [showSettlements, setShowSettlements] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    dispatch(fetchGroupById(groupId));
    dispatch(fetchGroupExpenses(groupId));
    dispatch(fetchGroupCategoryAnalytics(groupId));
    dispatch(calculateSettlements(groupId));
    dispatch(fetchGroupSettlementHistory(groupId));
  }, [dispatch, groupId]);

  const handleAddExpense = async (formData) => {
    const result = await dispatch(createExpense({ 
      ...formData, 
      type: "group", 
      groupId, 
      paidBy: formData.paidBy 
    }));
    if (result.type === createExpense.fulfilled.type) {
      setShowExpenseForm(false);
      setSuccessMessage("Expense added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(fetchGroupExpenses(groupId));
      dispatch(fetchGroupCategoryAnalytics(groupId));
      dispatch(calculateSettlements(groupId));
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    const result = await dispatch(deleteExpense(expenseId));
    if (result.type === deleteExpense.fulfilled.type) {
      setSuccessMessage("Expense deleted.");
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(fetchGroupExpenses(groupId));
      dispatch(fetchGroupCategoryAnalytics(groupId));
      dispatch(calculateSettlements(groupId));
    }
  };

  const handleEditSave = async () => {
    if (!editName.trim()) return;
    const result = await dispatch(updateGroup({ 
      groupId, 
      groupData: { name: editName.trim() } 
    }));
    if (result.type === updateGroup.fulfilled.type) {
      setShowEditModal(false);
      setSuccessMessage("Group name updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleDeleteGroup = async () => {
    const result = await dispatch(deleteGroup(groupId));
    if (result.type === deleteGroup.fulfilled.type) {
      navigate("/groups");
    }
  };

  const handleOpenSettlements = async () => {
    setShowSettleConfirm(false);
    setShowSettlements(true);
  };

  const handlePayConfirm = async (settlement) => {
    const result = await dispatch(recordSettlement({
      fromId: settlement.from,
      toId: settlement.to,
      amount: settlement.amount,
      groupId,
    }));
    if (result.type === recordSettlement.fulfilled.type) {
      setSelectedPayment(null);
      setSuccessMessage(`Payment of Rs.${settlement.amount.toLocaleString("en-IN")} recorded!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(calculateSettlements(groupId));
      dispatch(fetchGroupSettlementHistory(groupId));
    }
  };

  if (groupDetail.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#e94560" }} />
          <p className="mt-2 text-muted">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (!groupDetail.data) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{groupDetail.error || "Group not found."}</Alert>
        <Button variant="link" onClick={() => navigate("/groups")}>Back to Groups</Button>
      </Container>
    );
  }

  const group = groupDetail.data;
  const memberMap = {};
  (group.members || []).forEach((m) => {
    memberMap[m._id] = m.username;
  });

  // Fix: Handle createdBy - could be a string ID or an object
  let creatorName = "Unknown";
  if (group.createdBy) {
    if (typeof group.createdBy === 'object' && group.createdBy.username) {
      creatorName = group.createdBy.username;
    } else {
      const createdById = group.createdBy?._id || group.createdBy;
      creatorName = memberMap[createdById] || "Unknown";
    }
  }

  const isGroupCreator = (group.createdBy?._id || group.createdBy) === (user?._id || user?.id);

  return (
    <Container fluid="xl" className="py-4">
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage("")} className="mb-3">
          {successMessage}
        </Alert>
      )}

      {/* Group header */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="d-flex flex-wrap align-items-start justify-content-between gap-3 p-4">
          <div>
            <h3 className="fw-bold mb-1" style={{ color: "#1a1a2e" }}>{group.name}</h3>
            <p className="text-muted small mb-1">
              Created by <strong>{creatorName}</strong>
            </p>
            <p className="text-muted small mb-0">
              {group.members?.length} member{group.members?.length !== 1 ? "s" : ""}:{" "}
              {(group.members || []).map((m) => m.username || m.name || memberMap[m._id || m] || m).join(", ")}
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {isGroupCreator && (
              <>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => { setEditName(groupDetail.data?.name ?? ""); setShowEditModal(true); }}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </Button>
              </>
            )}
            <Button variant="outline-primary" size="sm" onClick={() => navigate("/groups")}>
              Back
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Settlement Section */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Settlements</span>
          {!showSettlements && (
            <Button
              style={{ backgroundColor: "#e94560", border: "none" }}
              size="sm"
              onClick={() => setShowSettleConfirm(true)}
            >
              Make Final Settlement
            </Button>
          )}
        </Card.Header>
        {showSettlements && (
          <Card.Body>
            <h6 className="fw-semibold mb-3">Outstanding Balances</h6>
            <SettlementSummary
              settlements={calculatedSettlements}
              members={memberMap}
              currentUserId={user?._id || user?.id}
              onPay={(s) => setSelectedPayment(s)}
            />
            {settlementsHistory.length > 0 && (
              <>
                <h6 className="fw-semibold mt-4 mb-3">Payment History</h6>
                <div className="table-responsive rounded" style={{ border: "1px solid #b2dfdb" }}>
                  <table className="table table-sm table-hover mb-0 table-success">
                    <thead className="table-success">
                      <tr>
                        <th className="py-2 px-3">From</th>
                        <th className="py-2 px-3">To</th>
                        <th className="py-2 px-3">Amount</th>
                        <th className="py-2 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(settlementsHistory) ? settlementsHistory.map((s) => (
                        <tr key={s._id}>
                          <td className="py-2 px-3 fw-semibold text-danger">
                            {s.fromUser?.username || memberMap[s.fromUser?._id] || "?"}
                          </td>
                          <td className="py-2 px-3 fw-semibold text-success">
                            {s.toUser?.username || memberMap[s.toUser?._id] || "?"}
                          </td>
                          <td className="py-2 px-3">
                            <span className="badge bg-success">
                              Rs.{s.amount.toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-muted small">
                            {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="text-center py-3 text-muted">
                            No settlement history yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card.Body>
        )}
      </Card>

      {/* Category Pie Chart */}
      {pieData.length > 0 && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white border-bottom fw-semibold py-3">
            Spending by Category
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={Array.isArray(pieData) ? pieData.map((item, i) => ({ ...item, fill: PIE_COLORS[i % PIE_COLORS.length] })) : []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={80}
                  label={({ name }) => name} />
                <Tooltip formatter={(v) => [`Rs.${v.toLocaleString("en-IN")}`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      )}

      {/* Expense Ledger */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Expenses</span>
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
            expenses={groupExpenses}
            members={group.members || []}
            isGroupCreator={isGroupCreator}
            onDeleteExpense={handleDeleteExpense}
          />
        </Card.Body>
      </Card>

      {/* Add Expense Modal */}
      <Modal show={showExpenseForm} onHide={() => setShowExpenseForm(false)} centered>
        <Modal.Body>
          <GroupExpenseForm
            members={group.members || []}
            groupId={groupId}
            onSubmit={handleAddExpense}
            onCancel={() => setShowExpenseForm(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Settlement Confirm Modal */}
      <Modal show={showSettleConfirm} onHide={() => setShowSettleConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Final Settlement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Calculate the optimal payments to settle all debts in this group?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowSettleConfirm(false)}>
            Cancel
          </Button>
          <Button style={{ backgroundColor: "#e94560", border: "none" }} onClick={handleOpenSettlements}>
            Calculate
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Group Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Group Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Group name"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button
            style={{ backgroundColor: "#e94560", border: "none" }}
            onClick={handleEditSave}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{group.name}</strong>? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteGroup}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pay Confirmation Modal */}
      <PayConfirmation
        settlement={selectedPayment}
        members={memberMap}
        onConfirm={handlePayConfirm}
        onCancel={() => setSelectedPayment(null)}
      />
    </Container>
  );
}

