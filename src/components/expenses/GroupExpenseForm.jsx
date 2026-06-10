import { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { expenseCategories } from "../../data/dummyData";
import { useAIExpenseOrchestration } from "../../hooks/useAIExpenseOrchestration";
import AIExpenseInput from "./AIExpenseInput";

export default function GroupExpenseForm({ members = [], onSubmit, onCancel, groupId }) {
  const [validationErrors, setValidationErrors] = useState({});
  const ai = useAIExpenseOrchestration(groupId);

  const { inputMode, form, parse, scan, voice } = ai;
  const isAIMode = inputMode !== "manual";
  const aiFilled = !!(scan.sentence || (parse.rawText && form.amount));

  const perHead =
    form.participants.length >= 2 && Number(form.amount) > 0
      ? (Number(form.amount) / form.participants.length).toFixed(2)
      : null;

  const clearFieldError = (field) =>
    setValidationErrors((prev) => ({ ...prev, [field]: "" }));

  const handleFieldChange = (field, value) => {
    ai.handleFieldChange(field, value);
    clearFieldError(field);
  };

  const handleToggleParticipant = (userId) => {
    ai.handleToggleParticipant(userId);
    clearFieldError("participants");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errors.amount = "Amount must be greater than 0.";
    if (!form.category) errors.category = "Please select a category.";
    if (!form.payer)    errors.paidBy   = "Please select who paid.";
    if (form.participants.length < 2) errors.participants = "Select at least 2 participants.";
    if (!form.date)     errors.date     = "Date is required.";

    if (Object.keys(errors).length > 0) { setValidationErrors(errors); return; }

    onSubmit?.({
      amount:       Number(form.amount),
      category:     form.category,
      description:  form.description.trim(),
      date:         form.date,
      paidBy:       form.payer,
      participants: form.participants,
      splitType:    "equal",
    });

    ai.handleReset();
    setValidationErrors({});
  };

  const handleCancel = () => {
    ai.handleReset();
    setValidationErrors({});
    onCancel?.();
  };

  return (
    <Card className="shadow-sm border-0">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Card.Header className="bg-white border-bottom py-3">
        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
          <h5 className="mb-0 fw-bold">Add Group Expense</h5>
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group" role="group" aria-label="Input mode">
              <Button
                size="sm"
                variant={isAIMode ? "primary" : "outline-secondary"}
                onClick={() => ai.switchMode("ai")}
                style={isAIMode ? { backgroundColor: "#e94560", borderColor: "#e94560" } : {}}
              >
                ✨ AI
              </Button>
              <Button
                size="sm"
                variant={!isAIMode ? "primary" : "outline-secondary"}
                onClick={() => ai.switchMode("manual")}
                style={!isAIMode ? { backgroundColor: "#e94560", borderColor: "#e94560" } : {}}
              >
                Manual
              </Button>
            </div>
            {onCancel && (
              <Button variant="outline-secondary" size="sm" onClick={handleCancel}>✕</Button>
            )}
          </div>
        </div>
      </Card.Header>

      <Card.Body className="p-4">
        {/* ── AI Input Panel ─────────────────────────────────────────────────── */}
        {isAIMode && (
          <AIExpenseInput
            rawText={parse.rawText}
            onTextChange={ai.handleRawTextChange}
            onParse={ai.handleParse}
            onScanFile={ai.handleScanFile}
            onToggleRecording={ai.toggleRecording}
            onDismissParseError={ai.dismissParseError}
            onDismissScanError={ai.dismissScanError}
            isParseLoading={parse.loading}
            isScanLoading={scan.loading}
            isRecording={voice.isRecording}
            isVoiceSupported={voice.isSupported}
            voiceError={voice.error}
            interimTranscript={voice.interimTranscript}
            parseError={parse.error}
            scanError={scan.error}
            scanSentence={scan.sentence}
          />
        )}

        {/* ── Manual Form ──────────────────────────────────────────────────── */}
        {!isAIMode && (
          <Form onSubmit={handleSubmit} noValidate>
            {aiFilled && (
              <Alert variant="info" className="py-2 small mb-3">
                ✨ Fields pre-filled by AI — review and edit before submitting.
              </Alert>
            )}

            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Group controlId="ge-amount">
                  <Form.Label className="fw-semibold">Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => handleFieldChange("amount", e.target.value)}
                    placeholder="e.g. 1500"
                    isInvalid={!!validationErrors.amount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.amount}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="ge-category">
                  <Form.Label className="fw-semibold">Category</Form.Label>
                  <Form.Select
                    value={form.category}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                    isInvalid={!!validationErrors.category}
                  >
                    <option value="">Select category</option>
                    {expenseCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col xs={12} sm={8}>
                <Form.Group controlId="ge-desc">
                  <Form.Label className="fw-semibold">Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="e.g. Beach shack dinner"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={4}>
                <Form.Group controlId="ge-date">
                  <Form.Label className="fw-semibold">Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.date}
                    onChange={(e) => handleFieldChange("date", e.target.value)}
                    isInvalid={!!validationErrors.date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="ge-paidby">
              <Form.Label className="fw-semibold">Paid By</Form.Label>
              <Form.Select
                value={form.payer}
                onChange={(e) => handleFieldChange("payer", e.target.value)}
                isInvalid={!!validationErrors.paidBy}
              >
                <option value="">Who paid?</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.username}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.paidBy}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Participants{" "}
                <span className="text-muted fw-normal fs-6">(select at least 2)</span>
              </Form.Label>
              {members.map((member) => (
                <Form.Check
                  key={member._id}
                  type="checkbox"
                  id={`participant-${member._id}`}
                  label={
                    <span className="d-flex align-items-center gap-2">
                      {member.username}
                      {form.participants.includes(member._id) && perHead && (
                        <span
                          className="badge rounded-pill text-white ms-1"
                          style={{ backgroundColor: "#e94560", fontSize: "0.75rem" }}
                        >
                          ₹{perHead}
                        </span>
                      )}
                    </span>
                  }
                  checked={form.participants.includes(member._id)}
                  onChange={() => handleToggleParticipant(member._id)}
                  className="mb-1"
                />
              ))}
              {validationErrors.participants && (
                <div className="text-danger small mt-1">{validationErrors.participants}</div>
              )}
              {perHead && (
                <Alert variant="info" className="mt-2 py-2 small">
                  💡 Split equally: <strong>₹{perHead}</strong> per person
                </Alert>
              )}
            </Form.Group>

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" style={{ backgroundColor: "#e94560", border: "none" }}>
                Add Expense
              </Button>
              {onCancel && (
                <Button type="button" variant="outline-secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
}
