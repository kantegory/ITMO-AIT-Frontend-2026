const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;
const JWT_SECRET = "super-secret-key-change-later";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DB_PATH = path.join(__dirname, "db.json");

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    return { users: [], models: [], datasets: [], spaces: [] };
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Требуется авторизация" });
  try {
    req.userId = jwt.verify(token, JWT_SECRET).id;
    next();
  } catch {
    return res.status(401).json({ message: "Неверный токен" });
  }
}

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Заполните все поля" });
  }

  const db = readDb();
  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email уже используется" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = db.users.length ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;
  const user = { id, name, email, passwordHash };

  db.users.push(user);
  writeDb(db);

  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: { id, name, email } });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "Пользователь не найден" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Неверный пароль" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.get("/me", authMiddleware, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ message: "Пользователь не найден" });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.get("/api/models", (req, res) => {
  const { search, category } = req.query;
  const db = readDb();
  let models = db.models || [];

  if (search) {
    const s = search.toLowerCase();
    models = models.filter((m) => {
      const title = (m.title || "").toLowerCase();
      const desc = (m.description || "").toLowerCase();
      const tagLabel = (m.tagLabel || "").toLowerCase();
      const shortType = (m.shortType || "").toLowerCase();
      const cat = (m.category || "").toLowerCase();
      const extra1 = (m.extra1 || "").toLowerCase();
      const badge = (m.badge || "").toLowerCase();

      return (
        title.includes(s) ||
        desc.includes(s) ||
        tagLabel.includes(s) ||
        shortType.includes(s) ||
        cat.includes(s) ||
        extra1.includes(s) ||
        badge.includes(s)
      );
    });
  }

  if (category && category !== "Все модели") {
    models = models.filter((m) => m.category === category);
  }

  res.json(models);
});

app.get("/api/datasets", (req, res) => {
  const { search, category } = req.query;
  const db = readDb();
  let datasets = db.datasets || [];

  if (search) {
    const s = search.toLowerCase();
    datasets = datasets.filter((d) => {
      const title = (d.title || "").toLowerCase();
      const desc = (d.description || "").toLowerCase();
      const cat = (d.category || "").toLowerCase();
      const extra1 = (d.extra1 || "").toLowerCase();
      const badge = (d.badge || "").toLowerCase();

      return (
        title.includes(s) ||
        desc.includes(s) ||
        cat.includes(s) ||
        extra1.includes(s) ||
        badge.includes(s)
      );
    });
  }

  if (category && category !== "Все датасеты") {
    datasets = datasets.filter((d) => d.category === category);
  }

  res.json(datasets);
});

app.get("/api/spaces", (req, res) => {
  const { search } = req.query;
  const db = readDb();
  let spaces = db.spaces || [];

  if (search) {
    const s = search.toLowerCase();
    spaces = spaces.filter((sp) => {
      const title = (sp.title || "").toLowerCase();
      const desc = (sp.description || "").toLowerCase();
      const extra1 = (sp.extra1 || "").toLowerCase();
      const badge = (sp.badge || "").toLowerCase();

      return (
        title.includes(s) ||
        desc.includes(s) ||
        extra1.includes(s) ||
        badge.includes(s)
      );
    });
  }

  res.json(spaces);
});

app.get("/api/model/:id", (req, res) => {
  const db = readDb();
  const model = db.models.find((m) => m.id == req.params.id);
  if (!model) return res.status(404).json({ message: "Модель не найдена" });
  res.json(model);
});

app.get("/api/dataset/:id", (req, res) => {
  const db = readDb();
  const dataset = db.datasets.find((d) => d.id == req.params.id);
  if (!dataset) return res.status(404).json({ message: "Датасет не найден" });
  res.json(dataset);
});

app.get("/api/space/:id", (req, res) => {
  const db = readDb();
  const space = db.spaces.find((s) => s.id == req.params.id);
  if (!space)
    return res.status(404).json({ message: "Пространство не найдено" });
  res.json(space);
});

app.listen(PORT, () => {
  console.log(`API запущен на http://localhost:${PORT}`);
});
