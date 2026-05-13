import { useState, useRef, useEffect } from "react";
import { Form, Button, Alert, Card, Badge } from "react-bootstrap";
import { users } from "../../data/dummyData";

export default function CreateGroupForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  const filteredUsers = search.trim()
    ? users.filter(
        (u) =>
          !selectedMembers.includes(u._id) &&
          u.username.toLowerCase().includes(search.trim().toLowerCase())
      )
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center border-bottom py-3">
        <h5 className="mb-0 fw-bold">Create New Group</h5>
        {onCancel && (
          <Button variant="outline-secondary" size="sm" onClick={onCancel}>✕</Button>
        )}
      </Card.Header>
      <Card.Body className="p-4">
        {successMsg && (
          <Alert variant="success" dismissible onClose={() => setSuccessMsg("")}>
            {successMsg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="group-name">
            <Form.Label className="fw-semibold">Group Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Goa Trip 2025"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Add Members</Form.Label>
            <div className="position-relative" ref={searchRef}>
              <Form.Control
                type="text"
                placeholder="Search by username…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => search.trim() && setDropdownOpen(true)}
                isInvalid={!!errors.members}
              />
              <Form.Control.Feedback type="invalid">{errors.members}</Form.Control.Feedback>

              {dropdownOpen && filteredUsers.length > 0 && (
                <ul
                  className="list-unstyled bg-white border rounded shadow-sm position-absolute w-100 mb-0 py-1"
                  style={{ zIndex: 1000, maxHeight: 180, overflowY: "auto" }}
                >
                  {filteredUsers.map((user) => (
                    <li
                      key={user._id}
                      className="d-flex align-items-center gap-2 px-3 py-2"
                      style={{ cursor: "pointer" }}
                      onMouseDown={() => addMember(user._id)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                        style={{ width: 28, height: 28, backgroundColor: "#1a1a2e", fontSize: 12, flexShrink: 0 }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-semibold small">{user.username}</div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>{user.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {dropdownOpen && search.trim() && filteredUsers.length === 0 && (
                <div className="border rounded bg-white p-2 text-muted small position-absolute w-100" style={{ zIndex: 1000 }}>
                  No users found
                </div>
              )}
            </div>

            {selectedMembers.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {selectedMembers.map((id) => {
                  const user = users.find((u) => u._id === id);
                  return (
                    <Badge
                      key={id}
                      bg="light"
                      text="dark"
                      className="d-flex align-items-center gap-1 border py-1 px-2"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <span
                        className="d-inline-flex align-items-center justify-content-center rounded-circle text-white"
                        style={{ width: 18, height: 18, backgroundColor: "#1a1a2e", fontSize: 9 }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                      {user.username}
                      <button
                        type="button"
                        className="btn-close ms-1"
                        style={{ fontSize: "0.5rem" }}
                        onClick={() => removeMember(id)}
                        aria-label="Remove member"
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </Form.Group>

          <div className="d-flex gap-2 mt-4">
            <Button type="submit" style={{ backgroundColor: "#e94560", border: "none" }}>
              Create Group
            </Button>
            {onCancel && (
              <Button type="button" variant="outline-secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

