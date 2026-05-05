import { useState } from "react";
import "../../App.css";
import { expenseCategories } from "../../data/dummyData";

export default function GroupExpenseForm({ members = [], onSubmit, onCancel }) {
  const [form, setForm] = useState({
    amount: "", category: "", description: "",
    date: new Date().toISOString().split("T")[0],
    paidBy: "", participants: [],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.amount) {
      newErrors.amount = "Amount is required.";
    } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    }
    if (!form.category)             newErrors.category     = "Please select a category.";
    if (!form.paidBy)               newErrors.paidBy       = "Please select who paid.";
    if (form.participants.length < 2) newErrors.participants = "Select at least 2 participants.";
    if (!form.date)                 newErrors.date         = "Date is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleParticipant = (userId) => {
    setForm((prev) => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter((id) => id !== userId)
        : [...prev.participants, userId],
    }));
    if (errors.participants) setErrors((prev) => ({ ...prev, participants: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    const payload = {
      amount: Number(form.amount), category: form.category,
      description: form.description.trim(), date: form.date,
      paidBy: form.paidBy, participants: form.participants, splitType: "equal",
    };
    console.log("Group expense data:", payload);
    onSubmit && onSubmit(payload);
    setForm({ amount: "", category: "", description: "", date: new Date().toISOString().split("T")[0], paidBy: "", participants: [] });
    setErrors({});
  };

  const perHead = form.participants.length >= 2 && Number(form.amount) > 0
    ? (Number(form.amount) / form.participants.length).toFixed(2)
    : null;

  return (
    <div className="card">
      <div className="section-header">
        <h3 className="section-title" style={{ margin: 0, border: 0, padding: 0 }}>Add Group Expense</h3>
        {onCancel && <button className="btn-icon" onClick={onCancel}>✕</button>}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label" htmlFor="ge-amount">Amount (₹)</label>
            <input id="ge-amount" type="number" name="amount" min="0.01" step="0.01"
              value={form.amount} onChange={handleChange} placeholder="e.g. 1500"
              className={`form-input${errors.amount ? " error" : ""}`} />
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="ge-category">Category</label>
            <select id="ge-category" name="category" value={form.category}
              onChange={handleChange}
              className={`form-input${errors.category ? " error" : ""}`}>
              <option value="">Select category</option>
              {expenseCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="ge-desc">Description</label>
          <input id="ge-desc" type="text" name="description" value={form.description}
            onChange={handleChange} placeholder="e.g. Beach shack dinner"
            className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="ge-date">Date</label>
          <input id="ge-date" type="date" name="date" value={form.date}
            onChange={handleChange}
            className={`form-input${errors.date ? " error" : ""}`} />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="ge-paidby">Paid By</label>
          <select id="ge-paidby" name="paidBy" value={form.paidBy}
            onChange={handleChange}
            className={`form-input${errors.paidBy ? " error" : ""}`}>
            <option value="">Who paid?</option>
            {members.map((m) => <option key={m._id} value={m._id}>{m.username}</option>)}
          </select>
          {errors.paidBy && <span className="form-error">{errors.paidBy}</span>}
        </div>

        <div className="form-field">
          <label className="form-label">
            Participants <span className="label-hint">(select at least 2)</span>
          </label>
          <div className={`participant-list${errors.participants ? " error" : ""}`}>
            {members.map((member) => (
              <label key={member._id} className="participant-item">
                <input type="checkbox" checked={form.participants.includes(member._id)}
                  onChange={() => toggleParticipant(member._id)}
                  style={{ accentColor: "#e94560" }} />
                <div className="avatar-circle avatar-sm avatar-dark">
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <span className="participant-name">{member.username}</span>
                {form.participants.includes(member._id) && perHead && (
                  <span className="split-amount">₹{perHead}</span>
                )}
              </label>
            ))}
          </div>
          {errors.participants && <span className="form-error">{errors.participants}</span>}
          {perHead && <p className="split-info">Split equally: ₹{perHead} per person</p>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Add Expense</button>
          {onCancel && <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}