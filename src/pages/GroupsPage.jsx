import { useState } from "react";
import "../App.css";
import GroupCard from "../components/groups/GroupCard";
import CreateGroupForm from "../components/groups/CreateGroupForm";
import { groups as initialGroups } from "../data/dummyData";

export default function GroupsPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [showForm, setShowForm] = useState(false);

  const handleCreateGroup = (payload) => {
    const newGroup = {
      _id: `g${Date.now()}`,
      name: payload.name,
      creator: "u1",
      members: payload.memberIds,
      createdAt: new Date().toISOString(),
    };
    setGroups((prev) => [newGroup, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">My Groups</h2>
          <p className="page-subtitle">{groups.length} group{groups.length !== 1 ? "s" : ""} in total</p>
        </div>
        <button
          className={showForm ? "btn-danger" : "btn-primary"}
          style={{ width: "auto" }}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "✕ Cancel" : "+ New Group"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: "28px" }}>
          <CreateGroupForm onSubmit={handleCreateGroup} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {groups.length === 0 ? (
        <div className="empty-state"><p>No groups yet. Create your first group!</p></div>
      ) : (
        <div className="groups-grid">
          {groups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
            />
          ))}
        </div>
      )}
    </div>
  );
}
