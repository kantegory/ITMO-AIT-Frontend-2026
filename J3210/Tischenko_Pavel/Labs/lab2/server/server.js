import path from "node:path";
import { fileURLToPath } from "node:url";

import bcrypt from "bcryptjs";
import cors from "cors";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import jsonServer from "json-server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const TOKEN_TTL = "2h";

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, "..", "client"),
});

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

function readDb() {
  return router.db; // lowdb instance
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

function getAuth(req) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function requireAuth(req, res, next) {
  const payload = getAuth(req);
  if (!payload) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }
  req.user = payload;
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    const payload = getAuth(req);
    if (!payload) {
      res.status(401).json({ message: "Требуется авторизация" });
      return;
    }
    if (payload.role !== role) {
      res.status(403).json({ message: "Недостаточно прав" });
      return;
    }
    req.user = payload;
    next();
  };
}

function allowReadElseRole(role) {
  return (req, res, next) => {
    if (req.method === "GET") {
      next();
      return;
    }
    return requireRole(role)(req, res, next);
  };
}

function allowReadElseAuth(req, res, next) {
  if (req.method === "GET") {
    next();
    return;
  }
  return requireAuth(req, res, next);
}

server.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

server.post("/api/auth/register", async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ message: "email и password обязательны" });
    return;
  }
  if (role && !["student", "teacher"].includes(role)) {
    res.status(400).json({ message: "role должен быть student или teacher" });
    return;
  }

  const db = readDb();
  const existing = db.get("users").find({ email }).value();
  if (existing) {
    res.status(409).json({ message: "Пользователь уже существует" });
    return;
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = {
    id: `u_${nanoid(10)}`,
    email: String(email).toLowerCase(),
    passwordHash,
    firstName: String(firstName || "").trim(),
    lastName: String(lastName || "").trim(),
    role: role || "student",
  };

  db.get("users").push(user).write();

  const token = signToken(user);
  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

server.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ message: "email и password обязательны" });
    return;
  }

  const db = readDb();
  const user = db
    .get("users")
    .find({ email: String(email).toLowerCase() })
    .value();

  if (!user) {
    res.status(401).json({ message: "Неверные данные для входа" });
    return;
  }

  const ok = await bcrypt.compare(String(password), String(user.passwordHash));
  if (!ok) {
    res.status(401).json({ message: "Неверные данные для входа" });
    return;
  }

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

server.get("/api/auth/me", requireAuth, (req, res) => {
  const db = readDb();
  const user = db.get("users").find({ id: req.user.sub }).value();
  if (!user) {
    res.status(404).json({ message: "Пользователь не найден" });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });
});

server.use("/api/users", requireRole("teacher"));
server.use("/api/enrollments", requireAuth);
server.use("/api/courses", allowReadElseRole("teacher"));
server.use("/api/materials", allowReadElseRole("teacher"));
server.use("/api/lessons", allowReadElseRole("teacher"));
server.use("/api/assignments", allowReadElseRole("teacher"));
server.use("/api/threads", allowReadElseAuth);
server.use("/api/messages", allowReadElseAuth);
server.use("/api/certificates", requireAuth);

server.use("/api", router);

server.listen(PORT, () => {
  console.log(`Lab2 server running on http://localhost:${PORT}`);
});

