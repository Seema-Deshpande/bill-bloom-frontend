import { useState } from "react";
import { Table, Button, Badge, Alert } from "react-bootstrap";
import { getUserById } from "../../data/dummyData";

export default function GroupExpenseLedger({ expenses, isGroupCreator, onDeleteExpense }) {
  const [deletingId, setDeletingId] = useState(null);

  if (!expenses || expenses.length === 0) {
    return (
      <Alert variant="info" className="mt-2">
        No group expenses recorded yet. Add the first expense!
      </Alert>
    );
  }

  const handleDelete = (expense) => {
    if (window.confirm(`Delete "${expense.description || expense.category}"? This cannot be undone.`)) {
      setDeletingId(expense._id);
      onDeleteExpense && onDeleteExpense(expense._id);
      setTimeout(() => setDeletingId(null), 500);
    }
  };

  const categoryColors = {
    Food: "success",
    Transport: "primary",
    Entertainment: "warning",
    Utilities: "secondary",
    Healthcare: "danger",
    Shopping: "info",
    Travel: "dark",
    Education: "light",
    Other: "secondary",
  };

  // Collect unique participant IDs across all expenses, preserving first-seen order
  const allParticipantIds = [...new Set(expenses.flatMap((e) => e.participants || []))];
  const allParticipants = allParticipantIds.map((id) => ({ id, username: getUserById(id)?.username || id }));

  const totalGroupExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPerParticipant = allParticipants.reduce((acc, p) => {
    acc[p.id] = expenses.reduce((sum, e) => {
      if (e.participants?.includes(p.id)) {
        return sum + e.amount / e.participants.length;
      }
      return sum;
    }, 0);
    return acc;
  }, {});

  return (
    <Table striped bordered hover responsive className="mt-2 align-middle">
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Amount (₹)</th>
          <th>Date</th>
          <th>Paid By</th>
          {allParticipants.map((p) => (
            <th key={p.id}>{p.username}</th>
          ))}
          <th>Category</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense, index) => {
          const paidByUser = getUserById(expense.paidBy);
          const splitAmount = expense.participants?.length
            ? (expense.amount / expense.participants.length)
            : 0;
          return (
            <tr key={expense._id} className={deletingId === expense._id ? "table-danger" : ""}>
              <td className="text-muted">{index + 1}</td>
              <td>{expense.description || <span className="text-muted">—</span>}</td>
              <td className="fw-semibold">₹{expense.amount.toLocaleString("en-IN")}</td>
              <td>{new Date(expense.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
              <td>{paidByUser?.username || "Unknown"}</td>
              {allParticipants.map((p) => (
                <td key={p.id} className="text-center">
                  {expense.participants?.includes(p.id)
                    ? <span className="fw-semibold">₹{splitAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                    : <span className="text-muted">—</span>}
                </td>
              ))}
              <td>
                <Badge bg={categoryColors[expense.category] || "secondary"}>
                  {expense.category}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  disabled={!isGroupCreator}
                  title={!isGroupCreator ? "Only the group creator can delete expenses" : "Delete expense"}
                  onClick={() => handleDelete(expense)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot className="table-dark fw-bold">
        <tr>
          <td colSpan={2} className="text-end">Total</td>
          <td colSpan={3}>₹{totalGroupExpense.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
          {allParticipants.map((p) => (
            <td key={p.id} className="text-center">
              ₹{totalPerParticipant[p.id].toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </td>
          ))}
          <td colSpan={2}></td>
        </tr>
      </tfoot>
    </Table>
  );
}
