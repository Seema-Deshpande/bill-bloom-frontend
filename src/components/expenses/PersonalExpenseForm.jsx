import { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
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
    if (!form.date) newErrors.date = "Date is required.";
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
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
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
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Add Personal Expense</Card.Title>
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
                <Form.Label htmlFor="pe-amount">Amount (₹)</Form.Label>
                <Form.Control
                  id="pe-amount"
                  type="number"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  isInvalid={!!errors.amount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="pe-category">Category</Form.Label>
                <Form.Select
                  id="pe-category"
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
            <Form.Label htmlFor="pe-desc">Description</Form.Label>
            <Form.Control
              id="pe-desc"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What did you spend on?"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="pe-date">Date</Form.Label>
            <Form.Control
              id="pe-date"
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

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" className="flex-grow-1">
              Add Expense
            </Button>
            {onCancel && (
              <Button variant="secondary" type="button" className="flex-grow-1" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
