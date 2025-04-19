const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const serverless = require("serverless-http"); // Add this for Vercel compatibility
require("dotenv").config();

const app = express();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to parse JSON requests
app.use(express.json());

// CRUD Operations

// Create: Add a new user
app.post("/users", async (req, res) => {
  const { name, age, sex } = req.body;
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, age, sex }])
    .select();

  if (error)
    return res.status(500).json({ message: "Error creating user", error });
  res.status(201).json(data[0]);
});

// Read: Get all users
app.get("/users", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error)
    return res.status(500).json({ message: "Error fetching users", error });
  res.json(data);
});

// Read: Get a single user by ID
app.get("/users/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !data)
    return res.status(404).json({ message: "User not found", error });
  res.json(data);
});

// Update: Update a user by ID
app.put("/users/:id", async (req, res) => {
  const { name, age, sex } = req.body;
  const { data, error } = await supabase
    .from("users")
    .update({ name, age, sex })
    .eq("id", req.params.id)
    .select();

  if (error || !data.length)
    return res.status(404).json({ message: "User not found", error });
  res.json(data[0]);
});

// Delete: Delete a user by ID
app.delete("/users/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", req.params.id)
    .select();

  if (error || !data.length)
    return res.status(404).json({ message: "User not found", error });
  res.json(data[0]);
});

// Export the app as a serverless function for Vercel
module.exports = serverless(app);
