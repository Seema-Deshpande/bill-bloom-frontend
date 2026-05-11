import { Card, Badge, Button, Row, Col } from "react-bootstrap";
import "../../App.css";
import { getUserById } from "../../data/dummyData";

export default function GroupCard({ group }) {
  const creator = getUserById(group.creator);

  return (
    <Card className="group-card h-100">
      <Card.Body>
        <div className="group-card-header mb-3">
          <div className="group-icon">
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Card.Title className="group-name mb-1">{group.name}</Card.Title>
            <small className="group-meta">
              Created by{" "}
              <span className="group-meta-accent">
                {creator ? creator.username : "Unknown"}
              </span>
            </small>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="group-stat">
            <div className="group-stat-value">{group.members.length}</div>
            <small className="group-stat-label">Members</small>
          </div>
          <div className="avatar-row">
            {group.members.slice(0, 4).map((memberId) => {
              const user = getUserById(memberId);
              return (
                <div key={memberId} className="avatar-circle avatar-sm" title={user?.username}>
                  {user ? user.username.charAt(0).toUpperCase() : "?"}
                </div>
              );
            })}
            {group.members.length > 4 && (
              <div className="avatar-circle avatar-sm avatar-extra">
                +{group.members.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="group-card-actions d-flex gap-2">
          <Button variant="danger" size="sm" className="flex-grow-1">
            Open
          </Button>
          <Button variant="outline-dark" size="sm" className="flex-grow-1">
            Edit
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
