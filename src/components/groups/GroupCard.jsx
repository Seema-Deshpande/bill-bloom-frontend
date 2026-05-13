import { Card, Badge, Button } from "react-bootstrap";
import { getUserById } from "../../data/dummyData";

const BG_COLORS = ["#e94560", "#4ecdc4", "#a29bfe", "#fdcb6e", "#6c5ce7", "#00b894"];

export default function GroupCard({ group, onOpenGroup }) {
  const creator = getUserById(group.creator);
  const colorIndex = group._id.charCodeAt(group._id.length - 1) % BG_COLORS.length;
  const cardColor = BG_COLORS[colorIndex];

  return (
    <Card className="h-100 shadow-sm border-0" style={{ borderTop: `4px solid ${cardColor}` }}>
      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
            style={{ width: 48, height: 48, backgroundColor: cardColor, fontSize: 20, flexShrink: 0 }}
          >
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <Card.Title className="mb-0 text-truncate fw-bold" style={{ fontSize: "1rem" }}>
              {group.name}
            </Card.Title>
            <small className="text-muted">
              by <span className="fw-semibold">{creator ? creator.username : "Unknown"}</span>
            </small>
          </div>
        </div>

        <div className="d-flex gap-2 mb-3">
          <Badge bg="light" text="dark" className="border">
            👥 {group.members.length} members
          </Badge>
          <Badge bg="light" text="dark" className="border">
            📅 {new Date(group.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
          </Badge>
        </div>

        <div className="d-flex gap-1 mb-3">
          {group.members.slice(0, 5).map((memberId) => {
            const user = getUserById(memberId);
            return (
              <div
                key={memberId}
                className="d-flex align-items-center justify-content-center rounded-circle text-white fw-semibold"
                style={{ width: 32, height: 32, backgroundColor: "#1a1a2e", fontSize: 12, flexShrink: 0 }}
                title={user?.username}
              >
                {user ? user.username.charAt(0).toUpperCase() : "?"}
              </div>
            );
          })}
          {group.members.length > 5 && (
            <div
              className="d-flex align-items-center justify-content-center rounded-circle text-white fw-semibold"
              style={{ width: 32, height: 32, backgroundColor: "#aaa", fontSize: 11 }}
            >
              +{group.members.length - 5}
            </div>
          )}
        </div>

        <div className="d-flex gap-2 mt-auto">
          <Button
            size="sm"
            style={{ backgroundColor: "#e94560", border: "none", flex: 1 }}
            onClick={() => onOpenGroup && onOpenGroup(group)}
          >
            Open
          </Button>
          <Button size="sm" variant="outline-secondary" style={{ flex: 1 }}>
            Edit
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
