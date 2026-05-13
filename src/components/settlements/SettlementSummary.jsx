import { ListGroup, Button, Alert, Badge } from "react-bootstrap";
import { getUserById, currentUser } from "../../data/dummyData";

export default function SettlementSummary({ settlements, completedSettlements = [], onPay }) {
  const hasPending = settlements && settlements.length > 0;
  const hasCompleted = completedSettlements.length > 0;

  return (
    <div>
      {/* Pending */}
      {hasPending ? (
        <ListGroup className="mb-4">
          {settlements.map((s) => {
            const fromUser = getUserById(s.from);
            const toUser = getUserById(s.to);
            const isMyOwe = s.from === currentUser._id;

            return (
              <ListGroup.Item
                key={s.id}
                className="d-flex justify-content-between align-items-center py-3"
                variant={isMyOwe ? "warning" : ""}
              >
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="fw-semibold">{fromUser?.username || "Unknown"}</span>
                  <span className="text-muted">→</span>
                  <span className="fw-semibold">{toUser?.username || "Unknown"}</span>
                  <Badge bg="danger" className="ms-1">
                    ₹{s.amount.toLocaleString("en-IN")}
                  </Badge>
                  {isMyOwe && (
                    <Badge bg="warning" text="dark">You owe</Badge>
                  )}
                </div>
                {isMyOwe && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onPay && onPay(s)}
                  >
                    Pay
                  </Button>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <Alert variant="success" className="d-flex align-items-center gap-2 mb-4">
          <span style={{ fontSize: "1.2rem" }}>🎉</span>
          <span>All settled up! No outstanding balances.</span>
        </Alert>
      )}

      {/* Completed */}
      {hasCompleted && (
        <>
          <h6 className="fw-semibold text-muted mb-2">✅ Completed Settlements</h6>
          <ListGroup>
            {completedSettlements.map((s) => {
              const fromUser = getUserById(s.from);
              const toUser = getUserById(s.to);
              return (
                <ListGroup.Item
                  key={s.id}
                  className="d-flex justify-content-between align-items-center py-3"
                  variant="success"
                >
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fw-semibold">{fromUser?.username || "Unknown"}</span>
                    <span className="text-muted">→</span>
                    <span className="fw-semibold">{toUser?.username || "Unknown"}</span>
                    <Badge bg="success" className="ms-1">
                      ₹{s.amount.toLocaleString("en-IN")}
                    </Badge>
                  </div>
                  <Badge bg="success">Paid</Badge>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </>
      )}
    </div>
  );
}
