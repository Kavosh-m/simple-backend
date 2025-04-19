const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Path to the JSON file
const dbPath = path.join(__dirname, "users.json");

// Helper function to read the JSON file
const readUsers = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Helper function to write to the JSON file
const writeUsers = (users) => {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
};

// CRUD Operations

// Create: Add a new user
app.post("/users", (req, res) => {
  const users = readUsers();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1, // Auto-increment ID
    name: req.body.name,
    age: req.body.age,
    sex: req.body.sex,
  };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

// Read: Get all users
app.get("/users", (req, res) => {
  const users = readUsers();
  res.json(users);
});

// Read: Get a single user by ID
app.get("/users/:id", (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update: Update a user by ID
app.put("/users/:id", (req, res) => {
  const users = readUsers();
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex === -1)
    return res.status(404).json({ message: "User not found" });

  users[userIndex] = {
    ...users[userIndex],
    name: req.body.name || users[userIndex].name,
    age: req.body.age || users[userIndex].age,
    sex: req.body.sex || users[userIndex].sex,
  };
  writeUsers(users);
  res.json(users[userIndex]);
});

// Delete: Delete a user by ID
app.delete("/users/:id", (req, res) => {
  const users = readUsers();
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex === -1)
    return res.status(404).json({ message: "User not found" });

  const deletedUser = users.splice(userIndex, 1);
  writeUsers(users);
  res.json(deletedUser);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
