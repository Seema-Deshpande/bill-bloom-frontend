import { Table, Button } from "react-bootstrap";
import "../../App.css";
import { getUserById } from "../../data/dummyData";

export default function GroupExpenseLedger({ groupId, expenses, members, isGroupCreator, onDelete }) {
  const filteredExpenses = expenses.filter((e) => e.groupId === groupId);

  if (filteredExpenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses yet. Add an expense to get started!</p>
      </div>
    );
  }

  const handleDelete = (expenseId) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      onDelete && onDelete(expenseId);
    }
  };

  // Calculate split amount per person for equal split
  const calculateSplit = (amount, participantCount) => {
    return (amount / participantCount).toFixed(2);
  };

  // Calculate totals for each member
  const memberTotals = {};

  members.forEach((member) => {
    memberTotals[member._id] = 0;
  });

  filteredExpenses.forEach((expense) => {
    const splitPerPerson = calculateSplit(expense.amount, expense.participants.length);
    expense.participants.forEach((participantId) => {
      if (Object.prototype.hasOwnProperty.call(memberTotals, participantId)) {
        memberTotals[participantId] += parseFloat(splitPerPerson);
      }
    });
  });

  return (
    <div className="ledger-wrapper">
      <Table hover className="expense-table ledger-table">
        <thead>
          <tr>
            <th className="col-index">#</th>
            <th>Description</th>
            <th>Amount (₹)</th>
            <th>Date</th>
            <th>Paid By</th>
            {members.map((member) => (
              <th key={member._id} className="col-participant">
                {member.username}
              </th>
            ))}
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense, index) => {
            const paidByUser = getUserById(expense.paidBy);
            const splitPerPerson = calculateSplit(expense.amount, expense.participants.length);

            return (
              <tr key={expense._id}>
                <td className="col-index">
                  <strong>{index + 1}</strong>
                </td>
                <td>
                  <strong>{expense.description}</strong>
                </td>
                <td className="text-accent">₹{expense.amount.toLocaleString("en-IN")}</td>
                <td>{new Date(expense.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td>{paidByUser ? paidByUser.username : "Unknown"}</td>
                {members.map((member) => (
                  <td key={member._id} className="col-participant">
                    {expense.participants.includes(member._id) ? (
                      <span className="split-amount">₹{splitPerPerson}</span>
                    ) : (
                      <span className="split-amount-empty">—</span>
                    )}
                  </td>
                ))}
                <td>
                  <span className="badge-category" data-category={expense.category}>
                    {expense.category}
                  </span>
                </td>
                <td>
                  {isGroupCreator && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="btn-outline-delete"
                      onClick={() => handleDelete(expense._id)}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
          {/* Total Row */}
          <tr className="total-row">
            <td colSpan="2" className="text-right">
              <strong>Total</strong>
            </td>
            <td className="total-amount">
              <strong>₹{filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString("en-IN")}</strong>
            </td>
            <td></td>
            <td></td>
            {members.map((member) => (
              <td key={member._id} className="col-participant total-amount">
                <strong>₹{memberTotals[member._id].toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
              </td>
            ))}
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
