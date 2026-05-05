import "../../App.css";
import { getUserById } from "../../data/dummyData";

export default function GroupCard({ group}) {
  const creator = getUserById(group.creator);

  return (
    <div className="card group-card">
      <div className="group-card-header">
        <div className="group-icon">
          {group.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="group-name">{group.name}</h3>
          <p className="group-meta">
            Created by{" "}
            <span className="group-meta-accent">
              {creator ? creator.username : "Unknown"}
            </span>
          </p>
        </div>
      </div>

      <div className="group-stat">
        <span className="group-stat-value">{group.members.length}</span>
        <span className="group-stat-label">Members</span>
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

      <div className="group-card-actions">
        <button className="btn-open">Open</button>
        <button className="btn-edit">Edit</button>
      </div>
    </div>
  );
}
