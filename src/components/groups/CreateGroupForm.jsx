import { useState } from "react";
import "../../App.css";
import { users } from "../../data/dummyData";

export default function CreateGroupForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredUsers = search.trim()
    ? users.filter(
        (u) =>
          !selectedMembers.includes(u._id) &&
          u.username.toLowerCase().includes(search.trim().toLowerCase())
      )
    : [];

  const addMember = (userId) => {
    setSelectedMembers((prev) => [...prev, userId]);
    if (errors.members) setErrors((prev) => ({ ...prev, members: "" }));
    setSearch("");
    setDropdownOpen(false);
  };

  const removeMember = (userId) => {
    setSelectedMembers((prev) => prev.filter((id) => id !== userId));
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Group name is required.";
    } else if (name.trim().length < 3) {
      newErrors.name = "Group name must be at least 3 characters.";
    }
    if (selectedMembers.length < 1) {
      newErrors.members = "Please select at least one member.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = { name: name.trim(), memberIds: selectedMembers };
    console.log("Create group payload:", payload);
    setSuccessMsg(`Group "${name.trim()}" created successfully!`);
    onSubmit && onSubmit(payload);
    setName("");
    setSelectedMembers([]);
    setErrors({});
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="card">
      <div className="section-header">
        <h3 className="section-title" style={{ margin: 0, border: 0, padding: 0 }}>Create New Group</h3>
        {onCancel && <button className="btn-icon" onClick={onCancel}>✕</button>}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label" htmlFor="group-name">Group Name</label>
          <input
            id="group-name" type="text" value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            placeholder="e.g. Goa Trip 2025"
            className={`form-input${errors.name ? " error" : ""}`}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-field">
          <label className="form-label">Add Members</label>
          <div className="member-search-wrap">
            <input
              type="text"
              className={`form-input${errors.members ? " error" : ""}`}
              placeholder="Search by username…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => search.trim() && setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
            />
            {dropdownOpen && filteredUsers.length > 0 && (
              <ul className="member-dropdown">
                {filteredUsers.map((user) => (
                  <li
                    key={user._id}
                    className="member-dropdown-item"
                    onMouseDown={() => addMember(user._id)}
                  >
                    <div className="avatar-circle avatar-sm avatar-dark">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="member-name">{user.username}</div>
                      <div className="member-email">{user.email}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {dropdownOpen && search.trim() && filteredUsers.length === 0 && (
              <div className="member-dropdown member-dropdown-empty">No users found</div>
            )}
          </div>
          {errors.members && <span className="form-error">{errors.members}</span>}

          {selectedMembers.length > 0 && (
            <div className="selected-chips">
              {selectedMembers.map((id) => {
                const user = users.find((u) => u._id === id);
                return (
                  <span key={id} className="member-chip">
                    <div className="avatar-circle avatar-sm avatar-dark">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    {user.username}
                    <button
                      type="button"
                      className="chip-remove"
                      onClick={() => removeMember(id)}
                    >✕</button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {successMsg && <div className="success-msg">{successMsg}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Create Group</button>
          {onCancel && <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}
