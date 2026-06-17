const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// SQLite baza açylýar
const db = new sqlite3.Database("./nakliye.db");

// ähli raporlary almak
app.get("/api/rapor", (req, res) => {
  db.all("SELECT * FROM rapor", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// täze rapor goşmak
app.post("/api/rapor", (req, res) => {
  const { yylAy, sene, ugur, ulag, suriji, gornus, ady, bahasy, logo, toleg } = req.body;

  db.run(
    `INSERT INTO rapor (yylAy, sene, ugur, ulag, suriji, gornus, ady, bahasy, logo, toleg)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [yylAy, sene, ugur, ulag, suriji, gornus, ady, bahasy, logo, toleg],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// login API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ? AND active = 1",
    [username, password],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: "Nädogry login ýa-da parol" });

      res.json({ message: "Login üstünlikli", role: user.role });
    }
  );
});

// PORT — Railway üçin hökmany
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server işledi: " + PORT);
});
