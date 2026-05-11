import { Table, Button } from "react-bootstrap";
import "../../App.css";

export default function PersonalExpenseLedger({ expenses, onDelete }) {
  if (expenses.length === 0) {
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

  return (
    <div className="ledger-wrapper">
      <Table hover responsive className="expense-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount (₹)</th>
            <th>Category</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>
                <strong>{expense.description}</strong>
              </td>
              <td className="text-accent">₹{expense.amount.toLocaleString("en-IN")}</td>
              <td>
                <span className="badge-category" data-category={expense.category}>
                  {expense.category}
                </span>
              </td>
              <td>{new Date(expense.date).toLocaleDateString("en-IN")}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(expense._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
