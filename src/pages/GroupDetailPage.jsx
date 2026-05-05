import { useState } from "react";
import "../App.css";
import { getUserById } from "../data/dummyData";
import GroupExpenseForm from "../components/expenses/GroupExpenseForm";

export default function GroupDetailPage({ group, onBack }) {
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  if (!group) {
    return <div className="empty-state"><p>No group selected.</p></div>;
  }

  const creator = getUserById(group.creator);
  const members = group.members.map((id) => getUserById(id)).filter(Boolean);

  const handleAddExpense = (expenseData) => {
    console.log("Group expense submitted:", expenseData);
    setShowExpenseForm(false);
  };

  return (
    <div className="page-container-md">
      {onBack && (
        <button className="back-btn" onClick={onBack}>← Back to Groups</button>
      )}

      <div className="detail-header">
        <div className="detail-icon">{group.name.charAt(0).toUpperCase()}</div>
        <div>
          <h2 className="detail-name">{group.name}</h2>
          <p className="detail-meta">
            Created by <span className="detail-accent">{creator ? creator.username : "Unknown"}</span>
            {" · "}
            <span className="detail-accent">{members.length} members</span>
          </p>
          <p className="detail-meta">
            Created on {new Date(group.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Members</h3>
        <div className="member-grid">
          {members.map((user) => (
            <div key={user._id} className="member-card">
              <div className="avatar-circle avatar-lg avatar-dark">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="member-card-name">
                  {user.username}
                  {user._id === group.creator && <span className="creator-badge">Admin</span>}
                </div>
                <div className="member-card-email">{user.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title" style={{ margin: 0, border: 0, padding: 0 }}>Add Group Expense</h3>
          <button
            className={showExpenseForm ? "btn-danger" : "btn-primary"}
            style={{ width: "auto" }}
            onClick={() => setShowExpenseForm((prev) => !prev)}
          >
            {showExpenseForm ? "✕ Cancel" : "+ Add Expense"}
          </button>
        </div>
        {showExpenseForm && (
          <GroupExpenseForm members={members} onSubmit={handleAddExpense} onCancel={() => setShowExpenseForm(false)} />
        )}
      </div>

      <div className="section">
        <h3 className="section-title">Expense Ledger</h3>
        <div className="placeholder-box">
          <span className="placeholder-icon">📒</span>
          <p className="placeholder-text">Expense Ledger will be available in the next update.</p>
        </div>
      </div>
    </div>
  );
}
