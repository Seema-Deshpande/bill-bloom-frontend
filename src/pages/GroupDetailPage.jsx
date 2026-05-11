import { useState, useMemo } from "react";
import "../App.css";
import { getUserById, groupExpenses } from "../data/dummyData";
import GroupExpenseForm from "../components/expenses/GroupExpenseForm";
import GroupExpenseLedger from "../components/expenses/GroupExpenseLedger";
import SettlementSummary from "../components/expenses/SettlementSummary";

export default function GroupDetailPage({ group, onBack }) {
  const [expenses, setExpenses] = useState(groupExpenses);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const creator = useMemo(() => group ? getUserById(group.creator) : null, [group]);
  const currentUserId = "u1"; // This would be from auth in real app
  const isGroupCreator = group?.creator === currentUserId;
  const members = useMemo(() => group ? group.members.map((id) => getUserById(id)).filter(Boolean) : [], [group]);

  const calculateSettlements = (groupExpenses, groupMembers) => {
    // 1. Calculate net balance for each member
    const balances = {};
    groupMembers.forEach(member => {
      balances[member._id] = 0;
    });

    groupExpenses.forEach(expense => {
      const { amount, paidBy, participants } = expense;
      const share = amount / participants.length;

      // PaidBy gets back money
      if (balances[paidBy] !== undefined) {
        balances[paidBy] += amount;
      }

      // Participants owe money
      participants.forEach(participantId => {
        if (balances[participantId] !== undefined) {
          balances[participantId] -= share;
        }
      });
    });

    // 2. Separate into creditors and debtors
    const creditors = [];
    const debtors = [];

    Object.keys(balances).forEach(userId => {
      const amount = balances[userId];
      if (amount > 0.01) {
        creditors.push({ userId, amount });
      } else if (amount < -0.01) {
        debtors.push({ userId, amount: Math.abs(amount) });
      }
    });

    // 3. Match debtors and creditors (Greedy algorithm for minimum transactions)
    const settlements = [];
    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const settlementAmount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: getUserById(debtor.userId),
        to: getUserById(creditor.userId),
        amount: settlementAmount
      });

      debtor.amount -= settlementAmount;
      creditor.amount -= settlementAmount;

      if (debtor.amount <= 0.01) i++;
      if (creditor.amount <= 0.01) j++;
    }

    return settlements;
  };

  const groupSettlements = useMemo(() => {
    if (!group) return [];
    return calculateSettlements(expenses.filter(e => e.groupId === group._id), members);
  }, [expenses, group, members]);

  if (!group) {
    return <div className="empty-state"><p>No group selected.</p></div>;
  }

  const handleAddExpense = (expenseData) => {
    const newExpense = {
      _id: `ge${Date.now()}`,
      groupId: group._id,
      ...expenseData,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setShowExpenseForm(false);
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
  };

  const handlePay = (settlement) => {
    alert(`Settling ₹${settlement.amount.toFixed(2)} to ${settlement.to.username}`);
    // In a real app, this would trigger an API call to record the settlement
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
        <SettlementSummary 
          settlements={groupSettlements} 
          currentUserId={currentUserId} 
          onPay={handlePay} 
        />
      </div>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title" style={{ margin: 0, border: 0, padding: 0 }}>📁 Expense Ledger</h3>
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
        <GroupExpenseLedger
          groupId={group._id}
          expenses={expenses}
          members={members}
          isGroupCreator={isGroupCreator}
          onDelete={handleDeleteExpense}
        />
      </div>
    </div>
  );
}
