import { useState } from "react";
import "../App.css";
import PersonalExpenseForm from "../components/expenses/PersonalExpenseForm";
import PersonalExpenseLedger from "../components/expenses/PersonalExpenseLedger";
import { personalExpenses as initialExpenses } from "../data/dummyData";


export default function PersonalExpensesPage() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showForm, setShowForm] = useState(false);

  const handleAddExpense = (data) => {
    setExpenses((prev) => [{ _id: `pe${Date.now()}`, userId: "u1", ...data, createdAt: new Date().toISOString() }, ...prev]);
    setShowForm(false);
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="page-container-sm">
      <div className="page-header">
        <div>
          <h2 className="page-title">Personal Expenses</h2>
          <p className="page-subtitle">
            Total: <span className="total-accent">₹{totalSpent.toLocaleString("en-IN")}</span>
            {" "}across {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className={showForm ? "btn-danger" : "btn-primary"}
          style={{ width: "auto" }}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "✕ Cancel" : "+ Add Expense"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: "28px" }}>
          <PersonalExpenseForm onSubmit={handleAddExpense} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="section">
        <h3 className="section-title">Personal Expense Ledger</h3>
        <PersonalExpenseLedger expenses={expenses} onDelete={handleDeleteExpense} />
      </div>
    </div>
  );
}