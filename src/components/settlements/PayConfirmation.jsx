import { Modal, Button } from "react-bootstrap";
import { getUserById } from "../../data/dummyData";

export default function PayConfirmation({ settlement, onConfirm, onCancel }) {
  if (!settlement) return null;

  const toUser = getUserById(settlement.to);
  const fromUser = getUserById(settlement.from);

  const handleConfirm = () => {
    console.log("Payment confirmed:", {
      from: fromUser?.username,
      to: toUser?.username,
      amount: settlement.amount,
      settlementId: settlement.id,
    });
    onConfirm && onConfirm(settlement);
  };

  return (
    <Modal show={!!settlement} onHide={onCancel} centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>💳 Confirm Payment</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center py-4">
        <p className="text-muted mb-1">You are about to pay</p>
        <p
          className="display-5 fw-bold my-2"
          style={{ color: "#e94560" }}
        >
          ₹{settlement.amount.toLocaleString("en-IN")}
        </p>
        <p className="fs-5">
          to{" "}
          <strong>{toUser?.username || "Unknown"}</strong>
        </p>
        <p className="text-muted small mt-2">
          This action will be logged. Confirm to proceed.
        </p>
      </Modal.Body>

      <Modal.Footer className="justify-content-center gap-3">
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleConfirm}>
          ✅ Confirm Payment
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
