import { useState } from "react";
import { Form, Button, Card, Alert, ListGroup } from "react-bootstrap";
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
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Create New Group</Card.Title>
        {onCancel && (
          <Button variant="link" size="sm" className="p-0" onClick={onCancel}>
            ✕
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="group-name">Group Name</Form.Label>
            <Form.Control
              id="group-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Goa Trip 2025"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Add Members</Form.Label>
            <div className="member-search-wrap position-relative">
              <Form.Control
                type="text"
                placeholder="Search by username…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => search.trim() && setDropdownOpen(true)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                isInvalid={!!errors.members}
              />
              {dropdownOpen && filteredUsers.length > 0 && (
                <ListGroup className="member-dropdown position-absolute w-100">
                  {filteredUsers.map((user) => (
                    <ListGroup.Item
                      key={user._id}
                      className="member-dropdown-item d-flex align-items-center gap-2"
                      onMouseDown={() => addMember(user._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="avatar-circle avatar-sm avatar-dark">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="member-name">{user.username}</div>
                        <small className="member-email">{user.email}</small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              {dropdownOpen && search.trim() && filteredUsers.length === 0 && (
                <div className="member-dropdown position-absolute w-100 text-center p-3">
                  <small className="text-muted">No users found</small>
                </div>
              )}
            </div>
            {errors.members && <Form.Control.Feedback type="invalid" className="d-block">{errors.members}</Form.Control.Feedback>}

            {selectedMembers.length > 0 && (
              <div className="selected-chips mt-3">
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
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </Form.Group>

          {successMsg && <Alert variant="success" className="mb-3">{successMsg}</Alert>}

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" className="flex-grow-1">
              Create Group
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
