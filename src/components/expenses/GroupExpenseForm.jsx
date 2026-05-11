import { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import "../../App.css";
import { expenseCategories } from "../../data/dummyData";

export default function GroupExpenseForm({ members = [], onSubmit, onCancel }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paidBy: "",
    participants: [],
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
    if (!form.paidBy) newErrors.paidBy = "Please select who paid.";
    if (form.participants.length < 2)
      newErrors.participants = "Select at least 2 participants.";
    if (!form.date) newErrors.date = "Date is required.";
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
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = {
      amount: Number(form.amount),
      category: form.category,
      description: form.description.trim(),
      date: form.date,
      paidBy: form.paidBy,
      participants: form.participants,
      splitType: "equal",
    };
    console.log("Group expense data:", payload);
    onSubmit && onSubmit(payload);
    setForm({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      paidBy: "",
      participants: [],
    });
    setErrors({});
  };

  const perHead =
    form.participants.length >= 2 && Number(form.amount) > 0
      ? (Number(form.amount) / form.participants.length).toFixed(2)
      : null;

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Add Group Expense</Card.Title>
        {onCancel && (
          <Button variant="link" size="sm" className="p-0" onClick={onCancel}>
            ✕
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} noValidate>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="ge-amount">Amount (₹)</Form.Label>
                <Form.Control
                  id="ge-amount"
                  type="number"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  isInvalid={!!errors.amount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="ge-category">Category</Form.Label>
                <Form.Select
                  id="ge-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  isInvalid={!!errors.category}
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="ge-desc">Description</Form.Label>
            <Form.Control
              id="ge-desc"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Beach shack dinner"
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="ge-date">Date</Form.Label>
                <Form.Control
                  id="ge-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  isInvalid={!!errors.date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="ge-paidby">Paid By</Form.Label>
                <Form.Select
                  id="ge-paidby"
                  name="paidBy"
                  value={form.paidBy}
                  onChange={handleChange}
                  isInvalid={!!errors.paidBy}
                >
                  <option value="">Who paid?</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.username}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.paidBy}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              Participants <small className="text-muted">(select at least 2)</small>
            </Form.Label>
            <div
              className={`participant-list${
                errors.participants ? " border-danger" : ""
              }`}
            >
              {members.map((member) => (
                <Form.Check
                  key={member._id}
                  type="checkbox"
                  id={`participant-${member._id}`}
                  label={
                    <div className="d-flex align-items-center gap-2 flex-grow-1">
                      <div className="avatar-circle avatar-sm avatar-dark">
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="participant-name">{member.username}</span>
                      {form.participants.includes(member._id) && perHead && (
                        <span className="split-amount ms-auto">₹{perHead}</span>
                      )}
                    </div>
                  }
                  checked={form.participants.includes(member._id)}
                  onChange={() => toggleParticipant(member._id)}
                  className="participant-item p-2"
                />
              ))}
            </div>
            {errors.participants && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {errors.participants}
              </Form.Control.Feedback>
            )}
            {perHead && (
              <Alert variant="info" className="mt-2 mb-0">
                <small>Split equally: ₹{perHead} per person</small>
              </Alert>
            )}
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" className="flex-grow-1">
              Add Expense
            </Button>
            {onCancel && (
              <Button
                variant="secondary"
                type="button"
                className="flex-grow-1"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}