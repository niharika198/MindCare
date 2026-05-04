const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) console.error("Database connection error:", err.message);
  else console.log("Connected to SQLite database.");
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT,
  result TEXT,
  xp INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

const SECRET_KEY = "mindcare_super_secret_key";

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = Date.now().toString();

    db.run(`INSERT INTO users (id, username, password) VALUES (?, ?, ?)`, 
      [id, username, hashedPassword], 
      function(err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(400).json({ error: "Username already taken" });
          }
          return res.status(500).json({ error: "Database error" });
        }
        
        const token = jwt.sign({ id, username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, user: { id, username } });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, username: user.username } });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/predict", (req, res) => {
  const { data, userId, xp } = req.body;
  const inputData = JSON.stringify(data);

  const pythonProcess = spawn("python", ["predict.py", inputData]);

  pythonProcess.stdout.on("data", (prediction) => {
    const result = prediction.toString().trim();
    
    // Save to history if userId is provided
    if (userId) {
      db.run(`INSERT INTO assessments (userId, result, xp) VALUES (?, ?, ?)`, 
        [userId, result, xp || 0],
        (err) => {
          if (err) console.error("Error saving assessment:", err.message);
          res.json({ result });
        }
      );
    } else {
      res.json({ result });
    }
  });

  pythonProcess.stderr.on("data", (error) => {
    console.error(`Error: ${error}`);
  });
});

app.get("/history/:userId", (req, res) => {
  const { userId } = req.params;
  db.all(`SELECT * FROM assessments WHERE userId = ? ORDER BY timestamp DESC`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

app.listen(5001, () => console.log("Server running on port 5001"));
