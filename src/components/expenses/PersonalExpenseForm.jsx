import { useState } from "react";
import "../../App.css";
import { expenseCategories } from "../../data/dummyData";

export default function PersonalExpenseForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.amount) {
      newErrors.amount = "Amount is required.";
    } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    }
    if (!form.category) newErrors.category = "Please select a category.";
    if (!form.date)     newErrors.date     = "Date is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    const payload = {
      amount: Number(form.amount),
      category: form.category,
      description: form.description.trim(),
      date: form.date,
    };
    console.log("Personal expense data:", payload);
    onSubmit && onSubmit(payload);
    setForm({ amount: "", category: "", description: "", date: new Date().toISOString().split("T")[0] });
    setErrors({});
  };

  return (
    <div className="card">
      <div className="section-header">
        <h3 className="section-title" style={{ margin: 0, border: 0, padding: 0 }}>Add Personal Expense</h3>
        {onCancel && <button className="btn-icon" onClick={onCancel}>✕</button>}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label" htmlFor="pe-amount">Amount (₹)</label>
            <input id="pe-amount" type="number" name="amount" min="0.01" step="0.01"
              value={form.amount} onChange={handleChange} placeholder="e.g. 500"
              className={`form-input${errors.amount ? " error" : ""}`} />
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="pe-category">Category</label>
            <select id="pe-category" name="category" value={form.category}
              onChange={handleChange}
              className={`form-input${errors.category ? " error" : ""}`}>
              <option value="">Select category</option>
              {expenseCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="pe-desc">Description</label>
          <input id="pe-desc" type="text" name="description" value={form.description}
            onChange={handleChange} placeholder="What did you spend on?"
            className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="pe-date">Date</label>
          <input id="pe-date" type="date" name="date" value={form.date}
            onChange={handleChange}
            className={`form-input${errors.date ? " error" : ""}`} />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Add Expense</button>
          {onCancel && <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}
