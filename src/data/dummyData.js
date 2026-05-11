// =====================================================
// DUMMY DATA — Single Source of Truth
// Mirrors the backend MongoDB schemas for seamless
// future integration.
// =====================================================

// ----- USERS -----
export const users = [
  {
    _id: "u1",
    username: "alice_wonder",
    email: "alice@example.com",
    password: "hashed_pass_1", // never sent to frontend in real app
    createdAt: "2024-01-10T08:00:00.000Z",
  },
  {
    _id: "u2",
    username: "bob_builder",
    email: "bob@example.com",
    password: "hashed_pass_2",
    createdAt: "2024-01-12T09:00:00.000Z",
  },
  {
    _id: "u3",
    username: "carol_joy",
    email: "carol@example.com",
    password: "hashed_pass_3",
    createdAt: "2024-01-15T10:00:00.000Z",
  },
  {
    _id: "u4",
    username: "dave_rocks",
    email: "dave@example.com",
    password: "hashed_pass_4",
    createdAt: "2024-02-01T11:00:00.000Z",
  },
];

// Logged-in user simulation
export const currentUser = users[0];

// ----- GROUPS -----
export const groups = [
  {
    _id: "g1",
    name: "Goa Trip 2024",
    creator: "u1",
    members: ["u1", "u2", "u3"],
    createdAt: "2024-03-01T08:00:00.000Z",
  },
  {
    _id: "g2",
    name: "Flat Mates",
    creator: "u2",
    members: ["u2", "u3", "u4"],
    createdAt: "2024-02-15T09:00:00.000Z",
  },
  {
    _id: "g3",
    name: "Office Lunch",
    creator: "u1",
    members: ["u1", "u2", "u4"],
    createdAt: "2024-04-10T10:00:00.000Z",
  },
];

// ----- PERSONAL EXPENSES -----
export const personalExpenses = [
  {
    _id: "pe1",
    userId: "u1",
    amount: 1200,
    category: "Food",
    description: "Groceries from Big Basket",
    date: "2024-05-01",
    createdAt: "2024-05-01T12:00:00.000Z",
  },
  {
    _id: "pe2",
    userId: "u1",
    amount: 500,
    category: "Transport",
    description: "Monthly metro pass",
    date: "2024-05-02",
    createdAt: "2024-05-02T08:30:00.000Z",
  },
  {
    _id: "pe3",
    userId: "u1",
    amount: 3500,
    category: "Entertainment",
    description: "Netflix + Spotify annual",
    date: "2024-05-05",
    createdAt: "2024-05-05T14:00:00.000Z",
  },
  {
    _id: "pe4",
    userId: "u1",
    amount: 800,
    category: "Utilities",
    description: "Electricity bill",
    date: "2024-05-10",
    createdAt: "2024-05-10T10:00:00.000Z",
  },
];

// ----- GROUP EXPENSES -----
export const groupExpenses = [
  {
    _id: "ge1",
    groupId: "g1",
    amount: 4500,
    category: "Food",
    description: "Beach shack dinner",
    date: "2024-03-05",
    paidBy: "u1",
    participants: ["u1", "u2", "u3"],
    splitType: "equal",
    createdAt: "2024-03-05T20:00:00.000Z",
  },
  {
    _id: "ge2",
    groupId: "g1",
    amount: 6000,
    category: "Transport",
    description: "Cab to Goa airport",
    date: "2024-03-06",
    paidBy: "u2",
    participants: ["u1", "u2", "u3"],
    splitType: "equal",
    createdAt: "2024-03-06T07:00:00.000Z",
  },
  {
    _id: "ge5",
    groupId: "g1",
    amount: 3000,
    category: "Entertainment",
    description: "Water sports activity",
    date: "2024-03-07",
    paidBy: "u3",
    participants: ["u1", "u2", "u3"],
    splitType: "equal",
    createdAt: "2024-03-07T10:00:00.000Z",
  },
  {
    _id: "ge3",
    groupId: "g2",
    amount: 2200,
    category: "Utilities",
    description: "Internet bill for March",
    date: "2024-03-31",
    paidBy: "u3",
    participants: ["u2", "u3", "u4"],
    splitType: "equal",
    createdAt: "2024-03-31T18:00:00.000Z",
  },
  {
    _id: "ge4",
    groupId: "g3",
    amount: 1800,
    category: "Food",
    description: "Team lunch at Subway",
    date: "2024-04-15",
    paidBy: "u1",
    participants: ["u1", "u2", "u4"],
    splitType: "equal",
    createdAt: "2024-04-15T13:00:00.000Z",
  },
];

// ----- SETTLEMENTS -----
export const settlements = [
  {
    _id: "s1",
    groupId: "g1",
    paidBy: "u2",
    paidTo: "u1",
    amount: 1500,
    settledAt: "2024-03-10T11:00:00.000Z",
  },
  {
    _id: "s2",
    groupId: "g2",
    paidBy: "u4",
    paidTo: "u3",
    amount: 733,
    settledAt: "2024-04-02T10:00:00.000Z",
  },
];

// ----- EXPENSE CATEGORIES -----
export const expenseCategories = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Travel",
  "Education",
  "Other",
];

// ----- HELPER: get user by id -----
export const getUserById = (id) => users.find((u) => u._id === id);

// ----- HELPER: get group members as user objects -----
export const getGroupMembers = (groupId) => {
  const group = groups.find((g) => g._id === groupId);
  if (!group) return [];
  return group.members.map((id) => getUserById(id)).filter(Boolean);
};
