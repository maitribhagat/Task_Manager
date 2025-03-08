const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Change this if you have a different username
    password: "Maitri@123", // Set your MySQL root password
    database: "task_manager_app"
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err);
        return;
    }
    console.log("✅ MySQL Connected");
});

// Register User
app.post("/api/register", (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.json({ success: false, message: "All fields are required!" });
    }

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: "Error in registration" });
        }
        res.json({ success: true, message: "Registration successful!" });
    });
});

// Login User
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: "Database error" });
        }

        if (result.length > 0) {
            res.json({ success: true, message: "Login successful" });
        } else {
            res.json({ success: false, message: "Wrong email or password" });
        }
    });
});

app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
});
app.post("/tasks", (req, res) => {
    const { title, description } = req.body;
    const query = "INSERT INTO tasks (title, description) VALUES (?, ?)";
    db.query(query, [title, description], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Task added successfully", taskId: result.insertId });
    });
  });
  app.get("/tasks", (req, res) => {
    const query = "SELECT * FROM tasks";
    db.query(query, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });
  app.put("/tasks/:id", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const query = "UPDATE tasks SET status = ? WHERE id = ?";
    db.query(query, [status, id], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Task updated successfully" });
    });
  });
  app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM tasks WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Task deleted successfully" });
    });
  });
  